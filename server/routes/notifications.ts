import express, { Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUser } from './auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Please log in to view notifications.' });
  }

  const notifications = db.getNotifications(user.user_id);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return res.json({ notifications, unreadCount });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const success = db.markNotificationAsRead(req.params.id);
  return res.json({ success });
});

// PUT /api/notifications/read-all
router.put('/read-all', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  db.markAllNotificationsAsRead(user.user_id);
  return res.json({ success: true, message: 'All notifications marked as read.' });
});

export default router;
