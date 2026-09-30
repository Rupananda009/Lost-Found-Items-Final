import express, { Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUser } from './auth.js';

const router = express.Router();

// GET /api/contact-requests
router.get('/', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Please log in to view messages.' });
  }

  const requests = db.getContactRequests(user.user_id);
  return res.json({ requests });
});

// POST /api/contact-requests
router.post('/', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Please log in to send a message.' });
  }

  const { item_id, message } = req.body;
  if (!item_id || !message || !message.trim()) {
    return res.status(400).json({ error: 'Item and message text are required.' });
  }

  const item = db.getItemById(item_id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  if (item.user_id === user.user_id) {
    return res.status(400).json({ error: 'You cannot contact yourself.' });
  }

  const newRequest = db.createContactRequest({
    sender_id: user.user_id,
    receiver_id: item.user_id,
    item_id,
    message: message.trim(),
  });

  return res.status(201).json({
    request: newRequest,
    message: 'Message delivered securely. The recipient will receive an alert in their inbox.',
  });
});

export default router;
