import express, { Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUser } from './auth.js';

const router = express.Router();

// Middleware: Admin only
function requireAdmin(req: Request, res: Response, next: express.NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative privileges required.' });
  }
  next();
}

// GET /api/admin/stats
router.get('/stats', requireAdmin, (_req: Request, res: Response) => {
  const stats = db.getStatistics();
  return res.json({ stats });
});

// GET /api/admin/users
router.get('/users', requireAdmin, (_req: Request, res: Response) => {
  const users = db.getUsers().map(u => {
    const { password_hash, ...safe } = u;
    return safe;
  });
  return res.json({ users });
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid user status' });
  }

  const updated = db.updateUser(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password_hash, ...safe } = updated;
  return res.json({ user: safe, message: `User status changed to ${status}.` });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', requireAdmin, (req: Request, res: Response) => {
  if (req.params.id === 'usr_admin') {
    return res.status(400).json({ error: 'Cannot delete the master admin account.' });
  }
  const deleted = db.deleteUser(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ success: true, message: 'User deleted.' });
});

// GET /api/admin/items
router.get('/items', requireAdmin, (_req: Request, res: Response) => {
  const items = db.getItems();
  return res.json({ items });
});

// PUT /api/admin/items/:id/flag
router.put('/items/:id/flag', requireAdmin, (req: Request, res: Response) => {
  const { is_flagged } = req.body;
  const updated = db.updateItem(req.params.id, { is_flagged: !!is_flagged });
  if (!updated) {
    return res.status(404).json({ error: 'Item not found' });
  }
  return res.json({ item: updated, message: `Item flag set to ${is_flagged}.` });
});

// DELETE /api/admin/items/:id
router.delete('/items/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteItem(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Item not found' });
  }
  return res.json({ success: true, message: 'Item listing removed by administrator.' });
});

// GET /api/admin/claims
router.get('/claims', requireAdmin, (_req: Request, res: Response) => {
  const claims = db.getClaims();
  return res.json({ claims });
});

// POST /api/admin/reset-seed (Fast demo reset)
router.post('/reset-seed', requireAdmin, (_req: Request, res: Response) => {
  db.resetToSeed();
  return res.json({ success: true, message: 'Database reset to demo seed state.' });
});

export default router;
