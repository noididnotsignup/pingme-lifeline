'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Profile, Tag, TagType, BloodGroup } from '@/types';
import {
  getLocalProfiles,
  getLocalTags,
  updateProfile,
  toggleTagActive,
  addTag,
  SEED_PROFILES,
} from '@/lib/data-store';
import {
  User,
  QrCode,
  ShieldCheck,
  Plus,
  Download,
  Eye,
  Check,
  Lock,
} from 'lucide-react';
import { QrGeneratorModal } from '@/components/QrGeneratorModal';

export default function OwnerProfilePage() {
  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(SEED_PROFILES[0].id);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagForQr, setActiveTagForQr] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const activeProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];
  const [name, setName] = useState(activeProfile.name);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(activeProfile.blood_group);
  const [allergiesText, setAllergiesText] = useState(activeProfile.allergies.join(', '));
  const [conditionsText, setConditionsText] = useState(activeProfile.conditions.join(', '));
  const [language, setLanguage] = useState(activeProfile.language);
  const [emergencyNotes, setEmergencyNotes] = useState(activeProfile.emergency_notes || '');

  // Add tag modal state
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagCode, setNewTagCode] = useState('');
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagType, setNewTagType] = useState<TagType>('vehicle');

  useEffect(() => {
    const loadedProfiles = getLocalProfiles();
    setProfiles(loadedProfiles);
    const loadedTags = getLocalTags();
    setTags(loadedTags);
  }, []);

  useEffect(() => {
    setName(activeProfile.name);
    setBloodGroup(activeProfile.blood_group);
    setAllergiesText(activeProfile.allergies.join(', '));
    setConditionsText(activeProfile.conditions.join(', '));
    setLanguage(activeProfile.language);
    setEmergencyNotes(activeProfile.emergency_notes || '');
  }, [selectedProfileId]);

  const profileTags = tags.filter((t) => t.profile_id === activeProfile.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Profile = {
      ...activeProfile,
      name,
      blood_group: bloodGroup,
      allergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean),
      conditions: conditionsText.split(',').map((s) => s.trim()).filter(Boolean),
      language,
      emergency_notes: emergencyNotes,
    };
    updateProfile(updated);
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleTag = async (tagId: string) => {
    const updated = await toggleTagActive(tagId);
    if (updated) {
      setTags((prev) => prev.map((t) => (t.id === tagId ? updated : t)));
    }
  };

  const handleCreateNewTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagCode) return;
    const code = newTagCode.toUpperCase().trim();
    const tag = await addTag({
      code,
      profile_id: activeProfile.id,
      type: newTagType,
      label: newTagLabel || `${newTagType.toUpperCase()} Tag`,
      active: true,
    });
    setTags((prev) => [...prev, tag]);
    setShowAddTag(false);
    setNewTagCode('');
    setNewTagLabel('');
  };

  const handleDownloadQr = (code: string) => {
    const canvas = document.createElement('canvas');
    const url = typeof window !== 'undefined' ? `${window.location.origin}/t/${code}` : `https://pingme-lifeline.vercel.app/t/${code}`;
    QRCode.toCanvas(canvas, url, { width: 400, margin: 2 }, (err) => {
      if (!err) {
        const link = document.createElement('a');
        link.download = `PingME-Tag-${code}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                PingME Owner Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Emergency Profile &amp; QR Tag Management
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure your public emergency medical card and generate waterproof PingME QR tags.
            </p>
          </div>

          {/* Profile Switcher */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-brand-border shadow-subtle">
            <span className="text-xs font-semibold text-text-secondary px-2">Profile:</span>
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProfileId === p.id
                    ? 'bg-brand-primary text-brand-navy shadow-brand'
                    : 'text-text-main hover:bg-brand-tint'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Public vs Private Privacy Explainer */}
        <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-card grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fresh-green font-bold text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Visible to Anyone Scanning Tag (Public Helper)</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Full name, photograph, Blood Group badge, declared allergies, medical conditions, spoken language, and the 108 Emergency Ambulance Call button.
            </p>
          </div>

          <div className="space-y-2 md:border-l md:border-brand-border md:pl-6">
            <div className="flex items-center gap-2 text-brand-dark font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-brand-primary" />
              <span>Kept Strictly Private (Masked / Authenticated)</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Family telephone numbers (always masked via PingME virtual relay), full clinical prescriptions (requires Doctor PIN), and home address.
            </p>
          </div>
        </div>

        {/* Main 2-Column Section: Profile Form & Linked Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Edit Profile Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-card border border-brand-border">
            <h3 className="text-base font-bold text-brand-navy mb-4 pb-3 border-b border-brand-border flex items-center justify-between">
              <span>Edit Emergency Information</span>
              {saveSuccess && (
                <span className="text-xs font-bold text-fresh-green flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-navy font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-black text-emergency-red focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">Spoken Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. English, Hindi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  Known Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  Existing Medical Conditions (comma-separated)
                </label>
                <input
                  type="text"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  placeholder="e.g. Asthma, Type 2 Diabetes, Epilepsy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  Emergency Notes for Helper
                </label>
                <textarea
                  value={emergencyNotes}
                  onChange={(e) => setEmergencyNotes(e.target.value)}
                  placeholder="e.g. Inhaler in front bag pocket. Please keep upright."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-dark text-brand-navy font-black text-xs rounded-xl shadow-brand transition-all"
                >
                  Save Emergency Profile
                </button>
              </div>
            </form>
          </div>

          {/* Manage Multiple PingME Tags (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Active QR Tags</h3>
                  <p className="text-[11px] text-text-secondary">Manage physical devices</p>
                </div>
                <button
                  onClick={() => setShowAddTag(!showAddTag)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-brand-tint text-brand-dark hover:bg-brand-primary hover:text-brand-navy rounded-xl text-xs font-bold transition-all border border-brand-primary/40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>

              {/* Add Tag Sub-drawer */}
              {showAddTag && (
                <form onSubmit={handleCreateNewTag} className="p-4 bg-brand-bg rounded-2xl border border-brand-border mb-4 space-y-3">
                  <div className="text-xs font-bold text-brand-navy">Register New PingME Tag</div>
                  <div>
                    <input
                      type="text"
                      placeholder="Tag Code (e.g. LIFE-5521)"
                      value={newTagCode}
                      onChange={(e) => setNewTagCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs font-mono font-bold uppercase"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Placement Label (e.g. Helmet / Car Tag)"
                      value={newTagLabel}
                      onChange={(e) => setNewTagLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={newTagType}
                      onChange={(e) => setNewTagType(e.target.value as TagType)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs bg-white"
                    >
                      <option value="vehicle">Vehicle (Helmet / Car)</option>
                      <option value="wristband">Wristband (Medical / Senior)</option>
                      <option value="id_card">ID Card (Backpack / Child)</option>
                      <option value="wallet">Wallet Card</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-brand-primary text-brand-navy text-xs font-bold rounded-xl"
                    >
                      Save Tag
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTag(false)}
                      className="px-3 py-2 bg-slate-200 text-text-secondary text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Tag List */}
              <div className="space-y-3">
                {profileTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="p-3.5 rounded-2xl border border-brand-border bg-white flex items-center justify-between gap-3 shadow-subtle hover:border-brand-primary/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-navy">
                          {tag.code}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          tag.active ? 'bg-brand-tint text-brand-dark' : 'bg-slate-100 text-text-secondary'
                        }`}>
                          {tag.active ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-secondary mt-0.5">
                        {tag.label || tag.type}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setActiveTagForQr(tag.code);
                          setShowQrModal(true);
                        }}
                        className="p-2 bg-brand-bg hover:bg-brand-tint text-brand-navy rounded-xl text-xs"
                        title="Preview QR Code"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDownloadQr(tag.code)}
                        className="p-2 bg-brand-bg hover:bg-brand-tint text-brand-navy rounded-xl text-xs"
                        title="Download Printable High-Res QR"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleTag(tag.id)}
                        className={`px-2.5 py-1.5 text-[10px] font-bold rounded-xl border transition-colors ${
                          tag.active
                            ? 'bg-slate-50 text-text-secondary border-brand-border hover:bg-slate-100'
                            : 'bg-brand-primary text-brand-navy border-brand-primary font-bold'
                        }`}
                      >
                        {tag.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQrModal && (
        <QrGeneratorModal
          initialCode={activeTagForQr || 'LIFE-9021'}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}
