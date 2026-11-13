export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TagType = 'vehicle' | 'wallet' | 'wristband' | 'id_card';

export type SituationType = 'accident' | 'unwell' | 'lost' | 'crisis' | 'deceased_pending';

export type IncidentStatus = 'open' | 'acknowledged' | 'resolved';

export type RoleType = 'helper' | 'owner' | 'family' | 'rescuer' | 'official';

export type PersonHealthStatus = 'safe' | 'injured' | 'admitted';

export interface Profile {
  id: string;
  name: string;
  photo_url: string;
  blood_group: BloodGroup;
  allergies: string[];
  conditions: string[];
  language: string;
  emergency_notes?: string;
  medical_full?: string; // Restricted to doctors/paramedics
  created_at: string;
}

export interface Tag {
  id: string;
  code: string; // e.g. LIFE-9021
  profile_id: string;
  type: TagType;
  label?: string;
  active: boolean;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  profile_id: string;
  name: string;
  relation: string;
  phone_masked: string; // E.g. "+91 98*** **412" (Never raw phone)
  user_id?: string;
}

export interface Incident {
  id: string;
  tag_id: string;
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
}

export interface Camp {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  current_count: number;
  location_desc?: string;
}

export interface CampPersonRecord {
  id: string;
  person_name: string;
  photo_url: string;
  tag_code: string;
  blood_group: BloodGroup;
  camp_name: string;
  camp_id: string;
  status: PersonHealthStatus;
  time_scanned: string;
  last_update: string;
  notes?: string;
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
