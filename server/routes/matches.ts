import express, { Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUser } from './auth.js';
import { evaluateItemPair, scanAllItemsForMatches } from '../matcher.js';

const router = express.Router();

// GET /api/matches
router.get('/', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const { lostItemId, foundItemId, filter } = req.query;

  let matches = db.getMatches({
    lostItemId: lostItemId as string,
    foundItemId: foundItemId as string,
    userId: filter === 'mine' && user ? user.user_id : undefined,
  });

  return res.json({ matches, count: matches.length });
});

// POST /api/matches/scan (re-run match engine across all active items)
router.post('/scan', async (_req: Request, res: Response) => {
  try {
    const result = await scanAllItemsForMatches();
    return res.json({
      message: `Scanned ${result.scannedCount} lost items. Generated ${result.newMatchesCount} new potential matches.`,
      ...result,
    });
  } catch (err: any) {
    console.error('Scan error:', err);
    return res.status(500).json({ error: 'Failed to complete matching scan.' });
  }
});

// GET /api/matches/:id
router.get('/:id', (req: Request, res: Response) => {
  const matches = db.getMatches();
  const match = matches.find(m => m.match_id === req.params.id);
  if (!match) {
    return res.status(404).json({ error: 'Match record not found' });
  }
  return res.json({ match });
});

// POST /api/matches/evaluate (compare any lost item and found item)
router.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const { lostItemId, foundItemId } = req.body;
    if (!lostItemId || !foundItemId) {
      return res.status(400).json({ error: 'Both lostItemId and foundItemId are required' });
    }

    const lost = db.getItemById(lostItemId);
    const found = db.getItemById(foundItemId);

    if (!lost || !found) {
      return res.status(404).json({ error: 'One or both items could not be found' });
    }

    const evaluation = await evaluateItemPair(lost, found);
    return res.json({
      lost,
      found,
      evaluation,
    });
  } catch (err: any) {
    console.error('Match evaluation error:', err);
    return res.status(500).json({ error: 'Unable to evaluate item match.' });
  }
});

// PUT /api/matches/:id/status
router.put('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['suggested', 'confirmed', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid match status' });
  }

  const updated = db.updateMatchStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Match record not found' });
  }

  return res.json({ match: updated, message: `Match status marked as ${status}.` });
});

export default router;
