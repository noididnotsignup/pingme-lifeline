'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Profile, Tag } from '@/types';
import { ShieldCheck, AlertTriangle, Activity, Globe, Lock, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';

interface MedicalStampProps {
  profile: Profile;
  tag: Tag;
}

export function MedicalStamp({ profile, tag }: MedicalStampProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showDoctorLogin, setShowDoctorLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toUpperCase().trim() === 'HOSP-1234') {
      setUnlocked(true);
      setErrorMsg('');
      setShowDoctorLogin(false);
    } else {
      setErrorMsg('Invalid Doctor / Paramedic authorization code. Try HOSP-1234.');
    }
  };

  const getTagTypeLabel = (type: string) => {
    switch (type) {
      case 'vehicle':
        return 'Vehicle Tag';
      case 'wristband':
        return 'Medical Wristband';
      case 'id_card':
        return 'Lifeline ID Card';
      case 'wallet':
        return 'Wallet Card';
      default:
        return 'PingME Tag';
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-brand-border">
      {/* Top Tag Metadata Bar */}
      <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-brand-tint text-brand-dark border border-brand-primary/40">
            {tag.code}
          </span>
          <span className="text-xs text-text-secondary font-medium">
            {tag.label || getTagTypeLabel(tag.type)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-fresh-green bg-fresh-mint px-2.5 py-1 rounded-full border border-fresh-green/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Emergency Profile</span>
        </div>
      </div>

      {/* Main Profile & Blood Group Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar with fallback */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-card flex-shrink-0">
            <Image
              src={profile.photo_url}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
              priority
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight leading-tight">
              {profile.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-text-secondary font-medium">
              <Globe className="w-3.5 h-3.5 text-brand-primary" />
              <span>Language: <strong className="text-brand-navy font-semibold">{profile.language}</strong></span>
            </div>
            {profile.emergency_notes && (
              <p className="mt-2 text-xs text-text-main bg-brand-bg p-2.5 rounded-xl border border-brand-border leading-relaxed font-medium">
                💬 {profile.emergency_notes}
              </p>
            )}
          </div>
        </div>

        {/* BLOOD GROUP STAMP */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-emergency-red text-white shadow-emergency p-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-90">
            Blood
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-tight my-auto">
            {profile.blood_group}
          </span>
          <span className="text-[9px] font-medium opacity-90">
            Group
          </span>
        </div>
      </div>

      {/* MEDICAL HIGHLIGHTS: Allergies & Conditions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Allergies Card */}
        <div className="p-3.5 rounded-2xl bg-brand-tint/60 border border-brand-primary/30">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-dark mb-2">
            <AlertTriangle className="w-4 h-4 text-brand-primary" />
            <span>Known Allergies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.allergies.length > 0 ? (
              profile.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-brand-navy border border-brand-primary/40 shadow-subtle"
                >
                  {allergy}
                </span>
              ))
            ) : (
              <span className="text-xs text-text-secondary italic">None reported</span>
            )}
          </div>
        </div>

        {/* Existing Medical Conditions Card */}
        <div className="p-3.5 rounded-2xl bg-brand-bg border border-brand-border">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-navy mb-2">
            <Activity className="w-4 h-4 text-brand-primary" />
            <span>Medical Conditions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.conditions.length > 0 ? (
              profile.conditions.map((condition, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-brand-navy border border-brand-border shadow-subtle"
                >
                  {condition}
                </span>
              ))
            ) : (
              <span className="text-xs text-text-secondary italic">None reported</span>
            )}
          </div>
        </div>
      </div>

      {/* TIERED ACCESS: Doctor / Paramedic Confidential Medical Record */}
      <div className="mt-4 pt-4 border-t border-brand-border">
        {!unlocked ? (
          <div>
            <button
              onClick={() => setShowDoctorLogin(!showDoctorLogin)}
              className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-brand-bg hover:bg-brand-tint/70 text-xs font-semibold text-text-secondary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-brand-primary" />
                <span>Restricted Medical Details (Hospital Staff / Paramedics Only)</span>
              </span>
              {showDoctorLogin ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDoctorLogin && (
              <form onSubmit={handleUnlock} className="mt-2 p-3.5 bg-brand-bg rounded-2xl border border-brand-border animate-in fade-in duration-150">
                <div className="text-[11px] text-text-secondary mb-2">
                  Enter authorized Hospital / Paramedic PIN (Demo PIN: <strong className="text-brand-navy font-mono">HOSP-1234</strong>)
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="e.g. HOSP-1234"
                    className="flex-1 px-3 py-2 rounded-xl border border-brand-border bg-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-dark text-brand-navy rounded-xl text-xs font-black transition-colors shadow-subtle"
                  >
                    Unlock
                  </button>
                </div>
                {errorMsg && <p className="mt-1.5 text-[11px] text-emergency-red font-medium">{errorMsg}</p>}
              </form>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-fresh-mint border border-fresh-green/30 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-fresh-green mb-1.5">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4" />
                <span>Clinical History Unlocked (Authorized Medical View)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-white rounded-full border border-fresh-green/30">
                AUTH: HOSP-1234
              </span>
            </div>
            <p className="text-xs text-brand-navy font-medium leading-relaxed">
              {profile.medical_full}
            </p>
          </div>
        )}
      </div>

      {/* PRIVACY SHIELD FOOTNOTE */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-text-secondary font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
        <span>PingME Privacy Shield: Phone numbers are masked. Basic medical data only.</span>
      </div>
    </div>
  );
}
