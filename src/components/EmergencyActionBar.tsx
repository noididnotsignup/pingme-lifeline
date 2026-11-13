'use client';

import React from 'react';
import { PhoneCall, HeartPulse, AlertCircle, HeartHandshake } from 'lucide-react';

interface EmergencyActionBarProps {
  onImWithThem: () => void;
  hasActiveIncident?: boolean;
}

export function EmergencyActionBar({ onImWithThem, hasActiveIncident = false }: EmergencyActionBarProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
      {/* Large Red "Call 108" Button */}
      <a
        href="tel:108"
        className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-emergency-red hover:bg-emergency-600 active:scale-[0.98] text-white rounded-2xl font-bold text-base sm:text-lg shadow-emergency transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <PhoneCall className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="leading-tight">Call 108 Ambulance</span>
          <span className="text-[11px] font-normal text-white/90">Direct National Emergency Dispatch</span>
        </div>
      </a>

      {/* Large Yellow "I'm with them" Button (PingME Brand Color) */}
      <button
        onClick={onImWithThem}
        className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-base sm:text-lg shadow-brand active:scale-[0.98] transition-all group ${
          hasActiveIncident
            ? 'bg-brand-navy hover:bg-black text-white'
            : 'bg-brand-primary hover:bg-brand-dark text-brand-navy'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {hasActiveIncident ? (
            <AlertCircle className="w-5 h-5 text-white" />
          ) : (
            <HeartHandshake className="w-5 h-5 text-brand-navy" />
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="leading-tight">{hasActiveIncident ? 'Update Situation' : "I'm with them"}</span>
          <span className="text-[11px] font-semibold opacity-90">
            {hasActiveIncident ? 'Add helper notes or location' : 'Share GPS location & alert family'}
          </span>
        </div>
      </button>
    </div>
  );
}
