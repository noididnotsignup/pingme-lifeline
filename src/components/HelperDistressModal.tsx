'use client';

import React, { useState, useEffect } from 'react';
import { SituationType } from '@/types';
import { X, MapPin, Send, AlertTriangle, Stethoscope, Compass, CheckCircle2, Loader2 } from 'lucide-react';

interface HelperDistressModalProps {
  tagId: string;
  tagCode: string;
  personName: string;
  onClose: () => void;
  onSubmit: (data: {
    situation: SituationType;
    lat: number;
    lng: number;
    locationName: string;
    note: string;
  }) => Promise<void>;
}

export function HelperDistressModal({
  tagCode,
  personName,
  onClose,
  onSubmit,
}: HelperDistressModalProps) {
  const [situation, setSituation] = useState<SituationType>('accident');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'acquiring' | 'locked' | 'fallback'>('acquiring');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.2090, // Central Delhi default
  });
  const [locationName, setLocationName] = useState('Central New Delhi (Connaught Place corridor)');

  // Quick note suggestions
  const quickNotes = [
    'Conscious & breathing',
    'Injured, waiting for 108',
    'Elderly person disoriented',
    'Lost child, safe with shopkeeper',
    'Cannot stand up',
  ];

  // Try acquiring real browser GPS coordinates
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGpsStatus('locked');
          setLocationName(`GPS Fixed (±${Math.round(pos.coords.accuracy)}m accuracy)`);
        },
        (err) => {
          console.warn('Geolocation denied or fallback used:', err);
          setGpsStatus('fallback');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setGpsStatus('fallback');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40, 30, 40]);
      }
      await onSubmit({
        situation,
        lat: coords.lat,
        lng: coords.lng,
        locationName,
        note,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const situationOptions: { type: SituationType; title: string; subtitle: string; icon: any }[] = [
    {
      type: 'accident',
      title: 'Accident',
      subtitle: 'Vehicle collision, fall or trauma',
      icon: AlertTriangle,
    },
    {
      type: 'unwell',
      title: 'Unwell',
      subtitle: 'Unconscious, seizure, chest pain',
      icon: Stethoscope,
    },
    {
      type: 'lost',
      title: 'Found Lost',
      subtitle: 'Lost child or disoriented elder',
      icon: Compass,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-brand-border max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
          <div>
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emergency-red animate-ping"></span>
              Alert {personName}&apos;s Family
            </h2>
            <p className="text-xs text-text-secondary">
              Tag: <span className="font-mono font-semibold text-brand-navy">{tagCode}</span> • Anonymous helper report
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-brand-navy rounded-full hover:bg-brand-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Situation Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              1. What is the emergency situation?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {situationOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = situation === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSituation(opt.type)}
                    className={`flex flex-col items-start p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? opt.type === 'accident'
                          ? 'border-emergency-red bg-emergency-50 text-emergency-red shadow-subtle ring-2 ring-emergency-red/20'
                          : 'border-brand-primary bg-brand-tint text-brand-dark shadow-subtle ring-2 ring-brand-primary/30'
                        : 'border-brand-border hover:border-slate-300 bg-brand-bg/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <span className="text-xs font-bold text-brand-navy leading-tight">
                      {opt.title}
                    </span>
                    <span className="text-[10px] text-text-secondary mt-1 leading-snug">
                      {opt.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Location Sharing via Geolocation API */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              2. Share Your Location (Transmitted to Family)
            </label>
            <div className="p-3 bg-brand-bg rounded-2xl border border-brand-border flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-fresh-mint text-fresh-green flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-brand-navy">
                    {locationName}
                  </span>
                  {gpsStatus === 'locked' ? (
                    <span className="text-[10px] text-fresh-green font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> GPS Acquired
                    </span>
                  ) : (
                    <span className="text-[10px] text-brand-primary font-bold">Demo GPS</span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-text-secondary mt-0.5">
                  Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Optional Helper Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              3. Add an Optional Note
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickNotes.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNote(note ? `${note}, ${q}` : q)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-brand-bg hover:bg-brand-tint text-text-main transition-colors font-medium border border-brand-border"
                >
                  + {q}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Near Metro Pillar 142, conscious, staying with them..."
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-brand-primary hover:bg-brand-dark active:scale-[0.99] text-brand-navy rounded-2xl font-black text-sm shadow-brand transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-navy" />
                  <span>Submitting Incident Alert...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Incident &amp; Notify Family</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
