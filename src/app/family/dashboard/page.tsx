'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Incident, Profile, FamilyMember, Tag, CampPersonRecord } from '@/types';
import {
  getAllIncidents,
  getProfileById,
  getTagByCode,
  getTagsForProfile,
  updateIncidentStatus,
  subscribeToAllIncidents,
  getCampRecords,
  toggleTagActive,
  SEED_PROFILES,
  SEED_FAMILY,
  SEED_TAGS,
  createIncident,
} from '@/lib/data-store';
import { FamilyAlertBanner } from '@/components/FamilyAlertBanner';
import { EmergencyMap } from '@/components/EmergencyMap';
import { NearbyHospitals } from '@/components/NearbyHospitals';
import {
  LayoutDashboard,
  Bell,
  Users,
  MapPin,
  Settings,
  LogOut,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Compass,
  ExternalLink,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Check,
  ChevronRight,
  Shield,
  Volume2,
} from 'lucide-react';

export default function FamilyDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'profiles' | 'map' | 'notifications' | 'settings'>('overview');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(SEED_PROFILES[0].id);
  const [campRecords, setCampRecords] = useState<CampPersonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileTags, setProfileTags] = useState<Tag[]>([]);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Settings mock state
  const [maskPhoneEnabled, setMaskPhoneEnabled] = useState(true);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [defaultEtaMinutes, setDefaultEtaMinutes] = useState(15);

  const activeProfile = SEED_PROFILES.find((p) => p.id === selectedProfileId) || SEED_PROFILES[0];
  const activeFamily = SEED_FAMILY.filter((f) => f.profile_id === activeProfile.id);
  const activeTag = profileTags[0] || SEED_TAGS.find((t) => t.profile_id === activeProfile.id) || SEED_TAGS[0];

  const profileTagIds = profileTags.map((t) => t.id);
  const activeIncidentsForProfile = incidents.filter(
    (inc) => (inc.tag_id === activeTag.id || profileTagIds.includes(inc.tag_id)) && inc.status !== 'resolved'
  );
  const activeIncident = activeIncidentsForProfile[0] || null;
  const pastIncidents = incidents.filter(
    (inc) => (inc.tag_id === activeTag.id || profileTagIds.includes(inc.tag_id)) && inc.status === 'resolved'
  );

  // Synchronize activeTab with URL search params for direct loading and browser back/forward support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['overview', 'alerts', 'profiles', 'map', 'notifications', 'settings'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['overview', 'alerts', 'profiles', 'map', 'notifications', 'settings'].includes(tab)) {
        setActiveTab(tab as any);
      } else {
        setActiveTab('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tabId: 'overview' | 'alerts' | 'profiles' | 'map' | 'notifications' | 'settings') => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url.toString());
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await getAllIncidents();
        setIncidents(list);
        setCampRecords(getCampRecords());
        const tags = await getTagsForProfile(selectedProfileId);
        setProfileTags(tags);
      } finally {
        setLoading(false);
      }
    }

    load();

    const unsubscribe = subscribeToAllIncidents((updatedList) => {
      setIncidents(updatedList);
    });

    return () => {
      unsubscribe();
    };
  }, [selectedProfileId]);

  const handleUpdateStatus = async (
    incidentId: string,
    status: 'acknowledged' | 'resolved',
    etaMinutes?: number
  ) => {
    const updated = await updateIncidentStatus(incidentId, status, etaMinutes);
    if (updated) {
      setIncidents((prev) => prev.map((i) => (i.id === incidentId ? updated : i)));
    }
  };

  const handleSimulateAlert = async () => {
    const newInc = await createIncident({
      tagId: activeTag.id,
      situation: 'accident',
      lat: 28.6139,
      lng: 77.2090,
      locationName: 'Connaught Place Outer Circle, New Delhi',
      note: 'Simulated Alert: Bystander reports vehicle skid, conscious and stable.',
    });
    setIncidents((prev) => [newInc, ...prev]);
    handleTabChange('alerts');
  };

  const handleToggleTagState = async (tagId: string) => {
    const updated = await toggleTagActive(tagId);
    if (updated) {
      setProfileTags((prev) => prev.map((t) => (t.id === tagId ? updated : t)));
    }
  };

  interface SidebarLink {
    id: 'overview' | 'alerts' | 'profiles' | 'map' | 'notifications' | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
  }

  const sidebarLinks: SidebarLink[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'alerts', label: 'Emergency Alerts', icon: Bell, badge: activeIncident ? '1' : null },
    { id: 'profiles', label: 'Family Profiles', icon: Users },
    { id: 'map', label: 'Location & Map', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: HeartPulse },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-full lg:w-64 bg-white border-r border-brand-border p-5 flex flex-col justify-between shadow-subtle flex-shrink-0">
        <div className="space-y-6">
          {/* User Profile Mini Block */}
          <div className="flex items-center gap-3 pb-4 border-b border-brand-border">
            <div className="w-11 h-11 rounded-2xl bg-brand-tint border border-brand-primary/30 flex items-center justify-center font-bold text-brand-dark">
              PS
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-brand-navy truncate">Priya Sharma</div>
              <div className="text-[10px] text-text-secondary truncate">Family Admin Account</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Family Dashboard Navigation">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isSelected = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleTabChange(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    isSelected
                      ? 'bg-brand-primary text-brand-navy shadow-brand font-black'
                      : 'text-text-main hover:bg-brand-tint'
                  }`}
                  aria-current={isSelected ? 'page' : undefined}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </span>
                  {link.badge && (
                    <span className="w-5 h-5 rounded-full bg-emergency-red text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Persona Switcher / Profile selector */}
        <div className="pt-6 border-t border-brand-border space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Switch Family Profile:
          </div>
          <div className="space-y-1">
            {SEED_PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProfileId(p.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedProfileId === p.id
                    ? 'bg-brand-tint text-brand-dark font-black border border-brand-primary/40'
                    : 'text-text-secondary hover:bg-slate-50'
                }`}
              >
                {p.name} ({p.blood_group})
              </button>
            ))}
          </div>

          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-secondary hover:text-emergency-red rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit to Home</span>
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
                  ? 'bg-brand-primary text-brand-navy shadow-subtle'
                  : 'text-text-secondary hover:bg-brand-bg'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
              {link.badge && (
                <span className="w-4 h-4 rounded-full bg-emergency-red text-white text-[9px] font-bold flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                PingME Family Hub • Live Realtime Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Family Emergency Console
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Monitoring <strong className="text-brand-navy">{activeProfile.name}</strong> • Active View: <span className="text-brand-dark uppercase font-bold">{activeTab}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/t/${activeTag.code}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-brand-tint text-brand-navy rounded-xl text-xs font-bold border border-brand-border transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Scan Card</span>
            </Link>

            <button
              onClick={handleSimulateAlert}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary hover:bg-brand-dark text-brand-navy rounded-xl text-xs font-black shadow-brand transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-navy" />
              <span>Simulate Emergency Alert</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW TAB
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Active Incident Warning or Calm Safe Card */}
            {activeIncident ? (
              <FamilyAlertBanner
                incident={activeIncident}
                profile={activeProfile}
                onUpdateStatus={handleUpdateStatus}
              />
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-card border border-brand-border text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-brand-tint text-brand-dark flex items-center justify-center mx-auto border border-brand-primary/30">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-navy">
                    No Active Emergencies — {activeProfile.name} is Protected
                  </h2>
                  <p className="text-xs text-text-secondary max-w-md mx-auto mt-1 leading-relaxed">
                    All PingME Lifeline tags linked to {activeProfile.name} ({activeTag.code}) are active and standing by. If a bystander scans the tag, you will receive real-time siren alerts here.
                  </p>
                </div>
              </div>
            )}

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => handleTabChange('profiles')}
                className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle cursor-pointer hover:border-brand-primary/50 transition-colors"
              >
                <div className="text-xs font-bold text-text-secondary mb-1">Active Tags</div>
                <div className="text-2xl font-black text-brand-navy">{SEED_TAGS.filter(t => t.profile_id === activeProfile.id).length}</div>
                <div className="text-[11px] text-fresh-green font-semibold mt-1">All tags active &amp; verified →</div>
              </div>

              <div
                onClick={() => handleTabChange('profiles')}
                className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle cursor-pointer hover:border-brand-primary/50 transition-colors"
              >
                <div className="text-xs font-bold text-text-secondary mb-1">Emergency Contacts</div>
                <div className="text-2xl font-black text-brand-navy">{activeFamily.length}</div>
                <div className="text-[11px] text-brand-primary font-bold mt-1">Masked Relay enabled →</div>
              </div>

              <div
                onClick={() => handleTabChange('alerts')}
                className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle cursor-pointer hover:border-brand-primary/50 transition-colors"
              >
                <div className="text-xs font-bold text-text-secondary mb-1">Incident History</div>
                <div className="text-2xl font-black text-brand-navy">{pastIncidents.length}</div>
                <div className="text-[11px] text-text-secondary font-medium mt-1">Logged and archived →</div>
              </div>
            </div>

            {/* Snapshot & Live Location Map Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h3 className="text-sm font-bold text-brand-navy">Citizen Profile Snapshot</h3>
                  <span className="font-mono text-xs font-bold text-brand-primary">{activeTag.code}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={activeProfile.photo_url} alt={activeProfile.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-navy">{activeProfile.name}</h4>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Blood Group: <strong className="text-emergency-red font-bold">{activeProfile.blood_group}</strong> • {activeTag.type}
                    </div>
                  </div>
                </div>
                <div className="pt-2 text-xs text-text-secondary space-y-1">
                  <div><strong>Allergies:</strong> {activeProfile.allergies.join(', ') || 'None reported'}</div>
                  <div><strong>Conditions:</strong> {activeProfile.conditions.join(', ') || 'None reported'}</div>
                  <div><strong>Language:</strong> {activeProfile.language}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('profiles')}
                  className="w-full py-2 px-3 rounded-xl bg-brand-bg hover:bg-brand-tint text-brand-navy text-xs font-bold border border-brand-border transition-colors text-center block"
                >
                  View Full Profile Details &amp; Tags
                </button>
              </div>

              {/* Map Preview */}
              <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h3 className="text-sm font-bold text-brand-navy">Location &amp; Hospital Radar</h3>
                  <button
                    type="button"
                    onClick={() => handleTabChange('map')}
                    className="text-xs font-bold text-brand-dark hover:underline flex items-center gap-1"
                  >
                    <span>Full Map View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <EmergencyMap
                  lat={activeIncident ? activeIncident.lat : 28.6139}
                  lng={activeIncident ? activeIncident.lng : 77.2090}
                  personName={activeProfile.name}
                  situation={activeIncident ? activeIncident.situation : 'Monitoring'}
                  registeredLat={28.6250}
                  registeredLng={77.2180}
                  showRegisteredBaseline={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: EMERGENCY ALERTS TAB
           ========================================================================= */}
        {activeTab === 'alerts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div>
                <h2 className="text-lg font-black text-brand-navy">Emergency Alerts &amp; Incidents</h2>
                <p className="text-xs text-text-secondary">Real-time distress transmissions and incident logs for {activeProfile.name}</p>
              </div>
              <button
                type="button"
                onClick={handleSimulateAlert}
                className="px-3.5 py-2 bg-brand-primary hover:bg-brand-dark text-brand-navy text-xs font-black rounded-xl shadow-brand"
              >
                + Trigger Test Emergency Alert
              </button>
            </div>

            {/* Active Incident Alert Banner */}
            {activeIncident ? (
              <div className="space-y-6">
                <FamilyAlertBanner
                  incident={activeIncident}
                  profile={activeProfile}
                  onUpdateStatus={handleUpdateStatus}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <EmergencyMap
                    lat={activeIncident.lat}
                    lng={activeIncident.lng}
                    personName={activeProfile.name}
                    situation={activeIncident.situation}
                  />
                  <NearbyHospitals lat={activeIncident.lat} lng={activeIncident.lng} />
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-3xl border border-brand-border shadow-card text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-fresh-mint text-fresh-green flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-brand-navy">No Active Incidents</h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  There are no open emergency alerts for this profile. When a bystander reports an accident, the alert siren will ring immediately.
                </p>
              </div>
            )}

            {/* Incident History Archive */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <h3 className="text-sm font-bold text-brand-navy">Archived Incident History</h3>
                <span className="text-xs font-mono text-text-secondary">{pastIncidents.length} Resolved</span>
              </div>

              {pastIncidents.length === 0 ? (
                <div className="text-center py-6 text-xs text-text-secondary">
                  No previous incident history recorded for this tag.
                </div>
              ) : (
                <div className="space-y-3">
                  {pastIncidents.map((inc) => (
                    <div key={inc.id} className="p-3.5 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-navy uppercase">{inc.situation}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-fresh-mint text-fresh-green font-bold">Resolved</span>
                        </div>
                        <div className="text-text-secondary mt-0.5">{inc.location_name || 'Location logged'} • {inc.note || 'No notes provided'}</div>
                      </div>
                      <div className="text-right text-[11px] font-mono text-text-secondary">
                        {new Date(inc.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: FAMILY PROFILES TAB
           ========================================================================= */}
        {activeTab === 'profiles' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div>
                <h2 className="text-lg font-black text-brand-navy">Family Members &amp; Linked QR Tags</h2>
                <p className="text-xs text-text-secondary">Manage emergency identity profiles, vitals, and physical tags</p>
              </div>
            </div>

            {/* Profile Selection Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SEED_PROFILES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProfileId(p.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedProfileId === p.id
                      ? 'border-brand-primary bg-white shadow-card ring-2 ring-brand-primary/20'
                      : 'border-brand-border bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy">{p.name}</div>
                      <div className="text-[11px] text-emergency-red font-bold">Blood: {p.blood_group}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Profile Details */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <h3 className="text-base font-bold text-brand-navy">Emergency Card: {activeProfile.name}</h3>
                <span className="text-xs font-mono font-bold text-brand-primary bg-brand-tint px-2.5 py-1 rounded-lg">
                  {activeTag.code}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold text-brand-navy uppercase tracking-wider">Medical Highlights</div>
                  <div className="text-xs space-y-1 text-text-main">
                    <div><strong>Allergies:</strong> {activeProfile.allergies.join(', ') || 'None reported'}</div>
                    <div><strong>Conditions:</strong> {activeProfile.conditions.join(', ') || 'None reported'}</div>
                    <div><strong>Language:</strong> {activeProfile.language}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold text-brand-navy uppercase tracking-wider">Emergency Notes for First Responders</div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {activeProfile.emergency_notes || 'No special emergency instructions provided.'}
                  </p>
                </div>
              </div>

              {/* Linked Physical Tags */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                  Physical PingME Tags Linked to {activeProfile.name}:
                </h4>
                <div className="space-y-2.5">
                  {profileTags.map((tag) => (
                    <div key={tag.id} className="p-3.5 rounded-2xl bg-white border border-brand-border flex items-center justify-between gap-3 shadow-subtle">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-5 h-5 text-brand-primary" />
                        <div>
                          <div className="text-xs font-bold text-brand-navy">{tag.label || `${tag.type.toUpperCase()} Tag`}</div>
                          <div className="text-[10px] font-mono text-text-secondary">Code: {tag.code}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTagState(tag.id)}
                          className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors ${
                            tag.active
                              ? 'bg-fresh-mint text-fresh-green border border-fresh-green/30'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {tag.active ? 'Active ✔' : 'Deactivated ✖'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registered Family Emergency Contacts */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                  Emergency Contacts (Privacy Masked):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeFamily.map((fam) => (
                    <div key={fam.id} className="p-3.5 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-brand-navy">{fam.name} ({fam.relation})</div>
                        <div className="text-[11px] font-mono text-text-secondary mt-0.5">📞 {fam.phone_masked}</div>
                      </div>
                      <span className="text-[10px] font-semibold text-brand-dark bg-brand-tint px-2 py-0.5 rounded border border-brand-primary/30">
                        Masked Relay
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: LOCATION & MAP TAB
           ========================================================================= */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div>
                <h2 className="text-lg font-black text-brand-navy">Live GPS &amp; Emergency Hospital Map</h2>
                <p className="text-xs text-text-secondary">OpenStreetMap coordinates, bystander GPS lock, and hospital routing</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-fresh-mint text-fresh-green text-xs font-bold border border-fresh-green/30">
                OpenStreetMap Free Tier • No API Key Required
              </span>
            </div>

            {/* Main Interactive Map */}
            <div className="space-y-2">
              <EmergencyMap
                lat={activeIncident ? activeIncident.lat : 28.6139}
                lng={activeIncident ? activeIncident.lng : 77.2090}
                personName={activeProfile.name}
                situation={activeIncident ? activeIncident.situation : 'Standing by'}
                registeredLat={28.6250}
                registeredLng={77.2180}
                registeredLocationName={`${activeProfile.name}'s Residence (New Delhi Base)`}
                showRegisteredBaseline={true}
              />
            </div>

            {/* Nearby Emergency Trauma Centers */}
            <NearbyHospitals
              lat={activeIncident ? activeIncident.lat : 28.6139}
              lng={activeIncident ? activeIncident.lng : 77.2090}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 5: NOTIFICATIONS TAB
           ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div>
                <h2 className="text-lg font-black text-brand-navy">Notifications &amp; Crisis Feeds</h2>
                <p className="text-xs text-text-secondary">Updates from rescuers, relief shelters, and system safety audits</p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-primary">{campRecords.length} Triage Logs</span>
            </div>

            <div className="space-y-3">
              {campRecords.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-white rounded-2xl border border-brand-border shadow-subtle flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-fresh-mint text-fresh-green flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-brand-navy">Disaster Relief Camp Scan: {c.person_name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-tint text-brand-dark font-bold">{c.tag_code}</span>
                      </div>
                      <p className="text-xs text-brand-navy mt-1">
                        Citizen admitted to <strong>{c.camp_name}</strong>. Current status marked as <span className="uppercase font-bold text-fresh-green">{c.status}</span>.
                      </p>
                      <p className="text-[11px] text-text-secondary italic mt-0.5">{c.notes || c.last_update}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary whitespace-nowrap">{c.time_scanned}</span>
                </div>
              ))}

              <div className="p-4 bg-white rounded-2xl border border-brand-border shadow-subtle flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                  <span className="font-semibold text-brand-navy">PingME Virtual Relay Status: Active (Zero raw phone leaks)</span>
                </div>
                <span className="text-[10px] font-mono text-fresh-green font-bold">100% Operational</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: SETTINGS TAB
           ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div>
                <h2 className="text-lg font-black text-brand-navy">Family Hub Preferences</h2>
                <p className="text-xs text-text-secondary">Configure alerts, privacy protection, and automated notifications</p>
              </div>
              {settingsSaved && (
                <span className="text-xs font-bold text-fresh-green flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Settings Saved!
                </span>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-5">
              {/* Privacy Shield */}
              <div className="flex items-center justify-between p-4 bg-brand-bg rounded-2xl border border-brand-border">
                <div>
                  <div className="text-xs font-bold text-brand-navy flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-primary" />
                    <span>PingME Privacy Shield (Masked Numbers)</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Never expose raw mobile numbers to strangers who scan your family tags.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMaskPhoneEnabled(!maskPhoneEnabled);
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2000);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    maskPhoneEnabled ? 'bg-fresh-mint text-fresh-green border border-fresh-green/30' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {maskPhoneEnabled ? 'Enabled ✔' : 'Disabled'}
                </button>
              </div>

              {/* Siren Audio Alert */}
              <div className="flex items-center justify-between p-4 bg-brand-bg rounded-2xl border border-brand-border">
                <div>
                  <div className="text-xs font-bold text-brand-navy flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emergency-red" />
                    <span>Audible Emergency Siren Alarm</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Play browser audio chime when a bystander reports an accident alert.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSoundAlertsEnabled(!soundAlertsEnabled);
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2000);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    soundAlertsEnabled ? 'bg-fresh-mint text-fresh-green border border-fresh-green/30' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {soundAlertsEnabled ? 'Enabled ✔' : 'Muted'}
                </button>
              </div>

              {/* Default Arrival ETA */}
              <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border space-y-2">
                <div className="text-xs font-bold text-brand-navy flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span>Default Fast Response Arrival Time</span>
                </div>
                <p className="text-[11px] text-text-secondary">
                  Preset ETA dispatched to bystander phones when tapping &quot;On My Way&quot;.
                </p>
                <div className="flex gap-2 pt-1">
                  {[5, 10, 15, 25, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setDefaultEtaMinutes(mins);
                        setSettingsSaved(true);
                        setTimeout(() => setSettingsSaved(false), 2000);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        defaultEtaMinutes === mins
                          ? 'bg-brand-primary text-brand-navy shadow-subtle'
                          : 'bg-white border border-brand-border text-text-main'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
