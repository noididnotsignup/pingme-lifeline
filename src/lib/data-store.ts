import {
  Profile,
  MedicalRecord,
  Tag,
  FamilyMember,
  Incident,
  IncidentStatus,
  SituationType,
  Camp,
  CampPersonRecord,
  OfficialAuditLog,
  PersonHealthStatus,
} from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

// 1. PUBLIC SEED PROFILES (Strictly Basic Vitals - NO medical_full field)
export const SEED_PROFILES: Profile[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Rohan Sharma',
    photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    blood_group: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    conditions: ['Mild Asthma'],
    language: 'English, Hindi',
    emergency_notes: 'Carries an inhaler in the vehicle glovebox or backpack pocket.',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'Sunita Verma',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    blood_group: 'B+',
    allergies: ['Aspirin', 'Iodine contrast'],
    conditions: ['Type 2 Diabetes', 'Early Dementia / Memory Loss'],
    language: 'Hindi, Punjabi',
    emergency_notes: 'May become confused or disoriented if lost. Please speak gently.',
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Aarav Patel',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    blood_group: 'A+',
    allergies: ['Peanuts', 'Tree nuts', 'Shellfish'],
    conditions: ['Severe Nut Allergy (Anaphylaxis risk)'],
    language: 'English, Gujarati',
    emergency_notes: 'Severe allergy! Requires Epipen immediately if swollen or wheezing.',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

// 2. SEED RESTRICTED MEDICAL RECORDS (Confidential - stored separately)
export const SEED_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    profile_id: 'a1111111-1111-1111-1111-111111111111',
    medical_full: 'Restricted Medical Record: Prior orthopedic surgery (right collarbone, 2022). Asthmatic attacks triggered by severe dust or smoke inhalation. Inhaler dosage: Salbutamol 100mcg.',
    medications: ['Salbutamol 100mcg', 'Montelukast 10mg'],
    doctor_notes: 'Dr. Neha Kulkarni, Apex Trauma Center',
    updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    profile_id: 'b2222222-2222-2222-2222-222222222222',
    medical_full: 'Restricted Medical Record: Daily medication: Metformin 500mg, Donepezil 5mg. Prone to hypoglycemic episodes if meals are delayed.',
    medications: ['Metformin 500mg', 'Donepezil 5mg'],
    doctor_notes: 'Dr. A. Sen, Geriatric Care Institute',
    updated_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 'e3333333-3333-3333-3333-333333333333',
    profile_id: 'c3333333-3333-3333-3333-333333333333',
    medical_full: 'Restricted Medical Record: Severe IgE-mediated anaphylaxis history. Authorized for emergency epinephrine auto-injector administration.',
    medications: ['EpiPen 0.3mg Auto-Injector', 'Cetirizine 10mg'],
    doctor_notes: 'Dr. S. Mehta, Pediatric Allergy Specialist',
    updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

// 3. SEED TAGS
export const SEED_TAGS: Tag[] = [
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    code: 'LIFE-9021',
    profile_id: 'a1111111-1111-1111-1111-111111111111',
    type: 'vehicle',
    label: 'Motorcycle Helmet Tag',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'e5555555-5555-5555-5555-555555555555',
    code: 'LIFE-4412',
    profile_id: 'b2222222-2222-2222-2222-222222222222',
    type: 'wristband',
    label: 'Senior Medical Wristband',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 'f6666666-6666-6666-6666-666666666666',
    code: 'LIFE-7703',
    profile_id: 'c3333333-3333-3333-3333-333333333333',
    type: 'id_card',
    label: 'School Backpack Card',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'f7777777-7777-7777-7777-777777777777',
    code: 'LIFE-1088',
    profile_id: 'a1111111-1111-1111-1111-111111111111',
    type: 'wallet',
    label: 'Everyday Wallet Card',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

// 4. SEED FAMILY MEMBERS
export const SEED_FAMILY: FamilyMember[] = [
  {
    id: '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    profile_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Priya Sharma',
    relation: 'Spouse',
    phone_masked: '+91 98*** **412',
  },
  {
    id: '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    profile_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Vikram Sharma',
    relation: 'Brother',
    phone_masked: '+91 94*** **890',
  },
  {
    id: '33333333-cccc-cccc-cccc-cccccccccccc',
    profile_id: 'b2222222-2222-2222-2222-222222222222',
    name: 'Amit Verma',
    relation: 'Son',
    phone_masked: '+91 97*** **331',
  },
  {
    id: '44444444-dddd-dddd-dddd-dddddddddddd',
    profile_id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Kavita Patel',
    relation: 'Mother',
    phone_masked: '+91 99*** **154',
  },
];

// 5. SEED RELIEF CAMPS (UUID Identifiers)
export const SEED_CAMPS: Camp[] = [
  {
    id: '77777777-1111-1111-1111-111111111111',
    name: 'Camp A — Civil Lines Red Cross Center',
    lat: 28.6750,
    lng: 77.2250,
    capacity: 450,
    current_count: 84,
    location_desc: 'North Sector Disaster Coordination Zone',
  },
  {
    id: '88888888-2222-2222-2222-222222222222',
    name: 'Camp B — Jawaharlal Nehru Stadium Shelter',
    lat: 28.5830,
    lng: 77.2340,
    capacity: 600,
    current_count: 142,
    location_desc: 'South Sector Emergency Evacuation Pavilion',
  },
  {
    id: '99999999-3333-3333-3333-333333333333',
    name: 'Camp C — Metro Triage & Aid Annex',
    lat: 28.6280,
    lng: 77.2180,
    capacity: 300,
    current_count: 51,
    location_desc: 'Central Transit Medical Triage Post',
  },
];

// 6. SEED CAMP SCANNED CITIZEN RECORDS
export const SEED_CAMP_RECORDS: CampPersonRecord[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    person_name: 'Sunita Verma',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    tag_code: 'LIFE-4412',
    blood_group: 'B+',
    camp_name: 'Camp A — Civil Lines Red Cross Center',
    camp_id: '77777777-1111-1111-1111-111111111111',
    status: 'safe',
    time_scanned: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    last_update: 'Resting in Senior Care Tent 3. Family notified.',
    notes: 'Mildly confused, hydrated with oral fluids.',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    person_name: 'Aarav Patel',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    tag_code: 'LIFE-7703',
    blood_group: 'A+',
    camp_name: 'Camp B — Jawaharlal Nehru Stadium Shelter',
    camp_id: '88888888-2222-2222-2222-222222222222',
    status: 'safe',
    time_scanned: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    last_update: 'In Child Welfare Center with volunteer guardian.',
    notes: 'Allergies logged in camp medical ledger.',
  },
];

// 7. SEED OFFICIAL AUDIT LOGS
export const SEED_OFFICIAL_LOGS: OfficialAuditLog[] = [
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000001',
    officer_name: 'Dr. Neha Kulkarni',
    badge_number: 'TRAUMA-DIR-402',
    agency_station: 'Apex Trauma Emergency Ward',
    tag_code: 'LIFE-9021',
    action: 'RESTRICTED_CLINICAL_UNLOCKED',
    reason: 'Acute respiratory distress triage upon admission',
    timestamp: new Date(Date.now() - 3600000 * 3).toLocaleString(),
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000002',
    officer_name: 'Sub-Inspector R. K. Meena',
    badge_number: 'DL-POL-8821',
    agency_station: 'Civil Lines Police Station',
    tag_code: 'LIFE-4412',
    action: 'CAMP_IDENTITY_CROSS_MATCH',
    reason: 'Senior citizen missing report verification',
    timestamp: new Date(Date.now() - 3600000 * 6).toLocaleString(),
  },
];

