'use client';

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Shield, ShieldCheck, Radio, Volume2 } from 'lucide-react';

interface MaskedCallModalProps {
  personName: string;
  onClose: () => void;
}

export function MaskedCallModal({ personName, onClose }: MaskedCallModalProps) {
  const [callState, setCallState] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 2500);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 text-center flex flex-col items-center">
        {/* Privacy Shield Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PingME Masked Voice Relay</span>
        </div>

        {/* Avatar / Calling Node */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-pingme-500/50 flex items-center justify-center shadow-lg">
            <Radio className="w-10 h-10 text-pingme-400 animate-pulse" />
          </div>
          {callState === 'connected' && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <Volume2 className="w-3.5 h-3.5 text-white" />
            </span>
          )}
        </div>

        {/* Recipient Details */}
        <h3 className="text-xl font-bold tracking-tight">
          {personName}&apos;s Family
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Masked Relay: PM-RELAY-9021
        </p>

        {/* Status & Duration */}
        <div className="mt-4 py-2 px-4 rounded-xl bg-slate-800/80 text-sm font-medium">
          {callState === 'dialing' && (
            <span className="text-amber-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Securing Masked Line...
            </span>
          )}
          {callState === 'connected' && (
            <span className="text-emerald-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Connected • {formatTime(timer)}
            </span>
          )}
          {callState === 'ended' && <span className="text-slate-400">Call Ended</span>}
        </div>

        {/* Privacy Reassurance */}
        <p className="text-[11px] text-slate-500 mt-4 leading-relaxed max-w-xs">
          Both phone numbers remain 100% private. This call is routed via PingME&apos;s encrypted virtual exchange.
        </p>

        {/* End Call Action */}
        <div className="mt-6 w-full">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emergency-600 hover:bg-emergency-700 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-emergency transition-all"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Masked Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
