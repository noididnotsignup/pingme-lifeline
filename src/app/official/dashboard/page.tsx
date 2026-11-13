'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OfficialAuditLog, Profile, Tag } from '@/types';
import {
  getOfficialLogs,
  addOfficialLog,
  getTagByCode,
  getProfileById,
} from '@/lib/data-store';
import {
  Lock,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Stethoscope,
  Pill,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function OfficialDashboardPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<OfficialAuditLog[]>([]);

  // Search & Tag unlock state
  const [tagInput, setTagInput] = useState('LIFE-9021');
  const [searchedTag, setSearchedTag] = useState<Tag | null>(null);
  const [searchedProfile, setSearchedProfile] = useState<Profile | null>(null);
  const [unlockedRecord, setUnlockedRecord] = useState(false);
  const [clinicalData, setClinicalData] = useState<{
    medical_full: string;
    medications?: string[];
    doctor_notes?: string;
  } | null>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  // Deceased Protocol modal/drawer
  const [showDeceasedModal, setShowDeceasedModal] = useState(false);
  const [officerNotes, setOfficerNotes] = useState('');

  useEffect(() => {
    setAuditLogs(getOfficialLogs());
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    // Pre-validate credential against server
    try {
      const res = await fetch('/api/official/medical-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: 'a1111111-1111-1111-1111-111111111111',
          passkey: accessCode.trim(),
          tagCode: 'LIFE-9021',
          officerName: 'Dr. Neha Kulkarni',
          badgeNumber: 'TRAUMA-DIR-402',
          agencyStation: 'Apex Trauma Emergency Ward',
          reason: 'Official Portal Login Verification',
        }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setAuthError('');
        handleSearchTag('LIFE-9021');
      } else {
        const data = await res.json();
        setAuthError(data.error || 'Invalid Official Authorization Passcode.');
      }
    } catch {
      // Local fallback for offline sandbox
      if (accessCode.toUpperCase().trim() === 'HOSP-1234') {
        setIsAuthenticated(true);
        setAuthError('');
        handleSearchTag('LIFE-9021');
      } else {
        setAuthError('Invalid Official Authorization Passcode. For demo, use: HOSP-1234');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSearchTag = async (code: string) => {
    setTagInput(code);
    setUnlockedRecord(false);
    setClinicalData(null);
    setUnlockError('');

    const tag = await getTagByCode(code);
    if (tag) {
      setSearchedTag(tag);
      const prof = await getProfileById(tag.profile_id);
      setSearchedProfile(prof);
    } else {
      setSearchedTag(null);
      setSearchedProfile(null);
    }
  };

  const handleUnlockMedical = async () => {
    if (!searchedProfile) return;
    setUnlockLoading(true);
    setUnlockError('');

    try {
      const res = await fetch('/api/official/medical-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: searchedProfile.id,
          tagCode: searchedTag?.code || tagInput,
          passkey: accessCode.trim() || 'HOSP-1234',
          officerName: 'Dr. Neha Kulkarni',
          badgeNumber: 'TRAUMA-DIR-402',
          agencyStation: 'Apex Trauma Emergency Ward',
          reason: 'Inpatient triage assessment & medication plan',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setClinicalData(data);
        setUnlockedRecord(true);

        const log = await addOfficialLog({
          officer_name: 'Dr. Neha Kulkarni',
          badge_number: 'TRAUMA-DIR-402',
          agency_station: 'Apex Trauma Emergency Ward',
          tag_code: searchedTag?.code || tagInput,
          action: 'RESTRICTED_CLINICAL_UNLOCKED',
          reason: 'Inpatient triage assessment & medication plan',
        });
        setAuditLogs((prev) => [log, ...prev]);
      } else {
        setUnlockError(data.error || 'Failed to unlock clinical history.');
      }
    } catch {
      setUnlockError('Server connection error.');
    } finally {
      setUnlockLoading(false);
    }
  };

  const handleRecordDeceasedPending = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedTag) return;

    const log = await addOfficialLog({
      officer_name: 'Sub-Inspector R. K. Meena',
      badge_number: 'DL-POL-8821',
      agency_station: 'Civil Lines Police Station',
      tag_code: searchedTag.code,
      action: 'DECEASED_PENDING_CONFIRMATION',
      reason: officerNotes || 'Investigation lead recorded. Family instructed to contact station in person.',
    });

    setAuditLogs((prev) => [log, ...prev]);
    setShowDeceasedModal(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-navy"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Restricted Official Portal • Legal &amp; Medical Personnel Only
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Hospital Trauma &amp; Police Verification Console
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Secure identity investigation, restricted clinical histories, and statutory audit logging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-navy flex items-center gap-1.5 shadow-subtle">
              <ShieldCheck className="w-4 h-4 text-fresh-green" />
              <span>Certified Agency</span>
            </span>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-card border border-brand-border text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center mx-auto shadow-subtle">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-navy">Official Security Gateway</h2>
              <p className="text-xs text-text-secondary mt-1">
                Enter your hospital or police trauma verification code to access restricted victim histories.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 pt-2">
              <div>
                <input
                  type="password"
                  placeholder="Enter Passcode (Demo: HOSP-1234)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border text-center text-sm font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              {authError && <p className="text-xs text-emergency-red font-medium">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 bg-brand-navy hover:bg-brand-primary text-white font-bold text-xs rounded-xl shadow-card transition-all flex items-center justify-center gap-2"
              >
                {authLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                <span>Authenticate &amp; Unlock Console</span>
              </button>
            </form>

            <div className="text-[11px] text-text-secondary pt-2">
              Demo Code: <strong className="font-mono text-brand-navy">HOSP-1234</strong>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED OFFICIAL CONSOLE */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Officer / Hospital Verification Banner */}
            <div className="p-5 rounded-3xl bg-brand-navy text-white shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Dr. Neha Kulkarni • Trauma Director</div>
                  <div className="text-xs text-slate-300">Apex Trauma Emergency Ward (Station ID: DL-APEX-402)</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 bg-white/15 text-white font-bold rounded-xl border border-white/20">
                  SESSION VERIFIED
                </span>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* Tag Search & Medical Detail Investigation */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Restricted Profile Investigation</h3>
                  <p className="text-xs text-text-secondary">Look up full confidential medical history by PingME Tag ID</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => handleSearchTag(e.target.value)}
                    placeholder="Tag ID (e.g. LIFE-9021)"
                    className="px-3.5 py-1.5 rounded-xl border border-brand-border text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    onClick={() => handleSearchTag(tagInput)}
                    className="px-3 py-1.5 bg-brand-primary text-brand-navy rounded-xl text-xs font-bold"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              {searchedProfile && searchedTag ? (
                <div className="space-y-5">
                  {/* Basic Vitals Card */}
                  <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200">
                        <img src={searchedProfile.photo_url} alt={searchedProfile.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-brand-navy">{searchedProfile.name}</h4>
                          <span className="text-xs font-mono font-bold text-brand-primary">({searchedTag.code})</span>
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5">
                          Blood: <strong className="text-emergency-red font-bold">{searchedProfile.blood_group}</strong> • Language: {searchedProfile.language}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!unlockedRecord ? (
                        <button
                          onClick={handleUnlockMedical}
                          disabled={unlockLoading}
                          className="px-4 py-2 bg-brand-primary hover:bg-brand-dark text-brand-navy text-xs font-bold rounded-xl shadow-subtle transition-all flex items-center gap-1.5"
                        >
                          {unlockLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>Unlock Clinical Record</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-fresh-green bg-fresh-mint px-2.5 py-1 rounded-full border border-fresh-green/30 text-center flex items-center gap-1 justify-center">
                          <CheckCircle2 className="w-3 h-3" /> Record Unlocked
                        </span>
                      )}

                      <button
                        onClick={() => setShowDeceasedModal(true)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emergency-50 hover:text-emergency-red text-text-secondary text-xs font-semibold rounded-xl transition-colors"
                      >
                        Official Status Action...
                      </button>
                    </div>
                  </div>

                  {unlockError && (
                    <p className="text-xs text-emergency-red font-medium">{unlockError}</p>
                  )}

                  {/* Restricted Full Medical Details Display */}
                  {unlockedRecord && clinicalData && (
                    <div className="p-5 rounded-2xl bg-fresh-mint/40 border border-fresh-green/30 space-y-3 animate-in fade-in">
                      <div className="text-xs font-bold text-fresh-green uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4" />
                          <span>Confidential Inpatient Clinical Record</span>
                        </span>
                        <span className="text-[10px] font-mono text-text-secondary">
                          Verified at {new Date().toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-xs text-brand-navy leading-relaxed font-medium">
                        {clinicalData.medical_full}
                      </p>

                      {clinicalData.medications && clinicalData.medications.length > 0 && (
                        <div className="pt-2 border-t border-fresh-green/20">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-fresh-green mb-1">
                            <Pill className="w-3.5 h-3.5" />
                            <span>Prescribed Daily Medications:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {clinicalData.medications.map((med, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-semibold text-brand-navy border border-fresh-green/30">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-[10px] text-text-secondary pt-1 italic">
                        Access recorded in legal compliance audit log.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-text-secondary">
                  No registered tag found for {tagInput}. Try LIFE-9021.
                </div>
              )}
            </div>

            {/* RESTRICTED OFFICIAL PROTOCOL MODAL */}
            {showDeceasedModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-brand-border space-y-4">
                  <div className="flex items-center gap-2 text-warning-amber">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="text-base font-bold text-brand-navy">
                      Statutory Protocol: Identification Pending
                    </h3>
                  </div>

                  {/* Mandatory Safeguard Warnings */}
                  <div className="p-3.5 bg-warning-50 rounded-2xl border border-warning-amber/30 text-xs text-text-main space-y-2">
                    <p className="font-semibold">
                      Important Legal Safeguard Notice:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-text-secondary">
                      <li>The tag information is treated as a <strong>possible lead only</strong>, never proof of identity.</li>
                      <li>This option <strong>never sends an automated notification</strong> to the family.</li>
                      <li>The family dashboard will solely display instructions: <em>&ldquo;Please contact Sub-Inspector R. K. Meena, Civil Lines Police Station.&rdquo;</em></li>
                    </ul>
                  </div>

                  <form onSubmit={handleRecordDeceasedPending} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1">
                        Station Incident Reference / Lead Notes
                      </label>
                      <textarea
                        value={officerNotes}
                        onChange={(e) => setOfficerNotes(e.target.value)}
                        placeholder="Enter case diary reference, station ID, and contact officer details..."
                        rows={3}
                        className="w-full p-3 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowDeceasedModal(false)}
                        className="px-4 py-2 rounded-xl border border-brand-border text-xs font-semibold hover:bg-brand-bg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-warning-amber hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                      >
                        Confirm Statutory Lead Entry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* AUDIT LOG TABLE */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Statutory Audit Trail</h3>
                  <p className="text-xs text-text-secondary">Immutable log of authorized identity and clinical data access</p>
                </div>
                <span className="text-xs font-mono text-brand-primary font-bold">{auditLogs.length} Records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-border text-text-secondary">
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Timestamp</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Officer / Badge</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Agency Station</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Tag Code</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Action</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-bg/50 transition-colors">
                        <td className="py-3 font-mono text-[11px] text-text-secondary whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-3 font-medium text-brand-navy">
                          <div>{log.officer_name}</div>
                          <div className="text-[10px] font-mono text-text-secondary">{log.badge_number}</div>
                        </td>
                        <td className="py-3 text-text-secondary">{log.agency_station}</td>
                        <td className="py-3 font-mono font-bold text-brand-primary">{log.tag_code}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md bg-brand-tint text-brand-dark text-[10px] font-bold border border-brand-primary/30">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 text-text-secondary max-w-xs truncate" title={log.reason}>{log.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
