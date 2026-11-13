-- PingME Lifeline — Seed Data (Synthetic Test Profiles & Tags)

-- Clean up prior seeds if re-running
truncate table public.scan_logs, public.incidents, public.family_members, public.tags, public.profiles, public.camps cascade;

-- 1. PROFILES
insert into public.profiles (id, name, photo_url, blood_group, allergies, conditions, language, emergency_notes, medical_full) values
(
  'a1111111-1111-1111-1111-111111111111',
  'Rohan Sharma',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
  'O+',
  array['Penicillin', 'Sulfa drugs'],
  array['Mild Asthma'],
  'English, Hindi',
  'Carries an inhaler in the vehicle glovebox or backpack pocket.',
  'Restricted Medical Record: Prior orthopedic surgery (right collarbone, 2022). Asthmatic attacks triggered by severe dust or smoke inhalation. Inhaler dosage: Salbutamol 100mcg.'
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Sunita Verma',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'B+',
  array['Aspirin', 'Iodine contrast'],
  array['Type 2 Diabetes', 'Early Dementia / Memory Loss'],
  'Hindi, Punjabi',
  'May become confused or disoriented if lost. Please speak gently.',
  'Restricted Medical Record: Daily medication: Metformin 500mg, Donepezil 5mg. Prone to hypoglycemic episodes if meals are delayed.'
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Aarav Patel',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  'A+',
  array['Peanuts', 'Tree nuts', 'Shellfish'],
  array['Severe Nut Allergy (Anaphylaxis risk)'],
  'English, Gujarati',
  'Severe allergy! Requires Epipen immediately if swollen or wheezing.',
  'Restricted Medical Record: Severe IgE-mediated anaphylaxis history. Authorized for emergency epinephrine auto-injector administration.'
);

-- 2. TAGS
insert into public.tags (id, code, profile_id, type, active) values
(
  'd4444444-4444-4444-4444-444444444444',
  'LIFE-9021',
  'a1111111-1111-1111-1111-111111111111',
  'vehicle',
  true
),
(
  'e5555555-5555-5555-5555-555555555555',
  'LIFE-4412',
  'b2222222-2222-2222-2222-222222222222',
  'wristband',
  true
),
(
  'f6666666-6666-6666-6666-666666666666',
  'LIFE-7703',
  'c3333333-3333-3333-3333-333333333333',
  'id_card',
  true
);

-- 3. FAMILY MEMBERS
insert into public.family_members (id, profile_id, name, relation, phone_masked) values
(
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'a1111111-1111-1111-1111-111111111111',
  'Priya Sharma',
  'Spouse',
  '+91 98*** **412'
),
(
  '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'a1111111-1111-1111-1111-111111111111',
  'Vikram Sharma',
  'Brother',
  '+91 94*** **890'
),
(
  '33333333-cccc-cccc-cccc-cccccccccccc',
  'b2222222-2222-2222-2222-222222222222',
  'Amit Verma',
  'Son',
  '+91 97*** **331'
),
(
  '44444444-dddd-dddd-dddd-dddddddddddd',
  'c3333333-3333-3333-3333-333333333333',
  'Kavita Patel',
  'Mother',
  '+91 99*** **154'
);

-- 4. RELIEF CAMPS
insert into public.camps (id, name, lat, lng, capacity, current_count) values
(
  '77777777-1111-1111-1111-111111111111',
  'Camp A - Red Cross Relief Center (Civil Lines)',
  28.6750,
  77.2250,
  450,
  82
),
(
  '88888888-2222-2222-2222-222222222222',
  'Camp B - Stadium Community Shelter',
  28.5830,
  77.2340,
  600,
  140
);
