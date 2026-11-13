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
} from 'lucide-react';

export default function FamilyDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'profiles' | 'map' | 'notifications' | 'settings'>('overview');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(SEED_PROFILES[0].id);
  const [campRecords, setCampRecords] = useState<CampPersonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileTags, setProfileTags] = useState<Tag[]>([]);

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
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'alerts', label: 'Emergency Alerts', icon: Bell, badge: activeIncident ? '1' : null },
    { id: 'profiles', label: 'Family Profiles', icon: Users },
    { id: 'map', label: 'Location & Map', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: HeartPulse },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 bg-white border-r border-brand-border p-5 flex flex-col justify-between shadow-subtle">
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
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isSelected = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-primary text-brand-navy shadow-brand'
                      : 'text-text-main hover:bg-brand-tint'
                  }`}
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

        {/* Persona Switcher / Logout */}
        <div className="pt-6 border-t border-brand-border space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Switch Family Profile:
          </div>
          <div className="space-y-1">
            {SEED_PROFILES.map((p) => (
              <button
                key={p.id}
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                PingME Family Hub • Live Realtime Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Family Emergency Dashboard
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Live status, emergency maps &amp; incoming distress signals for {activeProfile.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/t/${activeTag.code}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-brand-tint text-brand-navy rounded-xl text-xs font-bold border border-brand-border transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Scan Page</span>
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

        {/* ACTIVE EMERGENCY CARD (If incident is active) */}
        {activeIncident ? (
          <div className="space-y-6">
            <FamilyAlertBanner
              incident={activeIncident}
              profile={activeProfile}
              onUpdateStatus={handleUpdateStatus}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Incident Location Map Pin
                  </h3>
                  <span className="text-[10px] font-mono text-fresh-green font-semibold">
                    OpenStreetMap Live
                  </span>
                </div>
                <EmergencyMap
                  lat={activeIncident.lat}
                  lng={activeIncident.lng}
                  personName={activeProfile.name}
                  situation={activeIncident.situation}
                />
              </div>

              <div>
                <NearbyHospitals
                  lat={activeIncident.lat}
                  lng={activeIncident.lng}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Calm / Safe State Card */
          <div className="bg-white rounded-3xl p-8 shadow-card border border-brand-border text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-tint text-brand-dark flex items-center justify-center mx-auto border border-brand-primary/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy">
                No Active Emergencies — {activeProfile.name} is Protected
              </h2>
              <p className="text-xs text-text-secondary max-w-md mx-auto mt-1 leading-relaxed">
                All PingME Lifeline tags linked to {activeProfile.name} ({activeTag.code}) are active and standing by. If a bystander scans the tag and reports an incident, you will be notified immediately here.
              </p>
            </div>
          </div>
        )}

        {/* DASHBOARD OVERVIEW METRICS & PROFILES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle">
            <div className="text-xs font-bold text-text-secondary mb-1">Active Tags</div>
            <div className="text-2xl font-black text-brand-navy">{SEED_TAGS.filter(t => t.profile_id === activeProfile.id).length}</div>
            <div className="text-[11px] text-fresh-green font-semibold mt-1">All tags active &amp; verified</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle">
            <div className="text-xs font-bold text-text-secondary mb-1">Emergency Contacts</div>
            <div className="text-2xl font-black text-brand-navy">{activeFamily.length}</div>
            <div className="text-[11px] text-brand-primary font-bold mt-1">Masked Relay enabled</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle">
            <div className="text-xs font-bold text-text-secondary mb-1">Incident History</div>
            <div className="text-2xl font-black text-brand-navy">{pastIncidents.length}</div>
            <div className="text-[11px] text-text-secondary font-medium mt-1">Logged and archived</div>
          </div>
        </div>

        {/* FAMILY PROFILES & NOTIFICATIONS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile & Medical Highlights */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-sm font-bold text-brand-navy">
                Profile Medical Snapshot
              </h3>
              <span className="font-mono text-xs font-bold text-brand-primary">
                {activeTag.code}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={activeProfile.photo_url}
                  alt={activeProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-navy">
                  {activeProfile.name}
                </h4>
                <div className="text-xs text-text-secondary mt-0.5">
                  Blood Group: <strong className="text-emergency-red font-bold">{activeProfile.blood_group}</strong> • {activeTag.type}
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-text-secondary space-y-1.5">
              <div><strong>Allergies:</strong> {activeProfile.allergies.join(', ') || 'None reported'}</div>
              <div><strong>Conditions:</strong> {activeProfile.conditions.join(', ') || 'None reported'}</div>
              <div><strong>Language:</strong> {activeProfile.language}</div>
            </div>
          </div>

          {/* Emergency Notifications & Camp Status Feed */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-sm font-bold text-brand-navy">
                Live Notifications &amp; Crisis Feed
              </h3>
              <span className="text-[10px] font-bold text-fresh-green bg-fresh-mint px-2 py-0.5 rounded-full">
                Auto-Synced
              </span>
            </div>

            <div className="space-y-3">
              {campRecords.filter(r => r.person_name === activeProfile.name).map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-fresh-mint/40 rounded-2xl border border-fresh-green/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-fresh-green flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" /> Rescuer Scan Update
                    </span>
                    <span className="text-[10px] font-mono text-text-secondary">{c.time_scanned}</span>
                  </div>
                  <p className="text-brand-navy font-medium">
                    Logged at <strong>{c.camp_name}</strong> as <span className="uppercase font-bold text-fresh-green">{c.status}</span>.
                  </p>
                  <p className="text-[11px] text-text-secondary italic">{c.last_update}</p>
                </div>
              ))}

              <div className="p-3 bg-brand-bg rounded-2xl border border-brand-border text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                  <span className="font-semibold text-brand-navy">All PingME Virtual Relays operational</span>
                </div>
                <span className="text-[10px] font-mono text-text-secondary">Normal</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
