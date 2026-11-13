'use client';

import React, { useState, useEffect } from 'react';
import { Incident, Profile } from '@/types';
import { AlertCircle, Clock, CheckCircle2, Navigation, BellRing, PhoneForwarded, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { MaskedCallModal } from './MaskedCallModal';

interface FamilyAlertBannerProps {
  incident: Incident;
  profile: Profile;
  onUpdateStatus: (incidentId: string, status: 'acknowledged' | 'resolved', etaMinutes?: number) => Promise<void>;
}

export function FamilyAlertBanner({ incident, profile, onUpdateStatus }: FamilyAlertBannerProps) {
  const [selectedEta, setSelectedEta] = useState<number>(incident.family_eta_minutes || 12);
  const [customEta, setCustomEta] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMaskedCall, setShowMaskedCall] = useState(false);

  // Synthesize gentle emergency pulse tone with Web Audio API
  useEffect(() => {
    if (incident.status === 'open' && soundEnabled && typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch {
        // Audio policy ignore
      }
    }
  }, [incident.id, incident.status, soundEnabled]);

  const handleOnMyWay = async () => {
    setIsUpdating(true);
    try {
      const eta = customEta ? parseInt(customEta, 10) : selectedEta;
      await onUpdateStatus(incident.id, 'acknowledged', eta || 12);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResolve = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(incident.id, 'resolved');
    } finally {
      setIsUpdating(false);
    }
  };

  const getSituationBadge = (situation: string) => {
    switch (situation) {
      case 'accident':
        return { label: 'Accident Reported', color: 'bg-emergency-600 text-white' };
      case 'unwell':
        return { label: 'Medical Emergency', color: 'bg-amber-600 text-white' };
      case 'lost':
        return { label: 'Person Found / Lost', color: 'bg-pingme-600 text-white' };
      default:
        return { label: 'Incident Alert', color: 'bg-slate-700 text-white' };
    }
  };

  const badge = getSituationBadge(incident.situation);
  const isAcknowledged = incident.status === 'acknowledged';
  const isResolved = incident.status === 'resolved';

  return (
    <>
      <div className={`w-full rounded-3xl p-5 sm:p-6 shadow-xl border-2 transition-all ${
        isResolved
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/40'
          : isAcknowledged
          ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-500/40'
          : 'bg-emergency-50/90 dark:bg-emergency-950/30 border-emergency-500 shadow-emergency animate-pulse-beacon'
      }`}>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${badge.color}`}>
              {badge.label}
            </span>
            <span className="text-xs font-mono font-medium text-slate-500">
              {new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emergency-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Incident Summary */}
        <div className="mt-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Emergency Alert for {profile.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            A bystander scanned {profile.name}&apos;s tag and triggered this alert.
          </p>

          {incident.note && (
            <div className="mt-3 p-3 bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
              <strong className="text-emergency-600 dark:text-emergency-400">Helper Observation:</strong> &ldquo;{incident.note}&rdquo;
            </div>
          )}
        </div>

        {/* Live Status State Banner */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-700/80">
          {!isAcknowledged && !isResolved ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Select your arrival ETA:
                </span>
                <span className="text-xs font-bold text-emergency-600 dark:text-emergency-400">
                  Helper will see your ETA live
                </span>
              </div>

              {/* ETA Presets */}
              <div className="flex flex-wrap gap-2">
                {[5, 10, 12, 15, 25, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setSelectedEta(mins);
                      setCustomEta('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedEta === mins && !customEta
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={handleOnMyWay}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-emergency-600 hover:bg-emergency-700 active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-emergency transition-all disabled:opacity-60"
                >
                  <Navigation className="w-4 h-4" />
                  <span>On My Way ({customEta ? `${customEta}m` : `${selectedEta}m`})</span>
                </button>
                <button
                  onClick={() => setShowMaskedCall(true)}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <PhoneForwarded className="w-4 h-4 text-pingme-600" />
                  <span>Call Helper via Masked Relay</span>
                </button>
              </div>
            </div>
          ) : isAcknowledged ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-900 dark:text-sky-200">
                    You responded: On Your Way
                  </div>
                  <div className="text-xs text-sky-700 dark:text-sky-300">
                    Helper notified • Estimated arrival: <strong>{incident.family_eta_minutes ?? 12} mins</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMaskedCall(true)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                >
                  <PhoneForwarded className="w-3.5 h-3.5 inline mr-1 text-pingme-600" />
                  Call Helper
                </button>
                <button
                  onClick={handleResolve}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                  Mark Arrived / Resolved
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Incident marked resolved. The person is safe.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showMaskedCall && (
        <MaskedCallModal
          personName="Helper at Scene"
          onClose={() => setShowMaskedCall(false)}
        />
      )}
    </>
  );
}
