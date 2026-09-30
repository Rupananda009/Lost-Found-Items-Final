import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getCategoryPlaceholderSvg } from './categoryPlaceholders.js';

export interface User {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'finder' | 'admin';
  profile_image: string;
  phone?: string;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at?: string;
}

export interface Item {
  item_id: string;
  user_id: string;
  user_name?: string;
  type: 'lost' | 'found';
  item_name: string;
  category: string;
  description: string;
  location: string;
  dropoff_location?: string;
  date: string;
  time?: string;
  additional_details?: string;
  image_url?: string;
  contact_preference?: string;
  status: 'active' | 'potential_match' | 'claim_pending' | 'returned' | 'closed';
  is_flagged?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Claim {
  claim_id: string;
  item_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  unique_feature: string;
  inside_items?: string;
  exact_location: string;
  proof_notes?: string;
  proof_image_url?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Match {
  match_id: string;
  lost_item_id: string;
  found_item_id: string;
  similarity_score: number;
  match_reason: string;
  status: 'suggested' | 'confirmed' | 'dismissed';
  created_at: string;
  lost_item?: Item;
  found_item?: Item;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'match_found' | 'claim_submitted' | 'claim_approved' | 'claim_rejected' | 'item_returned' | 'contact_request' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactRequest {
  request_id: string;
  sender_id: string;
  sender_name?: string;
  receiver_id: string;
  item_id: string;
  item_name?: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

interface DatabaseSchema {
  users: User[];
  items: Item[];
  claims: Claim[];
  matches: Match[];
  notifications: Notification[];
  contact_requests: ContactRequest[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial seed data
const initialData: DatabaseSchema = {
  users: [
    {
      user_id: 'usr_admin',
      name: 'Campus Administrator',
      email: 'admin@lostandfound.edu',
      password_hash: hashPassword('admin123'),
      role: 'admin',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+1 (555) 019-2834',
      status: 'active',
      created_at: '2026-09-01T08:00:00Z',
    },
    {
      user_id: 'usr_sarah',
      name: 'Sarah Connor',
      email: 'student@lostandfound.edu',
      password_hash: hashPassword('student123'),
      role: 'user',
      profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      phone: '+1 (555) 012-4491',
      status: 'active',
      created_at: '2026-09-10T10:30:00Z',
    },
    {
      user_id: 'usr_david',
      name: 'David Miller',
      email: 'finder@lostandfound.edu',
      password_hash: hashPassword('finder123'),
      role: 'user',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+1 (555) 018-7729',
      status: 'active',
      created_at: '2026-09-12T14:15:00Z',
    },
  ],
  items: [
    {
      item_id: 'item_lost_wallet',
      user_id: 'usr_sarah',
      user_name: 'Sarah Connor',
      type: 'lost',
      item_name: 'Black Leather Wallet',
      category: 'Wallet',
      description: 'Black bifold leather wallet containing student card and library pass. Lost while studying near the 2nd floor silent reading zone.',
      location: 'College Library',
      date: '2026-09-20',
      time: '14:30',
      additional_details: 'Has a subtle stitch tear on the left corner flap.',
      image_url: '/src/assets/images/item_leather_wallet_1790648969602.jpg',
      contact_preference: 'in_app',
      status: 'potential_match',
      created_at: '2026-09-20T15:00:00Z',
      updated_at: '2026-09-20T17:20:00Z',
    },
    {
      item_id: 'item_found_wallet',
      user_id: 'usr_david',
      user_name: 'David Miller',
      type: 'found',
      item_name: 'Black Leather Bifold Wallet',
      category: 'Wallet',
      description: 'Found a black leather wallet under the wooden desks on the 2nd floor. Kept safely with desk supervisor.',
      location: 'College Library',
      date: '2026-09-20',
      time: '17:00',
      additional_details: 'Contains cards. Genuine owner must specify the cards inside.',
      image_url: '/src/assets/images/item_leather_wallet_1790648969602.jpg',
      contact_preference: 'in_app',
      status: 'potential_match',
      created_at: '2026-09-20T17:15:00Z',
      updated_at: '2026-09-20T17:20:00Z',
    },
    {
      item_id: 'item_lost_backpack',
      user_id: 'usr_sarah',
      user_name: 'Sarah Connor',
      type: 'lost',
      item_name: 'Blue Canvas Backpack',
      category: 'Bags',
      description: 'Navy blue Herschel-style canvas backpack with brown leather strap pulls. Has my notebook and water bottle.',
      location: 'Student Center Bus Stop',
      date: '2026-09-22',
      time: '09:15',
      additional_details: 'Keychain of a silver star attached to the top zip.',
      image_url: '/src/assets/images/item_blue_backpack_1790648983361.jpg',
      contact_preference: 'in_app',
      status: 'active',
      created_at: '2026-09-22T10:00:00Z',
      updated_at: '2026-09-22T10:00:00Z',
    },
    {
      item_id: 'item_found_phone',
      user_id: 'usr_david',
      user_name: 'David Miller',
      type: 'found',
      item_name: 'Samsung Galaxy Smartphone',
      category: 'Electronics',
      description: 'Dark gray Samsung Galaxy phone with a clear protective bumper case found on cafeteria table 4 after lunch rush.',
      location: 'Cafeteria Main Hall',
      date: '2026-09-25',
      time: '13:10',
      additional_details: 'Lock screen has an abstract wallpaper. Turned in at front security desk.',
      image_url: '/src/assets/images/item_smartphone_1790648994956.jpg',
      contact_preference: 'in_app',
      status: 'active',
      created_at: '2026-09-25T13:45:00Z',
      updated_at: '2026-09-25T13:45:00Z',
    },
    {
      item_id: 'item_lost_id',
      user_id: 'usr_sarah',
      user_name: 'Sarah Connor',
      type: 'lost',
      item_name: 'University Student ID Card',
      category: 'Documents',
      description: 'Student ID card issued for Computer Science Dept. Stored in a blue transparent lanyard badge holder.',
      location: 'Main Academic Block A',
      date: '2026-09-26',
      time: '11:00',
      additional_details: 'Has CS department sticker on the rear side.',
      image_url: '/src/assets/images/hero_lost_and_found_1790648956713.jpg',
      contact_preference: 'in_app',
      status: 'active',
      created_at: '2026-09-26T11:30:00Z',
      updated_at: '2026-09-26T11:30:00Z',
    },
    {
      item_id: 'item_found_keys',
      user_id: 'usr_david',
      user_name: 'David Miller',
      type: 'found',
      item_name: 'Car Key with Red Keychain',
      category: 'Keys',
      description: 'Single black electronic fob key with a miniature red metal carabiner keychain found beside parking stall #14.',
      location: 'West Parking Lot B',
      date: '2026-09-27',
      time: '08:45',
      additional_details: 'Turned into campus security booth.',
      image_url: '/src/assets/images/hero_lost_and_found_1790648956713.jpg',
      contact_preference: 'in_app',
      status: 'active',
      created_at: '2026-09-27T09:00:00Z',
      updated_at: '2026-09-27T09:00:00Z',
    },
    {
      item_id: 'item_returned_book',
      user_id: 'usr_sarah',
      user_name: 'Sarah Connor',
      type: 'lost',
      item_name: 'Calculus 8th Edition Textbook',
      category: 'Books',
      description: 'Hardcover mathematics textbook with yellow highlighted formulas throughout Chapter 4.',
      location: 'Science Hall 102',
      date: '2026-09-18',
      time: '16:00',
      additional_details: 'Returned safely to owner on Sep 19.',
      image_url: '/src/assets/images/hero_lost_and_found_1790648956713.jpg',
      contact_preference: 'in_app',
      status: 'returned',
      created_at: '2026-09-18T16:30:00Z',
      updated_at: '2026-09-19T10:00:00Z',
    }
  ],
  claims: [
    {
      claim_id: 'claim_sample_01',
      item_id: 'item_found_wallet',
      user_id: 'usr_sarah',
      user_name: 'Sarah Connor',
      user_email: 'student@lostandfound.edu',
      unique_feature: 'Inside right pocket has a silver college library barcode and a slight red ink dot on the inner seam.',
      inside_items: 'College ID card for Sarah C, local transit pass, and 2 loyalty cards.',
      exact_location: 'Table 14 near the second floor window in the quiet zone.',
      proof_notes: 'I can provide matching student ID number or unlock my college portal in person.',
      status: 'pending',
      created_at: '2026-09-21T09:00:00Z',
    }
  ],
  matches: [
    {
      match_id: 'match_wallet_001',
      lost_item_id: 'item_lost_wallet',
      found_item_id: 'item_found_wallet',
      similarity_score: 88,
      match_reason: 'Category "Wallet" matches, exact location "College Library" matches, incident date "2026-09-20" matches, and high semantic keyword overlap ("black leather bifold wallet").',
      status: 'suggested',
      created_at: '2026-09-20T17:20:00Z',
    }
  ],
  notifications: [
    {
      notification_id: 'notif_001',
      user_id: 'usr_sarah',
      title: 'Potential match found for your lost wallet',
      message: 'A "Black Leather Bifold Wallet" found at College Library on Sep 20 matches your report with an 88% similarity estimate.',
      type: 'match_found',
      link: '/matches',
      is_read: false,
      created_at: '2026-09-20T17:21:00Z',
    },
    {
      notification_id: 'notif_002',
      user_id: 'usr_david',
      title: 'New claim submitted for found item',
      message: 'A student submitted an ownership claim for "Black Leather Bifold Wallet". Please review the unique verification details.',
      type: 'claim_submitted',
      link: '/claims',
      is_read: false,
      created_at: '2026-09-21T09:02:00Z',
    }
  ],
  contact_requests: [
    {
      request_id: 'req_001',
      sender_id: 'usr_sarah',
      sender_name: 'Sarah Connor',
      receiver_id: 'usr_david',
      item_id: 'item_found_wallet',
      item_name: 'Black Leather Bifold Wallet',
      message: 'Hi David! Thank you so much for turning in the wallet. I submitted the claim details with my ID card info. When is a good time to meet at Campus Security?',
      status: 'pending',
      created_at: '2026-09-21T09:05:00Z',
    }
  ]
};

export function hashPassword(plain: string): string {
  return crypto.createHash('sha256').update(`lf_salt_${plain}`).digest('hex');
}

export function verifyPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    this.ensureDirectory();
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all keys exist
        return {
          users: parsed.users || initialData.users,
          items: parsed.items || initialData.items,
          claims: parsed.claims || initialData.claims,
          matches: parsed.matches || initialData.matches,
          notifications: parsed.notifications || initialData.notifications,
          contact_requests: parsed.contact_requests || initialData.contact_requests,
        };
      }
    } catch (err) {
      console.error('Failed to read db file, using seed data:', err);
    }

    this.saveData(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }

  private saveData(data: DatabaseSchema) {
    this.ensureDirectory();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db file:', err);
    }
  }

  public resetToSeed(): DatabaseSchema {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.saveData(this.data);
    return this.data;
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.user_id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'user_id' | 'created_at'>): User {
    const newUser: User = {
      ...user,
      user_id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.data.users.findIndex(u => u.user_id === id);
    if (index === -1) return undefined;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.users[index];
  }

  public deleteUser(id: string): boolean {
    const prevLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.user_id !== id);
    if (this.data.users.length !== prevLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- ITEMS ---
  public getItems(filters?: {
    type?: string;
    category?: string;
    status?: string;
    location?: string;
    query?: string;
    userId?: string;
  }): Item[] {
    let items = [...this.data.items];

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        items = items.filter(i => i.type === filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        items = items.filter(i => i.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.status && filters.status !== 'all') {
        items = items.filter(i => i.status === filters.status);
      }
      if (filters.location && filters.location !== 'all') {
        items = items.filter(i => i.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.userId) {
        items = items.filter(i => i.user_id === filters.userId);
      }
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        items = items.filter(i =>
          i.item_name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.additional_details && i.additional_details.toLowerCase().includes(q))
        );
      }
    }

    // Sort by created_at descending
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getItemById(id: string): Item | undefined {
    return this.data.items.find(i => i.item_id === id);
  }

  public createItem(item: Omit<Item, 'item_id' | 'created_at' | 'status'> & { status?: Item['status'] }): Item {
    const user = this.getUserById(item.user_id);
    
    // Ensure image is accurate and never a mismatched wallet photo on non-wallet items
    let finalImageUrl = item.image_url;
    const itemNameLower = (item.item_name || '').toLowerCase();
    const isWallet = itemNameLower.includes('wallet') || item.category.toLowerCase() === 'wallet';
    
    if (!finalImageUrl || (finalImageUrl.includes('item_leather_wallet') && !isWallet) || finalImageUrl.includes('hero_lost_and_found')) {
      finalImageUrl = getCategoryPlaceholderSvg(item.category, item.item_name);
    }

    const newItem: Item = {
      ...item,
      image_url: finalImageUrl,
      dropoff_location: item.dropoff_location || '',
      user_name: user ? user.name : (item.user_name || 'Anonymous'),
      item_id: `item_${crypto.randomUUID().slice(0, 8)}`,
      status: item.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.items.unshift(newItem);
    this.saveData(this.data);
    return newItem;
  }

  public updateItem(id: string, updates: Partial<Item>): Item | undefined {
    const index = this.data.items.findIndex(i => i.item_id === id);
    if (index === -1) return undefined;
    this.data.items[index] = {
      ...this.data.items[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.items[index];
  }

  public deleteItem(id: string): boolean {
    const prevLen = this.data.items.length;
    this.data.items = this.data.items.filter(i => i.item_id !== id);
    // Also remove related claims, matches
    this.data.claims = this.data.claims.filter(c => c.item_id !== id);
    this.data.matches = this.data.matches.filter(m => m.lost_item_id !== id && m.found_item_id !== id);
    if (this.data.items.length !== prevLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- CLAIMS ---
  public getClaims(filters?: { itemId?: string; userId?: string; status?: string }): Claim[] {
    let claims = [...this.data.claims];
    if (filters) {
      if (filters.itemId) claims = claims.filter(c => c.item_id === filters.itemId);
      if (filters.userId) claims = claims.filter(c => c.user_id === filters.userId);
      if (filters.status && filters.status !== 'all') claims = claims.filter(c => c.status === filters.status);
    }
    return claims.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getClaimById(id: string): Claim | undefined {
    return this.data.claims.find(c => c.claim_id === id);
  }

  public createClaim(claim: Omit<Claim, 'claim_id' | 'created_at' | 'status'>): Claim {
    const user = this.getUserById(claim.user_id);
    const newClaim: Claim = {
      ...claim,
      user_name: user ? user.name : 'Claimant',
      user_email: user ? user.email : '',
      claim_id: `claim_${crypto.randomUUID().slice(0, 8)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.claims.unshift(newClaim);

    // Update item status to claim_pending
    this.updateItem(claim.item_id, { status: 'claim_pending' });

    // Notify item reporter
    const item = this.getItemById(claim.item_id);
    if (item && item.user_id !== claim.user_id) {
      this.createNotification({
        user_id: item.user_id,
        title: 'New Claim Received',
        message: `A user has submitted an ownership claim for "${item.item_name}". Check verification details in your dashboard.`,
        type: 'claim_submitted',
        link: '/claims',
      });
    }

    this.saveData(this.data);
    return newClaim;
  }

  public updateClaim(id: string, updates: Partial<Claim>): Claim | undefined {
    const index = this.data.claims.findIndex(c => c.claim_id === id);
    if (index === -1) return undefined;
    const prevStatus = this.data.claims[index].status;
    this.data.claims[index] = {
      ...this.data.claims[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const claim = this.data.claims[index];
    const item = this.getItemById(claim.item_id);

    // If claim approved, mark item returned or completed
    if (updates.status && updates.status !== prevStatus) {
      if (updates.status === 'approved') {
        if (item) {
          this.updateItem(item.item_id, { status: 'returned' });
        }
        this.createNotification({
          user_id: claim.user_id,
          title: 'Claim Approved!',
          message: `Your claim for "${item ? item.item_name : 'the item'}" has been approved! Connect with the finder or campus admin to arrange pickup.`,
          type: 'claim_approved',
          link: '/claims',
        });
      } else if (updates.status === 'rejected') {
        if (item) {
          this.updateItem(item.item_id, { status: 'active' });
        }
        this.createNotification({
          user_id: claim.user_id,
          title: 'Claim Update: Additional Proof Needed',
          message: `Your claim for "${item ? item.item_name : 'the item'}" could not be confirmed with the provided details. ${updates.admin_notes || ''}`,
          type: 'claim_rejected',
          link: '/claims',
        });
      } else if (updates.status === 'completed') {
        if (item) {
          this.updateItem(item.item_id, { status: 'returned' });
        }
        this.createNotification({
          user_id: claim.user_id,
          title: 'Recovery Case Closed',
          message: `Item "${item ? item.item_name : 'the item'}" has been marked returned. Thank you for using Lost & Found!`,
          type: 'item_returned',
          link: '/claims',
        });
      }
    }

    this.saveData(this.data);
    return this.data.claims[index];
  }

  // --- MATCHES ---
  public getMatches(filters?: { lostItemId?: string; foundItemId?: string; userId?: string }): Match[] {
    let matches = this.data.matches.map(m => {
      return {
        ...m,
        lost_item: this.getItemById(m.lost_item_id),
        found_item: this.getItemById(m.found_item_id),
      };
    });

    if (filters) {
      if (filters.lostItemId) matches = matches.filter(m => m.lost_item_id === filters.lostItemId);
      if (filters.foundItemId) matches = matches.filter(m => m.found_item_id === filters.foundItemId);
      if (filters.userId) {
        matches = matches.filter(m =>
          (m.lost_item && m.lost_item.user_id === filters.userId) ||
          (m.found_item && m.found_item.user_id === filters.userId)
        );
      }
    }

    return matches.sort((a, b) => b.similarity_score - a.similarity_score);
  }

  public createMatch(match: Omit<Match, 'match_id' | 'created_at'>): Match {
    // Check if match already exists
    const existing = this.data.matches.find(
      m => m.lost_item_id === match.lost_item_id && m.found_item_id === match.found_item_id
    );
    if (existing) {
      existing.similarity_score = match.similarity_score;
      existing.match_reason = match.match_reason;
      this.saveData(this.data);
      return existing;
    }

    const newMatch: Match = {
      ...match,
      match_id: `match_${crypto.randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.data.matches.unshift(newMatch);

    // Notify lost item owner
    const lostItem = this.getItemById(match.lost_item_id);
    const foundItem = this.getItemById(match.found_item_id);
    if (lostItem) {
      this.createNotification({
        user_id: lostItem.user_id,
        title: `Potential Match Detected (${match.similarity_score}%)`,
        message: `A found item "${foundItem ? foundItem.item_name : 'matching your item'}" matches your lost "${lostItem.item_name}" report.`,
        type: 'match_found',
        link: '/matches',
      });
      this.updateItem(lostItem.item_id, { status: 'potential_match' });
    }
    if (foundItem) {
      this.updateItem(foundItem.item_id, { status: 'potential_match' });
    }

    this.saveData(this.data);
    return newMatch;
  }

  public updateMatchStatus(matchId: string, status: Match['status']): Match | undefined {
    const match = this.data.matches.find(m => m.match_id === matchId);
    if (match) {
      match.status = status;
      this.saveData(this.data);
    }
    return match;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createNotification(notif: Omit<Notification, 'notification_id' | 'created_at' | 'is_read'>): Notification {
    const newNotif: Notification = {
      ...notif,
      notification_id: `notif_${crypto.randomUUID().slice(0, 8)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    this.saveData(this.data);
    return newNotif;
  }

  public markNotificationAsRead(id: string): boolean {
    const n = this.data.notifications.find(item => item.notification_id === id);
    if (n) {
      n.is_read = true;
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.data.notifications.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    this.saveData(this.data);
  }

  // --- CONTACT REQUESTS ---
  public getContactRequests(userId: string): ContactRequest[] {
    return this.data.contact_requests
      .filter(r => r.sender_id === userId || r.receiver_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createContactRequest(req: Omit<ContactRequest, 'request_id' | 'created_at' | 'status'>): ContactRequest {
    const sender = this.getUserById(req.sender_id);
    const item = this.getItemById(req.item_id);
    const newReq: ContactRequest = {
      ...req,
      sender_name: sender ? sender.name : 'A Member',
      item_name: item ? item.item_name : 'Reported Item',
      request_id: `req_${crypto.randomUUID().slice(0, 8)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.data.contact_requests.unshift(newReq);

    // Notify receiver
    this.createNotification({
      user_id: req.receiver_id,
      title: 'New Safe Message',
      message: `${newReq.sender_name} sent a message regarding "${newReq.item_name}".`,
      type: 'contact_request',
      link: '/claims',
    });

    this.saveData(this.data);
    return newReq;
  }

  // --- STATS ---
  public getStatistics() {
    const usersCount = this.data.users.length;
    const lostCount = this.data.items.filter(i => i.type === 'lost').length;
    const foundCount = this.data.items.filter(i => i.type === 'found').length;
    const returnedCount = this.data.items.filter(i => i.status === 'returned').length;
    const matchesCount = this.data.matches.length;
    const claimsCount = this.data.claims.length;

    // Categories breakdown
    const categoryCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    this.data.items.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
    });

    return {
      totalUsers: usersCount,
      totalLost: lostCount,
      totalFound: foundCount,
      totalMatches: matchesCount,
      totalClaims: claimsCount,
      totalReturned: returnedCount,
      categoryBreakdown: categoryCounts,
      locationBreakdown: locationCounts,
      recoveryRate: lostCount + foundCount > 0 ? Math.round((returnedCount / (lostCount + foundCount)) * 100) : 0,
    };
  }
}

export const db = new Database();