// In-memory / browser fallback keys for local demo mode
const STORAGE_KEY_INCIDENTS = 'pingme_lifeline_incidents_v2';
const STORAGE_KEY_PROFILES = 'pingme_lifeline_profiles_v2';
const STORAGE_KEY_TAGS = 'pingme_lifeline_tags_v2';
const STORAGE_KEY_CAMP_RECORDS = 'pingme_lifeline_camp_records_v2';
const STORAGE_KEY_OFFICIAL_LOGS = 'pingme_lifeline_official_logs_v2';

// -------------------------------------------------------------
// LOCAL STATE HELPERS (Used for demo mode when Supabase is unconfigured)
// -------------------------------------------------------------
export function getLocalIncidents(): Incident[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INCIDENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalIncidents(incidents: Incident[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
  } catch {}
}

export function getLocalProfiles(): Profile[] {
  if (typeof window === 'undefined') return SEED_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    return raw ? JSON.parse(raw) : SEED_PROFILES;
  } catch {
    return SEED_PROFILES;
  }
}

export function saveLocalProfiles(profiles: Profile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch {}
}

export function getLocalTags(): Tag[] {
  if (typeof window === 'undefined') return SEED_TAGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TAGS);
    return raw ? JSON.parse(raw) : SEED_TAGS;
  } catch {
    return SEED_TAGS;
  }
}

