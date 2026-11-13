export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TagType = 'vehicle' | 'wallet' | 'wristband' | 'id_card';

export type SituationType = 'accident' | 'unwell' | 'lost' | 'crisis' | 'deceased_pending';

export type IncidentStatus = 'open' | 'acknowledged' | 'resolved';

export type RoleType = 'helper' | 'owner' | 'family' | 'rescuer' | 'official';

export type PersonHealthStatus = 'safe' | 'injured' | 'admitted';

// Public Basic Profile (Never contains restricted medical records)
export interface Profile {
  id: string; // UUID
  name: string;
  photo_url: string;
  blood_group: BloodGroup;
  allergies: string[];
  conditions: string[];
  language: string;
  emergency_notes?: string;
  medical_full?: string; // Only present when unlocked via authorized official verification
  created_at: string;
  updated_at?: string;
}

// Restricted Clinical Record (Hospitals & Paramedics Only)
export interface MedicalRecord {
  id: string; // UUID
  profile_id: string; // UUID references Profile
  medical_full: string;
  medications?: string[];
  doctor_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tag {
  id: string; // UUID
  code: string; // e.g. LIFE-9021
  profile_id: string; // UUID references Profile
  type: TagType;
  label?: string;
  active: boolean;
  created_at: string;
}

export interface FamilyMember {
  id: string; // UUID
  profile_id: string; // UUID references Profile
  name: string;
  relation: string;
  phone_masked: string; // E.g. "+91 98*** **412" (Never raw phone)
  user_id?: string;
}

export interface Incident {
  id: string; // UUID primary key
  reference_code?: string; // e.g. "INC-9021" for display
  tag_id: string; // UUID references Tag
  situation: SituationType;
  status: IncidentStatus;
  lat: number;
  lng: number;
  location_name?: string;
  note?: string;
  helper_session_id?: string;
  family_eta_minutes?: number;
  camp_id?: string | null;
  person_status?: PersonHealthStatus | null;
  created_at: string;
  updated_at: string;
}

export interface NearbyHospital {
  id: string;
  name: string;
  distanceKm: number;
  lat: number;
  lng: number;
  address?: string;
  phone_masked?: string;
  emergency_beds?: number;
  source?: 'openstreetmap' | 'emergency_directory';
}

export interface Camp {
  id: string; // UUID
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  current_count: number;
  location_desc?: string;
  created_at?: string;
}

export interface CampPersonRecord {
  id: string; // UUID
  camp_id: string; // UUID references Camp
  camp_name: string;
  tag_code: string;
  person_name: string;
  photo_url: string;
  blood_group: BloodGroup;
  status: PersonHealthStatus;
  time_scanned: string;
  last_update: string;
  notes?: string;
}

export interface UserRole {
  user_id: string;
  role: RoleType;
  agency?: string;
  badge_number?: string;
  verified: boolean;
}

export interface OfficialAuditLog {
  id: string;
  officer_name: string;
  badge_number: string;
  agency_station: string;
  tag_code: string;
  action: string;
  reason: string;
  timestamp: string;
}

export interface MerchantConsent {
  id: string;
  shop_name: string;
  masked_id: string;
  ebill: boolean;
  loyalty: boolean;
  offers: boolean;
  timestamp: string;
}
