import { GoogleGenAI } from '@google/genai';
import { db, Item, Match } from './db.js';

// Initialize Gemini SDK with User-Agent header as required by Skill
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Common stop words to exclude from keyword comparison
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from',
  'of', 'is', 'was', 'are', 'were', 'it', 'its', 'my', 'this', 'that', 'near', 'under',
  'left', 'has', 'have', 'had', 'been', 'some', 'any', 'found', 'lost'
]);

function extractKeywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w))
  );
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export interface MatchEvaluationResult {
  similarityScore: number;
  reason: string;
  isAiEvaluated: boolean;
}

export async function evaluateItemPair(lost: Item, found: Item): Promise<MatchEvaluationResult> {
  const lostNameLower = lost.item_name.toLowerCase();
  const foundNameLower = found.item_name.toLowerCase();
  const lostDescLower = (lost.description + ' ' + (lost.additional_details || '')).toLowerCase();
  const foundDescLower = (found.description + ' ' + (found.additional_details || '')).toLowerCase();

  // 1. Category Score (up to 30 points)
  let categoryScore = 0;
  if (lost.category.toLowerCase() === found.category.toLowerCase()) {
    categoryScore = 30;
  } else if (
    (lost.category === 'Wallet' && found.category === 'Accessories') ||
    (lost.category === 'Accessories' && found.category === 'Wallet') ||
    (lost.category === 'Electronics' && found.category === 'Accessories') ||
    (lost.category === 'Accessories' && found.category === 'Electronics') ||
    lost.category === 'Other' ||
    found.category === 'Other'
  ) {
    categoryScore = 20;
  }

  // 2. Keyword & Specific Substring Overlap (up to 40 points)
  let textScore = 0;
  const lostTokens = extractKeywords(`${lost.item_name} ${lost.description} ${lost.additional_details || ''}`);
  const foundTokens = extractKeywords(`${found.item_name} ${found.description} ${found.additional_details || ''}`);
  const jaccard = calculateJaccardSimilarity(lostTokens, foundTokens);

  // Common high-value item nouns
  const coreItemNouns = ['watch', 'phone', 'wallet', 'key', 'keys', 'bag', 'backpack', 'id', 'card', 'book', 'notebook', 'calculator', 'earbud', 'earbuds', 'headphone', 'headphones', 'bottle'];
  let matchedCoreNoun = '';
  for (const noun of coreItemNouns) {
    if (lostNameLower.includes(noun) && foundNameLower.includes(noun)) {
      matchedCoreNoun = noun;
      textScore += 25;
      break;
    }
  }

  // Brand match check
  const brands = ['fastrack', 'titan', 'casio', 'rolex', 'fossil', 'apple', 'iphone', 'samsung', 'oneplus', 'dell', 'hp', 'lenovo', 'boat', 'noise', 'realme', 'redmi', 'wildcraft', 'nike', 'puma', 'adidas'];
  let matchedBrand = '';
  for (const b of brands) {
    if (
      (lostNameLower.includes(b) || lostDescLower.includes(b)) &&
      (foundNameLower.includes(b) || foundDescLower.includes(b))
    ) {
      matchedBrand = b;
      textScore += 15;
      break;
    }
  }

  // Color match check
  const colors = ['black', 'blue', 'brown', 'red', 'white', 'silver', 'gold', 'grey', 'gray', 'green', 'orange', 'yellow', 'pink'];
  let matchedColor = '';
  for (const c of colors) {
    if (
      (lostNameLower.includes(c) || lostDescLower.includes(c)) &&
      (foundNameLower.includes(c) || foundDescLower.includes(c))
    ) {
      matchedColor = c;
      textScore += 8;
      break;
    }
  }

  // If one item name contains the other item name (e.g. "watch" in "black fastrack watch")
  if (lostNameLower.includes(foundNameLower) || foundNameLower.includes(lostNameLower)) {
    textScore += 20;
  }

  // Add Jaccard token overlap
  textScore += Math.round(jaccard * 35);
  textScore = Math.min(40, textScore);

  // If both have matched core noun or brand, boost category score if it was 0
  if (matchedCoreNoun && categoryScore === 0) {
    categoryScore = 20;
  }

  // 3. Location Similarity Score (up to 20 points)
  let locationScore = 0;
  const lostLoc = lost.location.toLowerCase();
  const foundLoc = found.location.toLowerCase();
  if (lostLoc === foundLoc) {
    locationScore = 20;
  } else if (lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc)) {
    locationScore = 18;
  } else {
    // Check shared keywords in location (e.g. "Library", "Cafeteria", "Parking", "Block")
    const locTokensA = extractKeywords(lostLoc);
    const locTokensB = extractKeywords(foundLoc);
    const locJaccard = calculateJaccardSimilarity(locTokensA, locTokensB);
    if (locJaccard > 0) locationScore = 14;
    else if (lostLoc.includes('pragati') && foundLoc.includes('pragati')) locationScore = 10;
  }

  // 4. Date Proximity Score (up to 10 points)
  let dateScore = 0;
  if (lost.date && found.date) {
    const diffMs = Math.abs(new Date(lost.date).getTime() - new Date(found.date).getTime());
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) dateScore = 10;
    else if (diffDays <= 2) dateScore = 9;
    else if (diffDays <= 5) dateScore = 7;
    else if (diffDays <= 10) dateScore = 5;
    else if (diffDays <= 20) dateScore = 3;
  }

  let totalScore = categoryScore + textScore + locationScore + dateScore;
  totalScore = Math.min(96, Math.max(0, totalScore));

  const reasonsList: string[] = [];
  if (matchedCoreNoun) reasonsList.push(`both identify as "${matchedCoreNoun}"`);
  if (matchedBrand) reasonsList.push(`brand matches "${matchedBrand}"`);
  if (matchedColor) reasonsList.push(`color matches "${matchedColor}"`);
  if (locationScore >= 14) reasonsList.push('locations closely correlate');
  if (dateScore >= 7) reasonsList.push('reported within a few days of each other');
  if (categoryScore >= 20) reasonsList.push('matching category classification');

  let reason = reasonsList.length > 0
    ? `Strong match correlation: ${reasonsList.join(', ')}.`
    : `Rule-based evaluation: Category (${categoryScore}/30), text (${textScore}/40), location (${locationScore}/20), date (${dateScore}/10).`;
  
  let isAiEvaluated = false;

  // If score is above 45% and Gemini is available, run an AI verification check
  if (totalScore >= 45 && aiClient) {
    try {
      const prompt = `You are an AI assistant for a Lost & Found university/community platform.
Evaluate whether the following two items could be the same object:

LOST ITEM:
Name: "${lost.item_name}"
Category: "${lost.category}"
Description: "${lost.description}"
Location: "${lost.location}"
Date: "${lost.date}"

FOUND ITEM:
Name: "${found.item_name}"
Category: "${found.category}"
Description: "${found.description}"
Location: "${found.location}"
Date: "${found.date}"

IMPORTANT INSTRUCTIONS:
- You must NOT declare someone as the definite owner.
- You only suggest potential match probability and concise reasons.
- Return a JSON object with:
  - "similarityScore": an integer between 40 and 95 (estimate only)
  - "explanation": a concise 1-2 sentence human-readable explanation explaining what matches (e.g. item type, brand, color, location) and stating verification is required.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        if (typeof parsed.similarityScore === 'number' && parsed.explanation) {
          totalScore = Math.min(95, Math.max(40, parsed.similarityScore));
          reason = `AI Match Analysis: ${parsed.explanation}`;
          isAiEvaluated = true;
        }
      }
    } catch (aiErr) {
      console.warn('Gemini matching evaluation skipped, falling back to rule-based engine:', aiErr);
    }
  }

  return {
    similarityScore: totalScore,
    reason,
    isAiEvaluated,
  };
}

export async function findAndRecordMatchesForItem(item: Item): Promise<Match[]> {
  const counterType = item.type === 'lost' ? 'found' : 'lost';
  const candidates = db.getItems({ type: counterType, status: 'all' })
    .filter(c => c.status !== 'returned' && c.status !== 'closed' && c.item_id !== item.item_id);

  const newMatches: Match[] = [];

  for (const candidate of candidates) {
    const lostItem = item.type === 'lost' ? item : candidate;
    const foundItem = item.type === 'found' ? item : candidate;

    // Check if match already exists
    const existing = db.getMatches().find(
      m => m.lost_item_id === lostItem.item_id && m.found_item_id === foundItem.item_id
    );
    if (existing) continue;

    const evaluation = await evaluateItemPair(lostItem, foundItem);

    // If similarity >= 40%, register potential match
    if (evaluation.similarityScore >= 40) {
      const match = db.createMatch({
        lost_item_id: lostItem.item_id,
        found_item_id: foundItem.item_id,
        similarity_score: evaluation.similarityScore,
        match_reason: evaluation.reason,
        status: 'suggested',
      });
      newMatches.push(match);

      // Update both items to potential_match status if active
      if (lostItem.status === 'active') {
        db.updateItem(lostItem.item_id, { status: 'potential_match' });
      }
      if (foundItem.status === 'active') {
        db.updateItem(foundItem.item_id, { status: 'potential_match' });
      }

      // Notify the person who lost the item
      if (lostItem.user_id !== foundItem.user_id) {
        db.createNotification({
          user_id: lostItem.user_id,
          title: 'Potential Match Found!',
          message: `A found item "${foundItem.item_name}" has a ${evaluation.similarityScore}% match with your lost "${lostItem.item_name}".`,
          type: 'match_found',
          link: '/matches',
        });

        // Notify finder
        db.createNotification({
          user_id: foundItem.user_id,
          title: 'Potential Owner Discovered',
          message: `Your found report for "${foundItem.item_name}" matches a reported lost "${lostItem.item_name}" (${evaluation.similarityScore}% match).`,
          type: 'match_found',
          link: '/matches',
        });
      }
    }
  }

  return newMatches;
}

export async function scanAllItemsForMatches(): Promise<{ scannedCount: number; newMatchesCount: number; matches: Match[] }> {
  const lostItems = db.getItems({ type: 'lost', status: 'all' })
    .filter(i => i.status !== 'returned' && i.status !== 'closed');
  
  let totalNew = 0;
  for (const lost of lostItems) {
    const created = await findAndRecordMatchesForItem(lost);
    totalNew += created.length;
  }

  return {
    scannedCount: lostItems.length,
    newMatchesCount: totalNew,
    matches: db.getMatches(),
  };
}

export async function generateSafeClaimQuestions(item: Item): Promise<string[]> {
  const defaultQuestions = [
    'Describe any unique scratch, sticker, or distinguishing marks.',
    'What was inside or attached to the item when it was last seen?',
    'What exact room, desk, or corner was it lost in?',
    'Can you provide the approximate brand, color variation, or purchase period?'
  ];

  if (!aiClient) return defaultQuestions;

  try {
    const prompt = `For a found item reported on a lost & found platform:
Item Name: "${item.item_name}"
Category: "${item.category}"
Description: "${item.description}"

Generate 3 safe, practical verification questions that only the true owner would know to prove ownership.
CRITICAL SAFETY RULES:
- NEVER ask for passwords, PINs, OTPs, or complete credit card/ID numbers.
- DO ask for subtle physical marks, specific contents, exact compartment details, or purchase context.
Return JSON with key "questions" as an array of strings.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions;
      }
    }
  } catch (err) {
    console.warn('Gemini question generation error, using defaults:', err);
  }

  return defaultQuestions;
}
