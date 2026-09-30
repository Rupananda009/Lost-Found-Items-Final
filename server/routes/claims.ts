import express, { Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUser } from './auth.js';
import { generateSafeClaimQuestions } from '../matcher.js';

const router = express.Router();

// GET /api/claims
router.get('/', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Please log in to view claims.' });
  }

  const { itemId, status, mode } = req.query;

  // If admin, can see all claims
  // If regular user:
  // - "my_claims": claims submitted by this user
  // - "received_claims": claims submitted for items reported by this user
  if (user.role === 'admin') {
    const claims = db.getClaims({
      itemId: itemId as string,
      status: status as string,
    });
    return res.json({ claims });
  }

  if (mode === 'received') {
    // Get items owned by this user
    const myItems = db.getItems({ userId: user.user_id });
    const myItemIds = new Set(myItems.map(i => i.item_id));
    const allClaims = db.getClaims({ status: status as string });
    const received = allClaims.filter(c => myItemIds.has(c.item_id));
    return res.json({ claims: received });
  }

  // Default: claims submitted by this user
  const userClaims = db.getClaims({
    userId: user.user_id,
    itemId: itemId as string,
    status: status as string,
  });

  return res.json({ claims: userClaims });
});

// GET /api/claims/questions/:itemId
router.get('/questions/:itemId', async (req: Request, res: Response) => {
  const item = db.getItemById(req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const questions = await generateSafeClaimQuestions(item);
  return res.json({ questions });
});

// GET /api/claims/:id
router.get('/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const claim = db.getClaimById(req.params.id);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  const item = db.getItemById(claim.item_id);
  // Authorize: claimant, item reporter, or admin
  const isClaimant = claim.user_id === user.user_id;
  const isReporter = item && item.user_id === user.user_id;
  const isAdmin = user.role === 'admin';

  if (!isClaimant && !isReporter && !isAdmin) {
    return res.status(403).json({ error: 'Unauthorized to view this claim' });
  }

  return res.json({ claim, item });
});

// POST /api/claims
router.post('/', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Please log in to submit a claim.' });
    }

    const {
      item_id,
      unique_feature,
      inside_items,
      exact_location,
      proof_notes,
      proof_image_url,
    } = req.body;

    if (!item_id) {
      return res.status(400).json({ error: 'Item ID is required.' });
    }

    const item = db.getItemById(item_id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (item.user_id === user.user_id) {
      return res.status(400).json({ error: 'You cannot claim an item you reported yourself.' });
    }

    if (!unique_feature || !unique_feature.trim()) {
      return res.status(400).json({ error: 'Please describe a unique feature of the item.' });
    }
    if (!exact_location || !exact_location.trim()) {
      return res.status(400).json({ error: 'Please specify where exactly you lost this item.' });
    }

    // Check for existing pending claim by this user for this item
    const existingClaims = db.getClaims({ itemId: item_id, userId: user.user_id });
    if (existingClaims.some(c => c.status === 'pending' || c.status === 'under_review')) {
      return res.status(409).json({ error: 'You already have an active claim under review for this item.' });
    }

    const claim = db.createClaim({
      item_id,
      user_id: user.user_id,
      unique_feature: unique_feature.trim(),
      inside_items: inside_items ? inside_items.trim() : '',
      exact_location: exact_location.trim(),
      proof_notes: proof_notes ? proof_notes.trim() : '',
      proof_image_url: proof_image_url || '',
    });

    return res.status(201).json({
      claim,
      message: 'Claim submitted successfully. The finder and administration will verify your details.',
    });
  } catch (err: any) {
    console.error('Error submitting claim:', err);
    return res.status(500).json({ error: 'Failed to submit claim.' });
  }
});

// PUT /api/claims/:id (update status or notes)
router.put('/:id', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const claim = db.getClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const item = db.getItemById(claim.item_id);
    const isReporter = item && item.user_id === user.user_id;
    const isAdmin = user.role === 'admin';

    if (!isReporter && !isAdmin) {
      return res.status(403).json({ error: 'Only the finder or an administrator can review this claim.' });
    }

    const { status, admin_notes } = req.body;
    const updates: any = {};
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    const updated = db.updateClaim(req.params.id, updates);
    return res.json({
      claim: updated,
      message: `Claim status updated to ${status}.`,
    });
  } catch (err: any) {
    console.error('Error updating claim:', err);
    return res.status(500).json({ error: 'Failed to update claim.' });
  }
});

export default router;
