export type UserRole = "artist" | "patron" | "both";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  is_act60: boolean;
  stripe_account_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface ArtWalk {
  id: string;
  artist_id: string;
  title: string;
  description: string;
  cover_image_url: string;
  price_cents: number; // 0 = free
  duration_minutes: number;
  distance_km: number;
  neighborhood: string;
  municipality: string;
  is_published: boolean;
  is_featured: boolean;
  total_plays: number;
  avg_rating: number;
  created_at: string;
  artist?: Profile;
  stops?: WalkStop[];
}

export interface WalkStop {
  id: string;
  walk_id: string;
  order_index: number;
  title: string;
  description: string;
  audio_url: string | null;
  image_urls: string[];
  lat: number;
  lng: number;
  trigger_radius_meters: number;
  duration_seconds: number;
}

export interface WalkPurchase {
  id: string;
  user_id: string | null; // null for guest free walks
  walk_id: string;
  amount_cents: number;
  stripe_payment_id: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  cover_image_url: string;
  location_name: string;
  neighborhood: string;
  lat: number;
  lng: number;
  starts_at: string;
  ends_at: string;
  ticket_price_cents: number;
  max_capacity: number;
  tickets_sold: number;
  rsvp_url: string;
  is_published: boolean;
  created_at: string;
  organizer?: Profile;
}

export interface BusinessSponsor {
  id: string;
  business_name: string;
  contact_email: string;
  logo_url: string | null;
  lat: number;
  lng: number;
  monthly_budget_cents: number;
  sponsored_walks: string[]; // walk IDs
  is_active: boolean;
  created_at: string;
}

export interface ArtistSubscription {
  id: string;
  artist_id: string;
  plan: "free" | "pro";
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
}
