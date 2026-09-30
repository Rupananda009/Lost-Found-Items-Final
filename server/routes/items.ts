import express, { Request, Response } from 'express';
import { db } from '../db.js';
import { getAuthenticatedUser } from './auth.js';
import { findAndRecordMatchesForItem } from '../matcher.js';

const router = express.Router();

// GET /api/items (with filter query params)
router.get('/', (req: Request, res: Response) => {
  try {
    const { type, category, status, location, query, userId } = req.query;

    const items = db.getItems({
      type: type as string,
      category: category as string,
      status: status as string,
      location: location as string,
      query: query as string,
      userId: userId as string,
    });

    return res.json({ items, count: items.length });
  } catch (err: any) {
    console.error('Error fetching items:', err);
    return res.status(500).json({ error: 'Failed to retrieve items.' });
  }
});

// GET /api/items/search (dedicated search endpoint)
router.get('/search', (req: Request, res: Response) => {
  try {
    const { q, category, location, type } = req.query;
    const items = db.getItems({
      query: (q as string) || '',
      category: category as string,
      location: location as string,
      type: type as string,
    });
    return res.json({ items, count: items.length });
  } catch (err: any) {
    return res.status(500).json({ error: 'Search failed.' });
  }
});

// GET /api/items/:id
router.get('/:id', (req: Request, res: Response) => {
  const item = db.getItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  // Sanitize reporter contact info for public view
  const reporter = db.getUserById(item.user_id);
  const safeReporter = reporter
    ? {
        name: reporter.name,
        profile_image: reporter.profile_image,
        role: reporter.role,
        // Notice: Never expose email or phone publicly on the item page
      }
    : { name: 'Campus Community Member' };

  return res.json({
    item,
    reporter: safeReporter,
  });
});

// POST /api/items/lost
router.post('/lost', async (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Please log in to report a lost item.' });
    }

    const {
      item_name,
      category,
      description,
      location,
      dropoff_location,
      date,
      time,
      additional_details,
      image_url,
      contact_preference,
    } = req.body;

    if (!item_name || !item_name.trim()) {
      return res.status(400).json({ error: 'Please enter an item name.' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Please select a category.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Please provide an item description.' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Please specify the location where it was lost.' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Please select the approximate date.' });
    }

    const newItem = db.createItem({
      user_id: user.user_id,
      user_name: user.name,
      type: 'lost',
      item_name: item_name.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      dropoff_location: dropoff_location ? dropoff_location.trim() : '',
      date,
      time: time || '',
      additional_details: additional_details ? additional_details.trim() : '',
      image_url: image_url || '',
      contact_preference: contact_preference || 'in_app',
      status: 'active',
    });

    // Run matching engine asynchronously in background
    findAndRecordMatchesForItem(newItem).catch(err => {
      console.warn('Matching engine notice:', err);
    });

    return res.status(201).json({
      item: newItem,
      message: 'Item reported successfully.',
    });
  } catch (err: any) {
    console.error('Error reporting lost item:', err);
    return res.status(500).json({ error: 'Unable to report lost item. Please try again.' });
  }
});

// POST /api/items/found
router.post('/found', async (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Please log in to report a found item.' });
    }

    const {
      item_name,
      category,
      description,
      location,
      dropoff_location,
      date,
      time,
      additional_details,
      image_url,
      contact_preference,
    } = req.body;

    if (!item_name || !item_name.trim()) {
      return res.status(400).json({ error: 'Please enter an item name.' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Please select a category.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Please provide an item description.' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Please specify where you found this item.' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Please select the date.' });
    }

    const newItem = db.createItem({
      user_id: user.user_id,
      user_name: user.name,
      type: 'found',
      item_name: item_name.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      dropoff_location: dropoff_location ? dropoff_location.trim() : '',
      date,
      time: time || '',
      additional_details: additional_details ? additional_details.trim() : '',
      image_url: image_url || '',
      contact_preference: contact_preference || 'in_app',
      status: 'active',
    });

    // Run matching engine asynchronously
    findAndRecordMatchesForItem(newItem).catch(err => {
      console.warn('Matching engine notice:', err);
    });

    return res.status(201).json({
      item: newItem,
      message: 'Item reported successfully.',
    });
  } catch (err: any) {
    console.error('Error reporting found item:', err);
    return res.status(500).json({ error: 'Unable to report found item. Please try again.' });
  }
});

// PUT /api/items/:id (update item)
router.put('/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const existing = db.getItemById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Only owner or admin can edit
  if (existing.user_id !== user.user_id && user.role !== 'admin') {
    return res.status(403).json({ error: 'You do not have permission to modify this item.' });
  }

  const {
    item_name,
    category,
    description,
    location,
    date,
    time,
    additional_details,
    image_url,
    status,
  } = req.body;

  const updates: any = {};
  if (item_name) updates.item_name = item_name.trim();
  if (category) updates.category = category;
  if (description) updates.description = description.trim();
  if (location) updates.location = location.trim();
  if (date) updates.date = date;
  if (time !== undefined) updates.time = time;
  if (additional_details !== undefined) updates.additional_details = additional_details;
  if (image_url) updates.image_url = image_url;
  if (status) updates.status = status;

  const updated = db.updateItem(req.params.id, updates);
  return res.json({ item: updated, message: 'Item updated successfully.' });
});

// DELETE /api/items/:id
router.delete('/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const existing = db.getItemById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Item not found' });
  }

  if (existing.user_id !== user.user_id && user.role !== 'admin') {
    return res.status(403).json({ error: 'You do not have permission to delete this item.' });
  }

  db.deleteItem(req.params.id);
  return res.json({ success: true, message: 'Item listing removed.' });
});

export default router;
