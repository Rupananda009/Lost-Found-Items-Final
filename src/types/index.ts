export interface User {
  user_id: string;
  name: string;
  email: string;
  role: 'user' | 'finder' | 'admin';
  profile_image: string;
  phone?: string;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at?: string;
}

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'potential_match' | 'claim_pending' | 'returned' | 'closed';

export interface Item {
  item_id: string;
  user_id: string;
  user_name?: string;
  type: ItemType;
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
  status: ItemStatus;
  is_flagged?: boolean;
  created_at: string;
  updated_at?: string;
}

export type ClaimStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';

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
  status: ClaimStatus;
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

export interface Statistics {
  totalUsers: number;
  totalLost: number;
  totalFound: number;
  totalMatches: number;
  totalClaims: number;
  totalReturned: number;
  categoryBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
  recoveryRate: number;
}
