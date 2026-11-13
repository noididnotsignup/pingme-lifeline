'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OfficialAuditLog, Profile, Tag } from '@/types';
import {
  getOfficialLogs,
  addOfficialLog,
  getTagByCode,
  getProfileById,
  SEED_OFFICIAL_LOGS,
} from '@/lib/data-store';
import {
  Lock,
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Search,
  Eye,
  KeyRound,
  LogOut,
  UserX,
  Stethoscope,
} from 'lucide-react';

export default function OfficialDashboardPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [auditLogs, setAuditLogs] = useState<OfficialAuditLog[]>([]);

  // Search & Tag unlock state
  const [tagInput, setTagInput] = useState('LIFE-9021');
  const [searchedTag, setSearchedTag] = useState<Tag | null>(null);
  const [searchedProfile, setSearchedProfile] = useState<Profile | null>(null);
  const [unlockedRecord, setUnlockedRecord] = useState(false);

  // Deceased Protocol modal/drawer
  const [showDeceasedModal, setShowDeceasedModal] = useState(false);
  const [deceasedRecorded, setDeceasedRecorded] = useState(false);
  const [officerNotes, setOfficerNotes] = useState('');

  useEffect(() => {
    setAuditLogs(getOfficialLogs());
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase().trim() === 'HOSP-1234') {
      setIsAuthenticated(true);
      setAuthError('');
      handleSearchTag('LIFE-9021');
    } else {
      setAuthError('Invalid Official Authorization Code. For demo, use: HOSP-1234');
    }
  };

  const handleSearchTag = async (code: string) => {
    setTagInput(code);
    setUnlockedRecord(false);
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
    setUnlockedRecord(true);
    const log = await addOfficialLog({
      officer_name: 'Dr. Neha Kulkarni',
      badge_number: 'TRAUMA-DIR-402',
      agency_station: 'Apex Trauma Emergency Ward',
      tag_code: searchedTag?.code || tagInput,
      action: 'RESTRICTED_CLINICAL_UNLOCKED',
      reason: 'Inpatient triage assessment',
    });
    setAuditLogs((prev) => [log, ...prev]);
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
      reason: officerNotes || 'Investigation lead recorded. Family notified to contact station.',
    });

    setAuditLogs((prev) => [log, ...prev]);
    setDeceasedRecorded(true);
    setShowDeceasedModal(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
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
            <span className="px-3 py-1.5 rounded-xl bg-white border border-surface-border text-xs font-bold text-brand-navy flex items-center gap-1.5 shadow-subtle">
              <ShieldCheck className="w-4 h-4 text-fresh-green" />
              <span>Certified Agency</span>
            </span>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-card border border-surface-border text-center space-y-4">
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
                  type="text"
                  placeholder="Enter Code (Demo: HOSP-1234)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-border text-center text-sm font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              {authError && <p className="text-xs text-emergency-red font-medium">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-brand-navy hover:bg-brand-primary text-white font-bold text-xs rounded-xl shadow-card transition-all"
              >
                Authenticate &amp; Unlock Console
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
                  <Building2 className="w-6 h-6 text-fresh-mint" />
                </div>
                <div>
                  <div className="text-sm font-bold">Dr. Neha Kulkarni • Trauma Director</div>
                  <div className="text-xs text-slate-300">Apex Trauma Emergency Ward (Station ID: DL-APEX-402)</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 bg-fresh-mint text-brand-navy font-bold rounded-xl">
                  AUTH CODE: HOSP-1234
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
            <div className="bg-white rounded-3xl p-6 shadow-card border border-surface-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
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
                    className="px-3.5 py-1.5 rounded-xl border border-surface-border text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    onClick={() => handleSearchTag(tagInput)}
                    className="px-3 py-1.5 bg-brand-primary text-white rounded-xl text-xs font-bold"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              {searchedProfile && searchedTag ? (
                <div className="space-y-5">
                  {/* Basic Vitals Card */}
                  <div className="p-4 rounded-2xl bg-brand-bg border border-surface-border flex items-start justify-between gap-4">
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
                          className="px-4 py-2 bg-brand-primary hover:bg-brand-navy text-white text-xs font-bold rounded-xl shadow-subtle transition-all"
                        >
                          Unlock Clinical Record
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-fresh-green bg-fresh-mint px-2.5 py-1 rounded-full border border-fresh-green/30 text-center">
                          Clinical Record Unlocked
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

                  {/* Restricted Full Medical Details Display */}
                  {unlockedRecord && (
                    <div className="p-5 rounded-2xl bg-fresh-mint/40 border border-fresh-green/30 space-y-2 animate-in fade-in">
                      <div className="text-xs font-bold text-fresh-green uppercase tracking-wider flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4" />
                        <span>Confidential Inpatient Clinical Record</span>
                      </div>
                      <p className="text-xs text-brand-navy leading-relaxed font-medium">
                        {searchedProfile.medical_full}
                      </p>
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
                <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-surface-border space-y-4">
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
                      <li>The family dashboard will solely display instructions: <em>&ldquo;Please contact {`Sub-Inspector R. K. Meena`}, Civil Lines Police Station.&rdquo;</em></li>
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
                        placeholder="e.g. Case #DD-8812. Body recovered near bypass. Possible match with LIFE-9021 tag on motorcycle helmet."
                        rows={3}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand-navy hover:bg-brand-primary text-white text-xs font-bold rounded-xl shadow-card transition-all"
                      >
                        Record Protocol Action
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeceasedModal(false)}
                        className="px-4 py-3 bg-slate-100 text-text-secondary text-xs font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* AUDIT LOGS TABLE */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-surface-border space-y-4">
              <div className="pb-3 border-b border-surface-border">
                <h3 className="text-base font-bold text-brand-navy">Statutory Audit Logs</h3>
                <p className="text-xs text-text-secondary">All official lookups and status changes are permanently logged</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-border text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                      <th className="py-2.5 px-3">Officer / Doctor</th>
                      <th className="py-2.5 px-3">Agency / Station</th>
                      <th className="py-2.5 px-3">Tag ID</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Reason / Details</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-bg">
                        <td className="py-3 px-3 font-bold text-brand-navy">{log.officer_name}</td>
                        <td className="py-3 px-3 text-text-secondary">{log.agency_station}</td>
                        <td className="py-3 px-3 font-mono font-bold text-brand-primary">{log.tag_code}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-bg text-brand-navy border border-surface-border">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-text-secondary max-w-xs truncate">{log.reason}</td>
                        <td className="py-3 px-3 font-mono text-text-secondary">{log.timestamp}</td>
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
