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

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 bg-white border-r border-surface-border p-5 flex flex-col justify-between shadow-subtle">
        <div className="space-y-6">
          {/* Rescuer Badge */}
          <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
            <div className="w-11 h-11 rounded-2xl bg-fresh-mint text-fresh-green flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-navy">Relief Rescuer Unit</div>
              <div className="text-[10px] text-fresh-green font-semibold">Verified Disaster Staff</div>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'scan', label: 'Scan Person', icon: QrCode },
              { id: 'records', label: 'People Records', icon: Users },
              { id: 'camps', label: 'Relief Camps', icon: Building2 },
            ].map((link) => {
              const Icon = link.icon;
              const isSelected = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-fresh-green text-white shadow-subtle'
                      : 'text-text-main hover:bg-brand-bg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-surface-border">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-secondary hover:text-brand-navy rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            <span>Return to Portal</span>
          </Link>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
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
              Bulk triage scanning at shelters, medical triage posts and relief camps.
            </p>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle">
            <span className="text-[11px] font-bold text-text-secondary uppercase">Total Scanned</span>
            <div className="text-2xl font-black text-brand-navy mt-1">{totalScanned}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle">
            <span className="text-[11px] font-bold text-fresh-green uppercase">Safe</span>
            <div className="text-2xl font-black text-fresh-green mt-1">{safeCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle">
            <span className="text-[11px] font-bold text-warning-amber uppercase">Injured</span>
            <div className="text-2xl font-black text-warning-amber mt-1">{injuredCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle">
            <span className="text-[11px] font-bold text-emergency-red uppercase">Admitted</span>
            <div className="text-2xl font-black text-emergency-red mt-1">{admittedCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-surface-border shadow-subtle col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-text-secondary uppercase">Pending ID</span>
            <div className="text-2xl font-black text-brand-navy mt-1">{pendingCount}</div>
          </div>
        </div>

        {/* RESCUER QUICK-SCAN INTERFACE */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-surface-border">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-surface-border">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs font-semibold text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-fresh-green"
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
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-surface-border text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-fresh-green"
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
              <div className="p-4 bg-brand-bg rounded-2xl border border-surface-border flex items-center justify-between gap-4">
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
                        : 'border-surface-border hover:border-slate-300'
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs focus:outline-none focus:ring-2 focus:ring-fresh-green"
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

        {/* SEARCHABLE CAMP LEDGER TABLE */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-surface-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Camp Administration &amp; People Records</h3>
              <p className="text-xs text-text-secondary">Searchable registry of all citizens logged at disaster camps</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, tag, or camp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-surface-border text-xs focus:outline-none focus:ring-2 focus:ring-fresh-green w-48 sm:w-60"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-surface-border text-xs bg-white text-text-secondary"
              >
                <option value="all">All Statuses</option>
                <option value="safe">Safe</option>
                <option value="injured">Injured</option>
                <option value="admitted">Admitted</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                  <th className="py-2.5 px-3">Person</th>
                  <th className="py-2.5 px-3">Tag Code</th>
                  <th className="py-2.5 px-3">Camp Shelter</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Time Scanned</th>
                  <th className="py-2.5 px-3">Latest Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-brand-bg transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={rec.photo_url} alt={rec.person_name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-brand-navy">{rec.person_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-brand-primary">{rec.tag_code}</td>
                    <td className="py-3 px-3 text-text-main">{rec.camp_name.split('—')[0]}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rec.status === 'safe'
                          ? 'bg-fresh-mint text-fresh-green'
                          : rec.status === 'injured'
                          ? 'bg-warning-50 text-warning-amber'
                          : 'bg-emergency-50 text-emergency-red'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-text-secondary">{rec.time_scanned}</td>
                    <td className="py-3 px-3 text-text-secondary max-w-xs truncate">{rec.last_update}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