export function saveLocalTags(tags: Tag[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags));
  } catch {}
}

export function getCampRecords(): CampPersonRecord[] {
  if (typeof window === 'undefined') return SEED_CAMP_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMP_RECORDS);
    return raw ? JSON.parse(raw) : SEED_CAMP_RECORDS;
  } catch {
    return SEED_CAMP_RECORDS;
  }
}

export function saveCampRecords(records: CampPersonRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CAMP_RECORDS, JSON.stringify(records));
  } catch {}
}

export function getOfficialLogs(): OfficialAuditLog[] {
  if (typeof window === 'undefined') return SEED_OFFICIAL_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFICIAL_LOGS);
    return raw ? JSON.parse(raw) : SEED_OFFICIAL_LOGS;
  } catch {
    return SEED_OFFICIAL_LOGS;
  }
}

export function saveOfficialLogs(logs: OfficialAuditLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_OFFICIAL_LOGS, JSON.stringify(logs));
  } catch {}
}

// -------------------------------------------------------------
// CORE QUERIES & MUTATIONS (Supabase Primary with Demo Fallback)
// -------------------------------------------------------------

export async function getTagByCode(code: string): Promise<Tag | null> {
  const normalized = code.toUpperCase().trim();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('code', normalized)
        .eq('active', true)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getTagByCode query error:', err);
    }
  }
  const tags = getLocalTags();
  return tags.find((t) => t.code === normalized && t.active) || null;
}

export async function getProfileById(id: string): Promise<Profile | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Strictly basic fields - medical_records is stored separately
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, photo_url, blood_group, allergies, conditions, language, emergency_notes, created_at, updated_at')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getProfileById query error:', err);
    }
  }
  const profiles = getLocalProfiles();
  return profiles.find((p) => p.id === id) || null;
}

export async function getTagsForProfile(profileId: string): Promise<Tag[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('profile_id', profileId);
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getTagsForProfile query error:', err);
    }
  }
  const tags = getLocalTags();
  return tags.filter((t) => t.profile_id === profileId);
}

export async function updateProfile(updated: Profile): Promise<Profile> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updated.name,
          blood_group: updated.blood_group,
          allergies: updated.allergies,
          conditions: updated.conditions,
          language: updated.language,
          emergency_notes: updated.emergency_notes,
        })
        .eq('id', updated.id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.error('Supabase updateProfile error:', err);
    }
  }
  const profiles = getLocalProfiles();
  const list = profiles.map((p) => (p.id === updated.id ? updated : p));
  saveLocalProfiles(list);
  return updated;
}

export async function toggleTagActive(tagId: string): Promise<Tag | null> {
  const tags = getLocalTags();
  const current = tags.find((t) => t.id === tagId);
  const nextActive = current ? !current.active : false;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update({ active: nextActive })
        .eq('id', tagId)
        .select()
        .single();
      if (!error && data) {
        saveLocalTags(tags.map((t) => (t.id === tagId ? data : t)));
        return data;
      }
    } catch (err) {
      console.error('Supabase toggleTagActive error:', err);
    }
  }

  let result: Tag | null = null;
  const list = tags.map((t) => {
    if (t.id === tagId) {
      result = { ...t, active: !t.active };
      return result;
    }
    return t;
  });
  saveLocalTags(list);
  return result;
}

