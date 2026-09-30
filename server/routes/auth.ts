import express, { Request, Response } from 'express';
import { db, hashPassword, verifyPassword } from '../db.js';

const router = express.Router();

// Helper to get active user ID from Authorization or custom header
export function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.authorization;
  const customUserHeader = req.headers['x-user-id'] as string;
  
  if (customUserHeader) {
    const user = db.getUserById(customUserHeader);
    if (user && user.status === 'active') return user;
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Simple bearer user id or token
    const user = db.getUserById(token);
    if (user && user.status === 'active') return user;
  }

  return null;
}

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, profile_image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter name, email, and password.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: hashPassword(password),
      role: role === 'admin' ? 'admin' : (role === 'finder' ? 'user' : 'user'),
      profile_image: profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      phone: phone || '',
      status: 'active',
    });

    // Generate welcome notification
    db.createNotification({
      user_id: newUser.user_id,
      title: 'Welcome to Lost & Found!',
      message: 'Your account is ready. You can now report lost belongings, report found items, or browse the directory.',
      type: 'system',
      link: '/browse',
    });

    // Don't return password hash
    const { password_hash, ...safeUser } = newUser;
    return res.status(201).json({
      user: safeUser,
      token: safeUser.user_id,
      message: 'Account created successfully.',
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Unable to complete registration. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter your email and password.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended by campus administration.' });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    const { password_hash, ...safeUser } = user;
    return res.json({
      user: safeUser,
      token: safeUser.user_id,
      message: 'Logged in successfully.',
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Unable to log in at this moment.' });
  }
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { password_hash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// POST /api/auth/switch-demo
// Fast role switcher for instant demonstration
router.post('/switch-demo', (req: Request, res: Response) => {
  const { demoType } = req.body; // 'admin', 'sarah', 'david'
  let targetId = 'usr_sarah';

  if (demoType === 'admin') {
    targetId = 'usr_admin';
  } else if (demoType === 'david' || demoType === 'finder') {
    targetId = 'usr_david';
  } else {
    targetId = 'usr_sarah';
  }

  const user = db.getUserById(targetId);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  const { password_hash, ...safeUser } = user;
  return res.json({
    user: safeUser,
    token: safeUser.user_id,
    message: `Switched to demo persona: ${safeUser.name} (${safeUser.role})`,
  });
});

// PUT /api/auth/profile
router.put('/profile', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Please log in to update your profile.' });
  }

  const { name, phone, profile_image, password } = req.body;
  const updates: any = {};

  if (name && name.trim()) updates.name = name.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (profile_image !== undefined) updates.profile_image = profile_image;
  if (password && password.length >= 6) {
    updates.password_hash = hashPassword(password);
  }

  const updated = db.updateUser(user.user_id, updates);
  if (!updated) {
    return res.status(400).json({ error: 'Failed to update profile.' });
  }

  const { password_hash, ...safeUser } = updated;
  return res.json({ user: safeUser, message: 'Profile updated successfully.' });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully.' });
});

export default router;
