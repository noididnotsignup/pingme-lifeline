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
  Search,
  FileText,
  LogOut,
  ChevronRight,
  Download,
  Filter,
  Sparkles,
} from 'lucide-react';

export default function OfficialDashboardPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<OfficialAuditLog[]>([]);

  // Navigation tab state: 'clinical' | 'protocol' | 'audit'
  const [activeTab, setActiveTab] = useState<'clinical' | 'protocol' | 'audit'>('clinical');

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

  // Deceased Protocol modal/state
  const [showDeceasedModal, setShowDeceasedModal] = useState(false);
  const [officerNotes, setOfficerNotes] = useState('');
  const [protocolSuccessMsg, setProtocolSuccessMsg] = useState(false);

  // Audit filter state
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('all');

  // Synchronize activeTab with URL search params for direct loading and browser back/forward support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['clinical', 'protocol', 'audit'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['clinical', 'protocol', 'audit'].includes(tab)) {
        setActiveTab(tab as any);
      } else {
        setActiveTab('clinical');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tabId: 'clinical' | 'protocol' | 'audit') => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url.toString());
    }
  };

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
    setOfficerNotes('');
    setProtocolSuccessMsg(true);
    setTimeout(() => setProtocolSuccessMsg(false), 4000);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.tag_code.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.officer_name.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.agency_station.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesAction = auditActionFilter === 'all' || log.action === auditActionFilter;
    return matchesSearch && matchesAction;
  });

  const exportAuditCsv = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `official-audit-log-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <span>Certified Agency Gateway</span>
            </span>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-card border border-brand-border text-center space-y-4 my-12">
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

            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border text-[11px] text-text-secondary">
              Demo Access Code: <strong className="font-mono text-brand-navy font-bold">HOSP-1234</strong>
            </div>

            <div className="pt-2 border-t border-brand-border">
              <Link href="/auth" className="text-xs font-bold text-brand-dark hover:underline flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                <span>Return to Role Switcher</span>
              </Link>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED OFFICIAL CONSOLE */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Officer / Hospital Verification Banner */}
            <div className="p-5 rounded-3xl bg-brand-navy text-white shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span>Dr. Neha Kulkarni • Trauma Director</span>
                    <span className="text-[10px] bg-fresh-green/20 text-fresh-green px-2 py-0.5 rounded-md font-mono border border-fresh-green/30">VERIFIED</span>
                  </div>
                  <div className="text-xs text-slate-300">Apex Trauma Emergency Ward (Station ID: DL-APEX-402)</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 bg-white/15 text-white font-bold rounded-xl border border-white/20">
                  SESSION VERIFIED
                </span>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  title="Lock console session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock</span>
                </button>
              </div>
            </div>

            {/* MAIN NAVIGATION BAR / SIDEBAR TABS */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Sidebar Navigation */}
              <aside className="bg-white rounded-3xl p-3 shadow-card border border-brand-border space-y-1 lg:sticky lg:top-20">
                <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-text-secondary">
                  Restricted Sections
                </div>

                <button
                  type="button"
                  onClick={() => handleTabChange('clinical')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    activeTab === 'clinical'
                      ? 'bg-brand-primary text-brand-navy shadow-brand font-black'
                      : 'text-text-main hover:bg-brand-tint hover:text-brand-dark'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Stethoscope className="w-4 h-4" />
                    <span>Clinical Investigation</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('protocol')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    activeTab === 'protocol'
                      ? 'bg-brand-primary text-brand-navy shadow-brand font-black'
                      : 'text-text-main hover:bg-brand-tint hover:text-brand-dark'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Statutory Protocols</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('audit')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    activeTab === 'audit'
                      ? 'bg-brand-primary text-brand-navy shadow-brand font-black'
                      : 'text-text-main hover:bg-brand-tint hover:text-brand-dark'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Statutory Audit Trail</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-navy/10 font-bold">
                    {auditLogs.length}
                  </span>
                </button>

                <div className="pt-3 border-t border-brand-border px-2">
                  <div className="text-[11px] text-text-secondary leading-snug">
                    Access is audited and logged in compliance with HIPAA &amp; Digital Health Data Protection Acts.
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* TAB 1: CLINICAL INVESTIGATION */}
                {activeTab === 'clinical' && (
                  <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-6 animate-in fade-in">
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
                          className="px-3.5 py-2 rounded-xl border border-brand-border text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <button
                          onClick={() => handleSearchTag(tagInput)}
                          className="px-4 py-2 bg-brand-primary text-brand-navy rounded-xl text-xs font-bold shadow-subtle hover:bg-brand-dark"
                        >
                          Lookup
                        </button>
                      </div>
                    </div>

                    {searchedProfile && searchedTag ? (
                      <div className="space-y-5">
                        {/* Basic Vitals Card */}
                        <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 border border-brand-border flex-shrink-0">
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
                              <div className="text-[11px] text-text-secondary mt-1">
                                Tag Label: {searchedTag.label} • Status: <span className="text-fresh-green font-bold uppercase">{searchedTag.active ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            {!unlockedRecord ? (
                              <button
                                onClick={handleUnlockMedical}
                                disabled={unlockLoading}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-dark text-brand-navy text-xs font-bold rounded-xl shadow-subtle transition-all flex items-center justify-center gap-1.5"
                              >
                                {unlockLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                <span>Unlock Clinical Record</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-fresh-green bg-fresh-mint px-3 py-1.5 rounded-xl border border-fresh-green/30 text-center flex items-center gap-1 justify-center">
                                <CheckCircle2 className="w-3 h-3" /> Record Unlocked
                              </span>
                            )}

                            <button
                              onClick={() => {
                                handleTabChange('protocol');
                                setShowDeceasedModal(true);
                              }}
                              className="px-3 py-2 bg-slate-100 hover:bg-emergency-50 hover:text-emergency-red text-text-secondary text-xs font-semibold rounded-xl transition-colors text-center"
                            >
                              Statutory Action...
                            </button>
                          </div>
                        </div>

                        {unlockError && (
                          <p className="text-xs text-emergency-red font-medium p-3 bg-emergency-50 rounded-xl border border-emergency-red/20">{unlockError}</p>
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
                                Verified Access
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

                            {clinicalData.doctor_notes && (
                              <div className="pt-2 border-t border-fresh-green/20 text-xs text-text-secondary">
                                <strong className="text-brand-navy">Attending Doctor Notes:</strong> {clinicalData.doctor_notes}
                              </div>
                            )}

                            <div className="text-[10px] text-text-secondary pt-1 italic">
                              Access recorded in legal compliance audit log.
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-text-secondary bg-brand-bg rounded-2xl border border-dashed border-brand-border">
                        No registered tag found for <strong className="font-mono">{tagInput}</strong>. Try typing <span className="text-brand-primary font-bold cursor-pointer underline" onClick={() => handleSearchTag('LIFE-9021')}>LIFE-9021</span>.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: STATUTORY PROTOCOLS */}
                {activeTab === 'protocol' && (
                  <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-6 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning-amber" />
                        <div>
                          <h3 className="text-base font-bold text-brand-navy">Statutory Lead Protocols</h3>
                          <p className="text-xs text-text-secondary">Legal procedures for unidentified persons or suspected casualties</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeceasedModal(true)}
                        className="px-3.5 py-2 bg-warning-amber hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-subtle"
                      >
                        New Statutory Entry
                      </button>
                    </div>

                    {protocolSuccessMsg && (
                      <div className="p-3.5 rounded-2xl bg-fresh-mint text-fresh-green text-xs font-bold flex items-center gap-2 border border-fresh-green/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Statutory lead registered successfully. Family notification suppressed per legal protocol.</span>
                      </div>
                    )}

                    {/* Safeguards Card */}
                    <div className="p-5 bg-warning-50 rounded-2xl border border-warning-amber/30 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-warning-amber" />
                        <span>Mandatory Legal Safeguards Protocol</span>
                      </h4>
                      <ul className="text-xs text-text-main space-y-2 list-disc pl-4">
                        <li>
                          <strong>Lead Only:</strong> Tag and wristband findings are treated as preliminary leads, not conclusive legal identity.
                        </li>
                        <li>
                          <strong>Automated Notification Suppression:</strong> The system strictly suppresses automated casualty distress alerts to family members.
                        </li>
                        <li>
                          <strong>In-Person Police Liaison:</strong> The Family Portal displays only neutral instructions requesting family to contact the designated investigating station in person.
                        </li>
                      </ul>
                    </div>

                    {/* Form for Direct Filing */}
                    <div className="p-5 rounded-2xl bg-brand-bg border border-brand-border space-y-4">
                      <div className="text-xs font-bold text-brand-navy">
                        Log Statutory Identification Lead for Tag: <span className="font-mono text-brand-primary">{searchedTag?.code || tagInput}</span>
                      </div>
                      <form onSubmit={handleRecordDeceasedPending} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-brand-navy mb-1">
                            Station Case Reference &amp; Officer Notes
                          </label>
                          <textarea
                            value={officerNotes}
                            onChange={(e) => setOfficerNotes(e.target.value)}
                            placeholder="Enter case diary reference, station ID, and officer contact number..."
                            rows={3}
                            className="w-full p-3 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-warning-amber hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-subtle"
                        >
                          Record Statutory Lead in Ledger
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB 3: STATUTORY AUDIT TRAIL */}
                {activeTab === 'audit' && (
                  <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-6 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
                      <div>
                        <h3 className="text-base font-bold text-brand-navy">Statutory Audit Trail</h3>
                        <p className="text-xs text-text-secondary">Immutable log of authorized identity and clinical data access</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportAuditCsv}
                          className="px-3 py-1.5 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-tint text-xs font-bold text-brand-navy flex items-center gap-1.5 transition-colors"
                          title="Export audit logs to JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Log</span>
                        </button>
                        <span className="text-xs font-mono text-brand-primary font-bold px-2 py-1 bg-brand-tint rounded-lg">
                          {filteredLogs.length} Records
                        </span>
                      </div>
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                        <input
                          type="text"
                          placeholder="Search officer, badge, tag or agency..."
                          value={auditSearchQuery}
                          onChange={(e) => setAuditSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                      </div>

                      <select
                        value={auditActionFilter}
                        onChange={(e) => setAuditActionFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                      >
                        <option value="all">All Actions</option>
                        <option value="RESTRICTED_CLINICAL_UNLOCKED">RESTRICTED_CLINICAL_UNLOCKED</option>
                        <option value="DECEASED_PENDING_CONFIRMATION">DECEASED_PENDING_CONFIRMATION</option>
                        <option value="ID_VERIFICATION_CHECK">ID_VERIFICATION_CHECK</option>
                      </select>
                    </div>

                    {/* Audit Table */}
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
                          {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-brand-bg/50 transition-colors">
                              <td className="py-3 font-mono text-[11px] text-text-secondary whitespace-nowrap">{log.timestamp}</td>
                              <td className="py-3 font-medium text-brand-navy">
                                <div>{log.officer_name}</div>
                                <div className="text-[10px] font-mono text-text-secondary">{log.badge_number}</div>
                              </td>
                              <td className="py-3 text-text-secondary">{log.agency_station}</td>
                              <td className="py-3 font-mono font-bold text-brand-primary">{log.tag_code}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                  log.action.includes('DECEASED')
                                    ? 'bg-warning-50 text-warning-amber border-warning-amber/30'
                                    : 'bg-brand-tint text-brand-dark border-brand-primary/30'
                                }`}>
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
                )}
              </div>
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
          </div>
        )}
      </div>
    </div>
  );
}
