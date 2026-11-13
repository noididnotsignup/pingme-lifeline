'use client';

import React, { useState } from 'react';
import { Incident } from '@/types';
import { HeartPulse, Clock, CheckCircle2, ShieldCheck, PhoneForwarded, Info } from 'lucide-react';
import { MaskedCallModal } from './MaskedCallModal';

interface HelperLiveStatusProps {
  incident: Incident;
  personName: string;
}

export function HelperLiveStatus({ incident, personName }: HelperLiveStatusProps) {
  const [showMaskedCall, setShowMaskedCall] = useState(false);

  const isAcknowledged = incident.status === 'acknowledged';
  const isResolved = incident.status === 'resolved';

  return (
    <>
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-card border-2 border-brand-primary/40">
        {/* Top Confirmation & Reference ID */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fresh-green animate-pulse"></span>
            <span className="text-xs font-bold text-fresh-green">Family Has Been Notified</span>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-brand-tint text-brand-dark border border-brand-primary/30">
            Ref: {incident.id}
          </span>
        </div>

        {/* Dynamic Status Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isResolved
                ? 'bg-fresh-mint text-fresh-green'
                : isAcknowledged
                ? 'bg-brand-tint text-brand-dark'
                : 'bg-emergency-50 text-emergency-red'
            }`}>
              <HeartPulse className={`w-6 h-6 ${isResolved ? '' : 'animate-heartbeat'}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isResolved
                    ? 'bg-fresh-mint text-fresh-green'
                    : isAcknowledged
                    ? 'bg-brand-tint text-brand-dark border border-brand-primary/30'
                    : 'bg-emergency-50 text-emergency-red border border-emergency-red/20'
                }`}>
                  {isResolved ? 'Resolved' : isAcknowledged ? 'Family Responded' : 'Incident Open'}
                </span>
                <span className="text-xs text-text-secondary">Current Status</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy mt-1">
                {isResolved
                  ? 'Help has arrived at the scene'
                  : isAcknowledged
                  ? `Family is coming. Estimated arrival: ${incident.family_eta_minutes ?? 12} minutes.`
                  : `Waiting for ${personName}'s family to acknowledge...`}
              </h3>
            </div>
          </div>
        </div>

        {/* Live Stepper */}
        <div className="grid grid-cols-3 gap-2 my-5">
          {/* Step 1: Alert Created */}
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-fresh-mint/50 border border-fresh-green/30">
            <CheckCircle2 className="w-5 h-5 text-fresh-green mb-1" />
            <span className="text-xs font-bold text-brand-navy">Alert Sent</span>
            <span className="text-[10px] text-text-secondary">GPS Locked</span>
          </div>

          {/* Step 2: Family Acknowledged */}
          <div className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
            isAcknowledged || isResolved
              ? 'bg-brand-tint/60 border-brand-primary/40'
              : 'bg-slate-50 border-brand-border opacity-50'
          }`}>
            <Clock className={`w-5 h-5 mb-1 ${isAcknowledged || isResolved ? 'text-brand-dark' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-brand-navy">Acknowledged</span>
            <span className="text-[10px] text-text-secondary font-semibold">
              {incident.family_eta_minutes ? `ETA ${incident.family_eta_minutes}m` : 'En Route'}
            </span>
          </div>

          {/* Step 3: Resolved */}
          <div className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
            isResolved
              ? 'bg-fresh-mint border-fresh-green/30'
              : 'bg-slate-50 border-brand-border opacity-50'
          }`}>
            <ShieldCheck className={`w-5 h-5 mb-1 ${isResolved ? 'text-fresh-green' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-brand-navy">Resolved</span>
            <span className="text-[10px] text-text-secondary">Arrived</span>
          </div>
        </div>

        {/* Contact Family via Masked Relay */}
        <div className="pt-1">
          <button
            onClick={() => setShowMaskedCall(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-navy hover:bg-black text-white font-bold text-xs sm:text-sm shadow-subtle transition-all"
          >
            <PhoneForwarded className="w-4 h-4 text-brand-primary" />
            <span>Connect to Family via PingME Relay</span>
          </button>
        </div>

        {/* Bystander Guidance */}
        <div className="mt-4 p-3.5 rounded-2xl bg-brand-bg border border-brand-border flex items-start gap-2.5 text-xs text-text-secondary">
          <Info className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-brand-navy">First-aid guidance:</strong> Keep the person comfortable. Do not give water or food if they are drowsy or unconscious. If their condition deteriorates, tap <strong>Call 108</strong> immediately.
          </div>
        </div>
      </div>

      {showMaskedCall && (
        <MaskedCallModal
          personName={personName}
          onClose={() => setShowMaskedCall(false)}
        />
      )}
    </>
  );
}
