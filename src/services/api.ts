import { User, Item, Claim, Match, Notification, ContactRequest, Statistics } from '../types';

const TOKEN_KEY = 'lf_token';
const USER_KEY = 'lf_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-user-id'] = token;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data as T;
}

export const api = {
  // --- AUTH ---
  async register(data: { name: string; email: string; password: string; role?: string; phone?: string; profile_image?: string }) {
    const res = await request<{ user: User; token: string; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredSession(res.token, res.user);
    return res;
  },

  async login(data: { email: string; password: string }) {
    const res = await request<{ user: User; token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredSession(res.token, res.user);
    return res;
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  async switchDemo(demoType: 'admin' | 'sarah' | 'david') {
    const res = await request<{ user: User; token: string; message: string }>('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ demoType }),
    });
    setStoredSession(res.token, res.user);
    return res;
  },

  async updateProfile(updates: Partial<User> & { password?: string }) {
    return request<{ user: User; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      clearStoredSession();
    }
  },

  // --- ITEMS ---
  async getItems(filters?: { type?: string; category?: string; status?: string; location?: string; query?: string; userId?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.query) params.append('query', filters.query);
      if (filters.userId) params.append('userId', filters.userId);
    }
    return request<{ items: Item[]; count: number }>(`/api/items?${params.toString()}`);
  },

  async getItem(id: string) {
    return request<{ item: Item; reporter: Partial<User> }>(`/api/items/${id}`);
  },

  async reportLost(data: Partial<Item>) {
    return request<{ item: Item; message: string }>('/api/items/lost', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async reportFound(data: Partial<Item>) {
    return request<{ item: Item; message: string }>('/api/items/found', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateItem(id: string, updates: Partial<Item>) {
    return request<{ item: Item; message: string }>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteItem(id: string) {
    return request<{ success: boolean; message: string }>(`/api/items/${id}`, {
      method: 'DELETE',
    });
  },

  // --- CLAIMS ---
  async getClaims(filters?: { itemId?: string; status?: string; mode?: 'submitted' | 'received' }) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.itemId) params.append('itemId', filters.itemId);
      if (filters.status) params.append('status', filters.status);
      if (filters.mode) params.append('mode', filters.mode);
    }
    return request<{ claims: Claim[] }>(`/api/claims?${params.toString()}`);
  },

  async getClaimQuestions(itemId: string) {
    return request<{ questions: string[] }>(`/api/claims/questions/${itemId}`);
  },

  async submitClaim(data: {
    item_id: string;
    unique_feature: string;
    inside_items?: string;
    exact_location: string;
    proof_notes?: string;
    proof_image_url?: string;
  }) {
    return request<{ claim: Claim; message: string }>('/api/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClaim(id: string, updates: { status?: Claim['status']; admin_notes?: string }) {
    return request<{ claim: Claim; message: string }>(`/api/claims/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // --- MATCHES ---
  async scanMatches() {
    return request<{ message: string; scannedCount: number; newMatchesCount: number; matches: Match[] }>('/api/matches/scan', {
      method: 'POST',
    });
  },

  async getMatches(filters?: { filter?: 'all' | 'mine'; lostItemId?: string; foundItemId?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.filter) params.append('filter', filters.filter);
      if (filters.lostItemId) params.append('lostItemId', filters.lostItemId);
      if (filters.foundItemId) params.append('foundItemId', filters.foundItemId);
    }
    return request<{ matches: Match[]; count: number }>(`/api/matches?${params.toString()}`);
  },

  async updateMatchStatus(matchId: string, status: 'suggested' | 'confirmed' | 'dismissed') {
    return request<{ match: Match; message: string }>(`/api/matches/${matchId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // --- NOTIFICATIONS ---
  async getNotifications() {
    return request<{ notifications: Notification[]; unreadCount: number }>('/api/notifications');
  },

  async markNotificationRead(id: string) {
    return request<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllNotificationsRead() {
    return request<{ success: boolean; message: string }>('/api/notifications/read-all', {
      method: 'PUT',
    });
  },

  // --- SAFE CONTACT ---
  async getContactRequests() {
    return request<{ requests: ContactRequest[] }>('/api/contact-requests');
  },

  async sendContactRequest(itemId: string, message: string) {
    return request<{ request: ContactRequest; message: string }>('/api/contact-requests', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, message }),
    });
  },

  // --- ADMIN ---
  async getAdminStats() {
    return request<{ stats: Statistics }>('/api/admin/stats');
  },

  async getAdminUsers() {
    return request<{ users: User[] }>('/api/admin/users');
  },

  async updateAdminUserStatus(userId: string, status: 'active' | 'suspended') {
    return request<{ user: User; message: string }>(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deleteAdminUser(userId: string) {
    return request<{ success: boolean; message: string }>(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  async getAdminItems() {
    return request<{ items: Item[] }>('/api/admin/items');
  },

  async flagAdminItem(itemId: string, isFlagged: boolean) {
    return request<{ item: Item; message: string }>(`/api/admin/items/${itemId}/flag`, {
      method: 'PUT',
      body: JSON.stringify({ is_flagged: isFlagged }),
    });
  },

  async deleteAdminItem(itemId: string) {
    return request<{ success: boolean; message: string }>(`/api/admin/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  async getAdminClaims() {
    return request<{ claims: Claim[] }>('/api/admin/claims');
  },

  async resetSeedData() {
    return request<{ success: boolean; message: string }>('/api/admin/reset-seed', {
      method: 'POST',
    });
  },
};
