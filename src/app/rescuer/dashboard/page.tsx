'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CampPersonRecord, Camp, PersonHealthStatus, Tag, Profile } from '@/types';
import {
  getCampRecords,
  getCamps,
  addRescuerScanRecord,
  getTagByCode,
  getProfileById,
  SEED_CAMPS,
} from '@/lib/data-store';
import {
  Compass,
  QrCode,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Building2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  LogOut,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function RescuerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'scan' | 'camps' | 'records'>('overview');
  const [campRecords, setCampRecords] = useState<CampPersonRecord[]>([]);
  const [camps, setCamps] = useState<Camp[]>(SEED_CAMPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Quick-Scan form states
  const [selectedCampId, setSelectedCampId] = useState<string>(SEED_CAMPS[0].id);
  const [scanTagInput, setScanTagInput] = useState('LIFE-9021');
  const [scannedProfile, setScannedProfile] = useState<Profile | null>(null);
  const [healthStatus, setHealthStatus] = useState<PersonHealthStatus>('safe');
  const [rescuerNotes, setRescuerNotes] = useState('');
  const [scanSavedMsg, setScanSavedMsg] = useState(false);

  // Synchronize activeTab with URL search params for direct loading and browser back/forward support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['overview', 'scan', 'records', 'camps'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['overview', 'scan', 'records', 'camps'].includes(tab)) {
        setActiveTab(tab as any);
      } else {
        setActiveTab('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tabId: 'overview' | 'scan' | 'records' | 'camps') => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url.toString());
    }
  };

  useEffect(() => {
    async function init() {
      const liveCamps = await getCamps();
      setCamps(liveCamps);
      if (liveCamps.length > 0) {
        setSelectedCampId(liveCamps[0].id);
      }
      setCampRecords(getCampRecords());
    }
    init();
  }, []);

  const handleLookupTag = async (code: string) => {
    setScanTagInput(code);
    const tag = await getTagByCode(code);
    if (tag) {
      const p = await getProfileById(tag.profile_id);
      setScannedProfile(p);
    } else {
      setScannedProfile(null);
    }
  };

  useEffect(() => {
    handleLookupTag('LIFE-9021');
  }, []);

  const handleSaveRescuerScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const camp = camps.find((c) => c.id === selectedCampId) || camps[0];
    const newRecord = await addRescuerScanRecord({
      tagCode: scanTagInput,
      campId: camp.id,
      campName: camp.name,
      status: healthStatus,
      notes: rescuerNotes || 'Logged during relief camp triage.',
    });

    setCampRecords((prev) => [newRecord, ...prev]);
    setScanSavedMsg(true);
    setTimeout(() => setScanSavedMsg(false), 3500);
  };

  // Metrics
  const totalScanned = campRecords.length;
  const safeCount = campRecords.filter((r) => r.status === 'safe').length;
  const injuredCount = campRecords.filter((r) => r.status === 'injured').length;
  const admittedCount = campRecords.filter((r) => r.status === 'admitted').length;
  const pendingCount = 2; // synthetic pending count

  const filteredRecords = campRecords.filter((r) => {
    const matchesSearch =
      r.person_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tag_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.camp_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  interface RescuerSidebarLink {
    id: 'overview' | 'scan' | 'records' | 'camps';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const sidebarLinks: RescuerSidebarLink[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'scan', label: 'Scan Person', icon: QrCode },
    { id: 'records', label: 'People Records', icon: Users, badge: `${campRecords.length}` },
    { id: 'camps', label: 'Relief Camps', icon: Building2, badge: `${camps.length}` },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-full lg:w-64 bg-white border-r border-brand-border p-5 flex flex-col justify-between shadow-subtle flex-shrink-0">
        <div className="space-y-6">
          {/* Rescuer Badge */}
          <div className="flex items-center gap-3 pb-4 border-b border-brand-border">
            <div className="w-11 h-11 rounded-2xl bg-fresh-mint text-fresh-green flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-navy">Relief Rescuer Unit</div>
              <div className="text-[10px] text-fresh-green font-semibold">Verified Disaster Staff</div>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Rescuer Dashboard Navigation">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isSelected = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleTabChange(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-fresh-green ${
                    isSelected
                      ? 'bg-fresh-green text-white shadow-subtle font-bold'
                      : 'text-text-main hover:bg-brand-bg'
                  }`}
                  aria-current={isSelected ? 'page' : undefined}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </span>
                  {link.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-brand-bg text-text-secondary'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-brand-border">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-secondary hover:text-brand-navy rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            <span>Return to Portal</span>
          </Link>
        </div>
      </aside>

      {/* MOBILE RESPONSIVE TAB BAR */}
      <div className="lg:hidden bg-white border-b border-brand-border px-3 py-2 overflow-x-auto flex items-center gap-1 sticky top-16 z-30 shadow-subtle">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isSelected = activeTab === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => handleTabChange(link.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-fresh-green text-white shadow-subtle'
                  : 'text-text-secondary hover:bg-brand-bg'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN VIEW */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-fresh-green animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                Crisis Mode Active • Disaster Coordination
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Rescuer Quick-Scan &amp; Camp Ledger
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Bulk triage scanning at shelters, medical triage posts and relief camps. Current View: <strong className="text-fresh-green uppercase">{activeTab}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTabChange('scan')}
              className="flex items-center gap-1.5 px-3 py-2 bg-fresh-green hover:bg-fresh-green/90 text-white rounded-xl text-xs font-bold shadow-subtle transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Quick Triage Scan</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW (Always visible for emergency operational readiness) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => handleTabChange('records')}
            className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle cursor-pointer hover:border-brand-primary/50 transition-colors"
          >
            <span className="text-[11px] font-bold text-text-secondary uppercase">Total Scanned</span>
            <div className="text-2xl font-black text-brand-navy mt-1">{totalScanned}</div>
          </div>
          <div
            onClick={() => { setStatusFilter('safe'); handleTabChange('records'); }}
            className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle cursor-pointer hover:border-fresh-green/50 transition-colors"
          >
            <span className="text-[11px] font-bold text-fresh-green uppercase">Safe</span>
            <div className="text-2xl font-black text-fresh-green mt-1">{safeCount}</div>
          </div>
          <div
            onClick={() => { setStatusFilter('injured'); handleTabChange('records'); }}
            className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle cursor-pointer hover:border-warning-amber/50 transition-colors"
          >
            <span className="text-[11px] font-bold text-warning-amber uppercase">Injured</span>
            <div className="text-2xl font-black text-warning-amber mt-1">{injuredCount}</div>
          </div>
          <div
            onClick={() => { setStatusFilter('admitted'); handleTabChange('records'); }}
            className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle cursor-pointer hover:border-emergency-red/50 transition-colors"
          >
            <span className="text-[11px] font-bold text-emergency-red uppercase">Admitted</span>
            <div className="text-2xl font-black text-emergency-red mt-1">{admittedCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-text-secondary uppercase">Pending ID</span>
            <div className="text-2xl font-black text-brand-navy mt-1">{pendingCount}</div>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW TAB
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => handleTabChange('scan')}
                className="p-5 rounded-3xl bg-white border border-brand-border shadow-card cursor-pointer hover:border-fresh-green/60 hover:shadow-elevated transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-fresh-mint text-fresh-green flex items-center justify-center font-bold mb-3">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-brand-navy group-hover:text-fresh-green transition-colors">
                  Scan Citizen QR Tag →
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Read physical wristband, vehicle tag, or ID card and register health status into the ledger.
                </p>
              </div>

              <div
                onClick={() => handleTabChange('records')}
                className="p-5 rounded-3xl bg-white border border-brand-border shadow-card cursor-pointer hover:border-fresh-green/60 hover:shadow-elevated transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-brand-tint text-brand-dark flex items-center justify-center font-bold mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-dark transition-colors">
                  Search Scanned Records →
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Search across {campRecords.length} citizens by name, tag ID, or relief camp shelter.
                </p>
              </div>

              <div
                onClick={() => handleTabChange('camps')}
                className="p-5 rounded-3xl bg-white border border-brand-border shadow-card cursor-pointer hover:border-fresh-green/60 hover:shadow-elevated transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-brand-navy group-hover:text-blue-600 transition-colors">
                  Manage Relief Camps →
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  View capacity and live occupant counts for {camps.length} active disaster relief shelters.
                </p>
              </div>
            </div>

            {/* Recent Scans Feed */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <h3 className="text-base font-bold text-brand-navy">Recent Camp Admissions</h3>
                <button
                  type="button"
                  onClick={() => handleTabChange('records')}
                  className="text-xs font-bold text-fresh-green hover:underline flex items-center gap-1"
                >
                  <span>View All Records</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {campRecords.slice(0, 4).map((rec) => (
                  <div key={rec.id} className="p-3.5 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                        <img src={rec.photo_url} alt={rec.person_name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-navy">{rec.person_name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-tint text-brand-dark font-bold">{rec.tag_code}</span>
                        </div>
                        <div className="text-text-secondary mt-0.5">{rec.camp_name} • {rec.notes || rec.last_update}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rec.status === 'safe'
                          ? 'bg-fresh-mint text-fresh-green border border-fresh-green/30'
                          : rec.status === 'injured'
                          ? 'bg-warning-50 text-warning-amber border border-warning-amber/30'
                          : 'bg-emergency-50 text-emergency-red border border-emergency-red/30'
                      }`}>
                        {rec.status}
                      </span>
                      <div className="text-[10px] font-mono text-text-secondary mt-1">{rec.time_scanned}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SCAN PERSON TAB
           ========================================================================= */}
        {activeTab === 'scan' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-brand-border">
                <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-fresh-green" />
                  <span>Rescuer Quick-Scan (Crisis Mode)</span>
                </h3>
                {scanSavedMsg && (
                  <span className="text-xs font-bold text-fresh-green flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Status Recorded &amp; Family Auto-Notified!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveRescuerScan} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Camp Selection */}
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      1. Current Camp / Shelter Location
                    </label>
                    <select
                      value={selectedCampId}
                      onChange={(e) => setSelectedCampId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-fresh-green"
                    >
                      {camps.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.current_count}/{c.capacity} occupants)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tag Input / Quick Picker */}
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      2. Scan or Enter Tag Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={scanTagInput}
                        onChange={(e) => handleLookupTag(e.target.value)}
                        placeholder="e.g. LIFE-9021"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-fresh-green"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleLookupTag('LIFE-4412')}
                        className="px-2.5 py-1 bg-brand-bg hover:bg-slate-200 text-brand-navy text-[10px] font-mono font-bold rounded-xl"
                      >
                        LIFE-4412
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLookupTag('LIFE-7703')}
                        className="px-2.5 py-1 bg-brand-bg hover:bg-slate-200 text-brand-navy text-[10px] font-mono font-bold rounded-xl"
                      >
                        LIFE-7703
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permitted Profile Info Preview */}
                {scannedProfile && (
                  <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                        <img
                          src={scannedProfile.photo_url}
                          alt={scannedProfile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-navy">{scannedProfile.name}</h4>
                        <p className="text-xs text-text-secondary">
                          Blood Group: <strong className="text-emergency-red font-bold">{scannedProfile.blood_group}</strong> • Language: {scannedProfile.language}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Allergies: {scannedProfile.allergies.join(', ') || 'None'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-fresh-mint text-fresh-green rounded-full">
                        Match Found
                      </span>
                    </div>
                  </div>
                )}

                {/* Health Status Selector */}
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-2">
                    3. Mark Health / Triage Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'safe', label: 'Safe', desc: 'Uninjured / Sheltered', color: 'border-fresh-green bg-fresh-mint/40 text-fresh-green' },
                      { id: 'injured', label: 'Injured', desc: 'Minor trauma / Ambulatory', color: 'border-warning-amber bg-warning-50 text-warning-amber' },
                      { id: 'admitted', label: 'Admitted', desc: 'Hospitalized / Inpatient', color: 'border-emergency-red bg-emergency-50 text-emergency-red' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setHealthStatus(s.id as PersonHealthStatus)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          healthStatus === s.id
                            ? `${s.color} shadow-subtle ring-2 ring-brand-navy/10`
                            : 'border-brand-border hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold uppercase">{s.label}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rescuer Notes */}
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    4. Camp Log Notes (Sent to Family Console)
                  </label>
                  <input
                    type="text"
                    value={rescuerNotes}
                    onChange={(e) => setRescuerNotes(e.target.value)}
                    placeholder="e.g. Resting in Medical Tent 2, hydrated, family notified."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-fresh-green"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-fresh-green hover:bg-fresh-green/90 text-white rounded-2xl font-bold text-xs shadow-success transition-all active:scale-[0.99]"
                >
                  Save Status &amp; Dispatch Family Alert
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PEOPLE RECORDS TAB (Camp Ledger)
           ========================================================================= */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Disaster Victim Triage Ledger</h3>
                  <p className="text-xs text-text-secondary">Searchable register of all citizens verified at relief facilities</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, tag, or camp..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-fresh-green"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl border border-brand-border text-xs font-semibold text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-fresh-green"
                  >
                    <option value="all">All Statuses ({campRecords.length})</option>
                    <option value="safe">Safe Only ({safeCount})</option>
                    <option value="injured">Injured Only ({injuredCount})</option>
                    <option value="admitted">Admitted Only ({admittedCount})</option>
                  </select>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-border text-text-secondary">
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Citizen / Tag</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Camp Shelter</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Status</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Time Logged</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider text-[10px]">Rescuer Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-text-secondary">
                          No matching citizen triage records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-brand-bg/50 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <img src={r.photo_url} alt={r.person_name} className="w-8 h-8 rounded-lg object-cover" />
                              <div>
                                <span className="font-bold text-brand-navy block">{r.person_name}</span>
                                <span className="font-mono text-[10px] text-brand-primary">{r.tag_code} ({r.blood_group})</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-text-secondary">{r.camp_name}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.status === 'safe'
                                ? 'bg-fresh-mint text-fresh-green border border-fresh-green/30'
                                : r.status === 'injured'
                                ? 'bg-warning-50 text-warning-amber border border-warning-amber/30'
                                : 'bg-emergency-50 text-emergency-red border border-emergency-red/30'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-[11px] text-text-secondary whitespace-nowrap">{r.time_scanned}</td>
                          <td className="py-3 text-text-secondary max-w-xs truncate" title={r.notes}>{r.notes || r.last_update}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RELIEF CAMPS TAB
           ========================================================================= */}
        {activeTab === 'camps' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div>
                <h2 className="text-lg font-black text-brand-navy">Active Disaster Relief Shelters</h2>
                <p className="text-xs text-text-secondary">Disaster relief infrastructure capacity, occupancy and triage posts</p>
              </div>
              <span className="text-xs font-mono font-bold text-fresh-green bg-fresh-mint px-2.5 py-1 rounded-lg">
                {camps.length} Authorized Camps
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {camps.map((camp) => {
                const occupancyPct = Math.round((camp.current_count / camp.capacity) * 100);
                return (
                  <div key={camp.id} className="p-5 rounded-3xl bg-white border border-brand-border shadow-card space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-brand-tint text-brand-dark flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-brand-navy font-bold">
                        {occupancyPct}% Full
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-brand-navy leading-snug">{camp.name}</h4>
                      <p className="text-xs text-text-secondary mt-1">{camp.location_desc || 'Disaster coordination shelter zone'}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-brand-border">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-text-secondary">Occupancy:</span>
                        <span className="font-bold text-brand-navy">{camp.current_count} / {camp.capacity}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            occupancyPct > 80 ? 'bg-emergency-red' : 'bg-fresh-green'
                          }`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-text-secondary flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-fresh-green" />
                      <span>{camp.lat.toFixed(4)}° N, {camp.lng.toFixed(4)}° E</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCampId(camp.id);
                        handleTabChange('scan');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-brand-bg hover:bg-brand-tint text-brand-navy text-xs font-bold border border-brand-border transition-colors text-center"
                    >
                      Select for Quick-Scan
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