export async function addTag(tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([
          {
            code: tag.code.toUpperCase().trim(),
            profile_id: tag.profile_id,
            type: tag.type,
            label: tag.label || `${tag.type.toUpperCase()} Tag`,
            active: tag.active ?? true,
          },
        ])
        .select()
        .single();
      if (!error && data) {
        const local = getLocalTags();
        saveLocalTags([...local, data]);
        return data;
      }
    } catch (err) {
      console.error('Supabase addTag error:', err);
    }
  }

  // Generates valid UUID for client fallback
  const newTag: Tag = {
    ...tag,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : 'tag-' + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
  };
  const tags = getLocalTags();
  saveLocalTags([...tags, newTag]);
  return newTag;
}

export async function getFamilyMembersByProfileId(profileId: string): Promise<FamilyMember[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('id, profile_id, name, relation, phone_masked')
        .eq('profile_id', profileId);
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase getFamilyMembers error:', err);
    }
  }
  return SEED_FAMILY.filter((f) => f.profile_id === profileId);
}

// -------------------------------------------------------------
// RELIEF CAMPS & RESCUER CRISIS FLOW
// -------------------------------------------------------------
export async function getCamps(): Promise<Camp[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('camps').select('*').order('name');
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase getCamps error:', err);
    }
  }
  return SEED_CAMPS;
}

export async function addRescuerScanRecord(record: {
  tagCode: string;
  campId: string;
  campName: string;
  status: PersonHealthStatus;
  notes?: string;
}): Promise<CampPersonRecord> {
  const tag = await getTagByCode(record.tagCode);
  const profile = tag ? await getProfileById(tag.profile_id) : null;

  const newRec: CampPersonRecord = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : 'rec-' + Math.random().toString(36).substring(2, 9),
    person_name: profile ? profile.name : 'Unknown Citizen',
    photo_url: profile?.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
    tag_code: record.tagCode.toUpperCase().trim(),
    blood_group: profile ? profile.blood_group : 'O+',
    camp_name: record.campName,
    camp_id: record.campId,
    status: record.status,
    time_scanned: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    last_update: `Marked ${record.status.toUpperCase()} by Camp Rescuer. Family notified.`,
    notes: record.notes,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('camp_scans')
        .insert([
          {
            camp_id: record.campId,
            tag_code: newRec.tag_code,
            person_name: newRec.person_name,
            photo_url: newRec.photo_url,
            blood_group: newRec.blood_group,
            status: newRec.status,
            notes: newRec.notes,
            scanned_by: 'Authorized Rescuer',
          },
        ])
        .select()
        .single();
      if (!error && data) {
        newRec.id = data.id;
      }
    } catch (err) {
      console.error('Supabase addRescuerScanRecord error:', err);
    }
  }

  const records = getCampRecords();
  saveCampRecords([newRec, ...records]);
  return newRec;
}

// -------------------------------------------------------------
// OFFICIAL RESTRICTED AUDIT LOGS
// -------------------------------------------------------------
export async function addOfficialLog(log: Omit<OfficialAuditLog, 'id' | 'timestamp'>): Promise<OfficialAuditLog> {
  const newLog: OfficialAuditLog = {
    ...log,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : 'aud-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('scan_logs').insert([
        {
          tag_code: log.tag_code,
          role: 'official',
          officer_name: log.officer_name,
          badge_number: log.badge_number,
          agency_station: log.agency_station,
          action: log.action,
          reason: log.reason,
        },
      ]);
    } catch (err) {
      console.error('Supabase addOfficialLog error:', err);
    }
  }

  const logs = getOfficialLogs();
  saveOfficialLogs([newLog, ...logs]);
  return newLog;
}

