import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SEED_MEDICAL_RECORDS } from '@/lib/data-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileId, passkey, officerName, badgeNumber, agencyStation, reason, tagCode } = body;

    // Check passkey (demo or production environment variable)
    const validPasskey = process.env.OFFICIAL_PASSKEY || 'HOSP-1234';

    if (!passkey || passkey.toUpperCase().trim() !== validPasskey.toUpperCase().trim()) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Doctor / Official Authorization Passcode.' },
        { status: 401 }
      );
    }

    if (!profileId) {
      return NextResponse.json({ error: 'Missing profileId' }, { status: 400 });
    }

    let medicalRecord: { medical_full: string; medications?: string[]; doctor_notes?: string } | null = null;

    if (isSupabaseConfigured && supabase) {
      // Fetch restricted medical record directly from secure medical_records table
      const { data, error } = await supabase
        .from('medical_records')
        .select('medical_full, medications, doctor_notes')
        .eq('profile_id', profileId)
        .single();

      if (!error && data) {
        medicalRecord = data;
      }

      // Log access in audit trail
      await supabase.from('scan_logs').insert([
        {
          tag_code: tagCode || 'UNKNOWN',
          role: 'official',
          officer_name: officerName || 'Authorized Medical Officer',
          badge_number: badgeNumber || 'MED-VERIFIED',
          agency_station: agencyStation || 'Emergency Trauma Unit',
          action: 'RESTRICTED_CLINICAL_UNLOCKED',
          reason: reason || 'Emergency Clinical Care & Vitals Triage',
        },
      ]);
    }

    // Fallback to local seed records if Supabase is not connected
    if (!medicalRecord) {
      const found = SEED_MEDICAL_RECORDS.find((m) => m.profile_id === profileId);
      if (found) {
        medicalRecord = {
          medical_full: found.medical_full,
          medications: found.medications,
          doctor_notes: found.doctor_notes,
        };
      }
    }

    if (!medicalRecord) {
      return NextResponse.json(
        { error: 'No restricted clinical record found for this profile.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      medical_full: medicalRecord.medical_full,
      medications: medicalRecord.medications || [],
      doctor_notes: medicalRecord.doctor_notes || '',
      unlocked_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Server error processing authorization', details: err?.message },
      { status: 500 }
    );
  }
}
