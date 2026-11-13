-- =============================================================================
-- PingME Lifeline — Seed Data (Synthetic Test Profiles, Tags, and Camps)
-- Safe & Idempotent: Can be re-run at any time without duplicate key errors
-- =============================================================================

-- Clear existing data safely
delete from public.scan_logs;
delete from public.camp_scans;
delete from public.incidents;
delete from public.family_members;
delete from public.tags;
delete from public.medical_records;
delete from public.profiles;
delete from public.camps;
delete from public.user_roles;

-- 1. RELIEF CAMPS (Consistent UUIDs)
insert into public.camps (id, name, lat, lng, capacity, current_count, location_desc) values
(
  '77777777-1111-1111-1111-111111111111',
  'Camp A — Civil Lines Red Cross Center',
  28.6750,
  77.2250,
  450,
  84,
  'North Sector Disaster Coordination Zone'
),
(
  '88888888-2222-2222-2222-222222222222',
  'Camp B — Jawaharlal Nehru Stadium Shelter',
  28.5830,
  77.2340,
  600,
  142,
  'South Sector Emergency Evacuation Pavilion'
),
(
  '99999999-3333-3333-3333-333333333333',
  'Camp C — Metro Triage & Aid Annex',
  28.6280,
  77.2180,
  300,
  51,
  'Central Transit Medical Triage Post'
);

-- 2. PROFILES (Basic Public Emergency Vitals Only)
insert into public.profiles (id, name, photo_url, blood_group, allergies, conditions, language, emergency_notes) values
(
  'a1111111-1111-1111-1111-111111111111',
  'Rohan Sharma',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
  'O+',
  array['Penicillin', 'Sulfa drugs'],
  array['Mild Asthma'],
  'English, Hindi',
  'Carries an inhaler in the vehicle glovebox or backpack pocket.'
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Sunita Verma',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'B+',
  array['Aspirin', 'Iodine contrast'],
  array['Type 2 Diabetes', 'Early Dementia / Memory Loss'],
  'Hindi, Punjabi',
  'May become confused or disoriented if lost. Please speak gently.'
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Aarav Patel',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  'A+',
  array['Peanuts', 'Tree nuts', 'Shellfish'],
  array['Severe Nut Allergy (Anaphylaxis risk)'],
  'English, Gujarati',
  'Severe allergy! Requires Epipen immediately if swollen or wheezing.'
);

-- 3. RESTRICTED MEDICAL RECORDS (Confidential - Unlocked by Verified Hospital/Paramedics)
insert into public.medical_records (id, profile_id, medical_full, medications, doctor_notes) values
(
  'm1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'Restricted Medical Record: Prior orthopedic surgery (right collarbone, 2022). Asthmatic attacks triggered by severe dust or smoke inhalation. Inhaler dosage: Salbutamol 100mcg.',
  array['Salbutamol 100mcg', 'Montelukast 10mg'],
  'Dr. Neha Kulkarni, Apex Trauma Center'
),
(
  'm2222222-2222-2222-2222-222222222222',
  'b2222222-2222-2222-2222-222222222222',
  'Restricted Medical Record: Daily medication: Metformin 500mg, Donepezil 5mg. Prone to hypoglycemic episodes if meals are delayed.',
  array['Metformin 500mg', 'Donepezil 5mg'],
  'Dr. A. Sen, Geriatric Care Institute'
),
(
  'm3333333-3333-3333-3333-333333333333',
  'c3333333-3333-3333-3333-333333333333',
  'Restricted Medical Record: Severe IgE-mediated anaphylaxis history. Authorized for emergency epinephrine auto-injector administration.',
  array['EpiPen 0.3mg Auto-Injector', 'Cetirizine 10mg'],
  'Dr. S. Mehta, Pediatric Allergy Specialist'
);

-- 4. TAGS
insert into public.tags (id, code, profile_id, type, label, active) values
(
  'd4444444-4444-4444-4444-444444444444',
  'LIFE-9021',
  'a1111111-1111-1111-1111-111111111111',
  'vehicle',
  'Motorcycle Helmet Tag',
  true
),
(
  'e5555555-5555-5555-5555-555555555555',
  'LIFE-4412',
  'b2222222-2222-2222-2222-222222222222',
  'wristband',
  'Senior Medical Wristband',
  true
),
(
  'f6666666-6666-6666-6666-666666666666',
  'LIFE-7703',
  'c3333333-3333-3333-3333-333333333333',
  'id_card',
  'School Backpack Card',
  true
),
(
  'f7777777-7777-7777-7777-777777777777',
  'LIFE-1088',
  'a1111111-1111-1111-1111-111111111111',
  'wallet',
  'Everyday Wallet Card',
  true
);

-- 5. FAMILY MEMBERS (Masked phone details)
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

-- 6. CAMP SCANS (Crisis Ledger)
insert into public.camp_scans (id, camp_id, tag_code, person_name, photo_url, blood_group, status, notes, scanned_by) values
(
  'c1111111-1111-1111-1111-111111111111',
  '77777777-1111-1111-1111-111111111111',
  'LIFE-4412',
  'Sunita Verma',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'B+',
  'safe',
  'Resting in Senior Care Tent 3. Hydrated with oral fluids.',
  'NDRF Unit 4'
),
(
  'c2222222-2222-2222-2222-222222222222',
  '88888888-2222-2222-2222-222222222222',
  'LIFE-7703',
  'Aarav Patel',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  'A+',
  'safe',
  'In Child Welfare Center with volunteer guardian. Allergies logged.',
  'Red Cross Volunteer Lead'
);

-- 7. USER ROLES (Demo Official and Rescuer Roles)
insert into public.user_roles (user_id, role, agency, badge_number, verified) values
(
  'dddddddd-0000-0000-0000-000000000001',
  'official',
  'Apex Trauma Emergency Hospital',
  'TRAUMA-DIR-402',
  true
),
(
  'dddddddd-0000-0000-0000-000000000002',
  'rescuer',
  'National Disaster Response Force (NDRF)',
  'RESCUE-LEAD-108',
  true
);

-- 8. SCAN AUDIT LOGS
insert into public.scan_logs (id, tag_code, role, officer_name, badge_number, agency_station, action, reason) values
(
  'aaaaaaaa-0000-0000-0000-000000000001',
  'LIFE-9021',
  'official',
  'Dr. Neha Kulkarni',
  'TRAUMA-DIR-402',
  'Apex Trauma Emergency Ward',
  'RESTRICTED_CLINICAL_UNLOCKED',
  'Acute respiratory distress triage upon admission'
),
(
  'aaaaaaaa-0000-0000-0000-000000000002',
  'LIFE-4412',
  'official',
  'Sub-Inspector R. K. Meena',
  'DL-POL-8821',
  'Civil Lines Police Station',
  'CAMP_IDENTITY_CROSS_MATCH',
  'Senior citizen missing report verification'
);