// -------------------------------------------------------------
// REALTIME INCIDENTS MANAGEMENT (Strict UUID primary keys)
// -------------------------------------------------------------
export async function createIncident(params: {
  tagId: string;
  situation: SituationType;
  lat: number;
  lng: number;
  locationName?: string;
  note?: string;
  helperSessionId?: string;
}): Promise<Incident> {
  const refCode = 'INC-' + Math.floor(1000 + Math.random() * 9000);

  if (isSupabaseConfigured && supabase) {
    try {
      // Let PostgreSQL generate the UUID primary key 'id'
      const { data, error } = await supabase
        .from('incidents')
        .insert([
          {
            reference_code: refCode,
            tag_id: params.tagId,
            situation: params.situation,
            status: 'open',
            lat: params.lat,
            lng: params.lng,
            location_name: params.locationName || 'Live Location Locked',
            note: params.note || '',
            helper_session_id: params.helperSessionId || ('helper-' + Math.random().toString(36).substring(2, 6)),
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const current = getLocalIncidents();
        saveLocalIncidents([data, ...current]);
        return data;
      } else if (error) {
        console.error('Supabase insert incident error:', error.message);
      }
    } catch (err) {
      console.error('Failed to create incident in Supabase:', err);
    }
  }

  // Fallback for simulated offline demo mode:
  const newIncident: Incident = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : '00000000-0000-0000-0000-' + Math.floor(100000000000 + Math.random() * 900000000000),
    reference_code: refCode,
    tag_id: params.tagId,
    situation: params.situation,
    status: 'open',
    lat: params.lat,
    lng: params.lng,
    location_name: params.locationName || 'Live Location Locked',
    note: params.note || '',
    helper_session_id: params.helperSessionId || 'helper-' + Math.random().toString(36).substring(2, 6),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const current = getLocalIncidents();
  saveLocalIncidents([newIncident, ...current]);
  return newIncident;
}

export async function updateIncidentStatus(
  incidentId: string,
  status: IncidentStatus,
  familyEtaMinutes?: number
): Promise<Incident | null> {
  const updatedFields = {
    status,
    family_eta_minutes: familyEtaMinutes,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .update(updatedFields)
        .eq('id', incidentId)
        .select()
        .single();

      if (!error && data) {
        const current = getLocalIncidents();
        saveLocalIncidents(current.map((i) => (i.id === incidentId ? data : i)));
        return data;
      }
    } catch (err) {
      console.error('Supabase update incident error:', err);
    }
  }

  const current = getLocalIncidents();
  let target: Incident | null = null;
  const updated = current.map((i) => {
    if (i.id === incidentId) {
      target = { ...i, ...updatedFields };
      return target;
    }
    return i;
  });

  if (target) {
    saveLocalIncidents(updated);
  }
  return target;
}

export async function getActiveIncidentForTag(tagId: string): Promise<Incident | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('tag_id', tagId)
        .neq('status', 'resolved')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getActiveIncident error:', err);
    }
  }
  const current = getLocalIncidents();
  return current.find((i) => i.tag_id === tagId && i.status !== 'resolved') || null;
}

export async function getAllIncidents(): Promise<Incident[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getAllIncidents error:', err);
    }
  }
  return getLocalIncidents();
}

// -------------------------------------------------------------
// SUPABASE REALTIME STREAMING
// -------------------------------------------------------------
export function subscribeToIncidentUpdates(
  incidentId: string,
  onUpdate: (incident: Incident) => void
): () => void {
  let supaChannel: any = null;

  if (isSupabaseConfigured && supabase) {
    supaChannel = supabase
      .channel(`incident-room-${incidentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'incidents',
          filter: `id=eq.${incidentId}`,
        },
        (payload: any) => {
          if (payload?.new) {
            onUpdate(payload.new as Incident);
          }
        }
      )
      .subscribe();
  }

  // Cross-tab fallback for simulated local demo
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY_INCIDENTS && e.newValue) {
      try {
        const list: Incident[] = JSON.parse(e.newValue);
        const found = list.find((i) => i.id === incidentId);
        if (found) onUpdate(found);
      } catch {}
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (supaChannel && supabase) {
      supabase.removeChannel(supaChannel);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

export function subscribeToAllIncidents(onUpdate: (incidents: Incident[]) => void): () => void {
  let supaChannel: any = null;

  if (isSupabaseConfigured && supabase) {
    supaChannel = supabase
      .channel('all-incidents-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, async () => {
        const list = await getAllIncidents();
        onUpdate(list);
      })
      .subscribe();
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY_INCIDENTS && e.newValue) {
      try {
        const list: Incident[] = JSON.parse(e.newValue);
        onUpdate(list);
      } catch {}
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (supaChannel && supabase) {
      supabase.removeChannel(supaChannel);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}
