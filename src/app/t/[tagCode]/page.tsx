'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Tag, Profile, Incident, SituationType } from '@/types';
import {
  getTagByCode,
  getProfileById,
  getActiveIncidentForTag,
  createIncident,
  subscribeToIncidentUpdates,
} from '@/lib/data-store';
import { MedicalStamp } from '@/components/MedicalStamp';
import { EmergencyActionBar } from '@/components/EmergencyActionBar';
import { HelperDistressModal } from '@/components/HelperDistressModal';
import { HelperLiveStatus } from '@/components/HelperLiveStatus';
import { EmergencyMap } from '@/components/EmergencyMap';
import { NearbyHospitals } from '@/components/NearbyHospitals';
import { HeartPulse, AlertCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

export default function TagScanPage() {
  const params = useParams();
  const rawCode = (params?.tagCode as string) || '';
  const tagCode = decodeURIComponent(rawCode).toUpperCase().trim();

  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState<Tag | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [showDistressModal, setShowDistressModal] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function loadData() {
      setLoading(true);
      try {
        const foundTag = await getTagByCode(tagCode);
        if (foundTag) {
          setTag(foundTag);
          const foundProfile = await getProfileById(foundTag.profile_id);
          setProfile(foundProfile);

          // Check if an incident is active
          const currentIncident = await getActiveIncidentForTag(foundTag.id);
          if (currentIncident && currentIncident.status !== 'resolved') {
            setActiveIncident(currentIncident);

            // Subscribe to live status changes (e.g. Family acknowledging with ETA)
            unsubscribe = subscribeToIncidentUpdates(currentIncident.id, (updated) => {
              setActiveIncident(updated);
            });
          }
        }
      } finally {
        setLoading(false);
      }
    }

    if (tagCode) {
      loadData();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [tagCode]);

  const handleCreateIncident = async (data: {
    situation: SituationType;
    lat: number;
    lng: number;
    locationName: string;
    note: string;
  }) => {
    if (!tag) return;

    const newInc = await createIncident({
      tagId: tag.id,
      situation: data.situation,
      lat: data.lat,
      lng: data.lng,
      locationName: data.locationName,
      note: data.note,
    });

    setActiveIncident(newInc);
    setShowDistressModal(false);

    subscribeToIncidentUpdates(newInc.id, (updated) => {
      setActiveIncident(updated);
    });
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-3" />
        <h2 className="text-base font-bold text-brand-navy">Reading PingME Lifeline Tag...</h2>
        <p className="text-xs text-text-secondary font-mono mt-1">{tagCode}</p>
      </div>
    );
  }

  if (!tag || !profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-warning-50 text-warning-amber flex items-center justify-center mx-auto mb-4 border border-warning-amber/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-brand-navy mb-2">Tag Not Found</h1>
        <p className="text-xs text-text-secondary mb-6">
          No registered PingME Lifeline profile is linked to code <strong className="font-mono text-brand-navy">{tagCode}</strong>.
        </p>
        <div className="p-4 bg-white rounded-2xl border border-surface-border mb-6 text-left shadow-card">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
            Try a Test Demo Tag:
          </span>
          <div className="flex flex-col gap-2">
            <Link href="/t/LIFE-9021" className="text-xs font-mono font-bold text-emergency-red hover:underline">
              → LIFE-9021 (Rohan Sharma • Vehicle Tag)
            </Link>
            <Link href="/t/LIFE-4412" className="text-xs font-mono font-bold text-warning-amber hover:underline">
              → LIFE-4412 (Sunita Verma • Wristband)
            </Link>
            <Link href="/t/LIFE-7703" className="text-xs font-mono font-bold text-brand-primary hover:underline">
              → LIFE-7703 (Aarav Patel • ID Card)
            </Link>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-16">
      {/* Top Mobile Emergency Header */}
      <div className="bg-white border-b border-surface-border py-3 px-4 shadow-subtle sticky top-0 z-30">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emergency-red text-white flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-brand-navy tracking-tight">PingME Lifeline</div>
              <div className="text-[10px] text-text-secondary">Emergency Medical Card</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-fresh-green bg-fresh-mint px-2 py-0.5 rounded-full border border-fresh-green/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Public Scan Mode</span>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-5 space-y-5">
        {/* Active Incident Live Status if helper has reported */}
        {activeIncident && (
          <HelperLiveStatus
            incident={activeIncident}
            personName={profile.name}
          />
        )}

        {/* Main Medical Card (The Scan Screen) */}
        <MedicalStamp profile={profile} tag={tag} />

        {/* Emergency Action Buttons: Call 108 & "I'm with them" */}
        <EmergencyActionBar
          onImWithThem={() => setShowDistressModal(true)}
          hasActiveIncident={Boolean(activeIncident)}
        />

        {/* If incident is active, show the live map & nearby hospitals */}
        {activeIncident && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Incident Location Coordinates
                </h3>
                <span className="text-[10px] font-mono text-fresh-green font-semibold">
                  Live GPS
                </span>
              </div>
              <EmergencyMap
                lat={activeIncident.lat}
                lng={activeIncident.lng}
                personName={profile.name}
                situation={activeIncident.situation}
              />
            </div>

            <NearbyHospitals
              lat={activeIncident.lat}
              lng={activeIncident.lng}
            />
          </div>
        )}

        {/* Helper Distress Modal */}
        {showDistressModal && (
          <HelperDistressModal
            tagId={tag.id}
            tagCode={tag.code}
            personName={profile.name}
            onClose={() => setShowDistressModal(false)}
            onSubmit={handleCreateIncident}
          />
        )}
      </div>
    </div>
  );
}
