'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Users,
  Compass,
  Lock,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HeartPulse,
} from 'lucide-react';

interface Scene {
  start: number;
  end: number;
  title: string;
  feature: string;
  badgeColor: string;
  voiceover: string;
  visualType: 'incident' | 'scan' | 'distress' | 'family' | 'crisis' | 'pass';
}

const SCENES: Scene[] = [
  {
    start: 0,
    end: 25,
    title: 'Scene 1: The Problem (Intersection Accident)',
    feature: 'The Golden Hour Dilemma',
    badgeColor: 'bg-emergency-50 text-emergency-red border-emergency-red/30',
    voiceover:
      '8:15 AM. A busy intersection. Rohan\'s motorcycle skids. He is dazed on the pavement. His phone is locked with a PIN. A bystander, Pooja, rushes to help—she wants to call his family, but there is no safe way to know who he is, what his medical allergies are, or whom to alert.',
    visualType: 'incident',
  },
  {
    start: 25,
    end: 50,
    title: 'Scene 2: The Instant PingME Scan',
    feature: 'Public Scan (Zero-Login, No App)',
    badgeColor: 'bg-brand-tint text-brand-dark border-brand-primary/40',
    voiceover:
      'Pooja spots the PingME QR tag on his helmet. She pulls out her smartphone camera. No app download. No login. In under 400 milliseconds, Rohan\'s emergency card appears: Blood group O-positive, Penicillin allergy, and an asthma caution. Zero personal phone numbers are shown.',
    visualType: 'scan',
  },
  {
    start: 50,
    end: 75,
    title: 'Scene 3: Bystander Action & Location Lock',
    feature: '108 Ambulance Link & Geolocation API',
    badgeColor: 'bg-fresh-mint text-fresh-green border-fresh-green/30',
    voiceover:
      'She taps "Call 108 Ambulance", then taps "I\'m with them". Selecting "Accident", the browser\'s Geolocation API captures exact GPS coordinates without manual typing. Tapping "Submit Incident" broadcasts an encrypted distress beacon to Rohan\'s family.',
    visualType: 'distress',
  },
  {
    start: 75,
    end: 98,
    title: 'Scene 4: Family Real-Time Alert & Response',
    feature: 'Supabase Realtime & Overpass API',
    badgeColor: 'bg-brand-tint text-brand-dark border-brand-primary/40',
    voiceover:
      'Miles away, Rohan\'s spouse Priya hears an audible alert chime on her laptop. The Family Dashboard reveals a live OpenStreetMap pin, helper notes, and 3 nearest trauma hospitals queried via the Overpass API. Priya selects ETA 12 minutes and taps "On My Way".',
    visualType: 'family',
  },
  {
    start: 98,
    end: 110,
    title: 'Scene 5: Crisis Mode & Paramedic Unlock',
    feature: 'Shelter Bulk Scan & Doctor Auth Code',
    badgeColor: 'bg-fresh-mint text-fresh-green border-fresh-green/30',
    voiceover:
      'The same tag adapts everywhere. In relief camps, verified rescuers bulk-triage displaced victims as Safe, Injured, or Admitted. At the hospital, authorized trauma doctors enter authorization code HOSP-1234 to unlock confidential surgical records.',
    visualType: 'crisis',
  },
  {
    start: 110,
    end: 120,
    title: 'Scene 6: PingME Pass & The Lifeline Promise',
    feature: 'Everyday Privacy & Conclusion',
    badgeColor: 'bg-brand-tint text-brand-dark border-brand-primary/40',
    voiceover:
      'And with PingME Pass, people carry their QR code every day at coffee shops and malls for masked checkout. One QR tag for everyday privacy. A life-saving lifeline when it matters most. PingME Lifeline: A QR that speaks for you when you can\'t.',
    visualType: 'pass',
  },
];

export default function DemoVideoPlayerPage() {
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play audio tone on key moments
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {}
  };

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s >= 120) {
            setIsPlaying(false);
            return 0;
          }
          if (s === 74) {
            playChime();
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, soundEnabled]);

  const activeScene = SCENES.find((sc) => seconds >= sc.start && seconds < sc.end) || SCENES[SCENES.length - 1];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                PingME Hackathon • 2-Minute Story Demo Video
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Interactive Demo Video Walkthrough
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/t/LIFE-9021"
              className="px-3 py-1.5 bg-white hover:bg-brand-tint text-brand-navy text-xs font-bold rounded-xl border border-brand-border transition-all"
            >
              Live Scan Page
            </Link>
            <Link
              href="/family/dashboard"
              className="px-3 py-1.5 bg-brand-primary hover:bg-brand-dark text-brand-navy text-xs font-black rounded-xl shadow-brand transition-all"
            >
              Live Family Hub
            </Link>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-border space-y-5">
          {/* Top Player Metadata Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${activeScene.badgeColor}`}>
              {activeScene.title}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 text-text-secondary hover:text-brand-navy rounded-lg hover:bg-brand-bg transition-colors"
                title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-primary" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <span className="font-mono text-xs font-bold px-3 py-1 bg-brand-bg rounded-lg text-brand-navy border border-brand-border">
                {formatTime(seconds)} / 02:00
              </span>
            </div>
          </div>

          {/* Visual Presentation Frame */}
          <div className="relative w-full min-h-[300px] bg-brand-bg rounded-2xl p-6 border border-brand-border flex flex-col justify-center items-center text-center transition-all duration-300">
            {activeScene.visualType === 'incident' && (
              <div className="space-y-3 max-w-md animate-in fade-in">
                <div className="w-16 h-16 rounded-3xl bg-emergency-50 border border-emergency-red/30 text-emergency-red flex items-center justify-center mx-auto text-3xl shadow-sm">
                  🚨
                </div>
                <h3 className="text-lg font-black text-brand-navy">The Golden Hour Communication Breakdown</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Rohan is dazed on the pavement. Locked smartphone in jacket. Bystander wants to notify family but fears phone number privacy or making an invasive call.
                </p>
              </div>
            )}

            {activeScene.visualType === 'scan' && (
              <div className="w-full max-w-sm bg-white p-4 rounded-2xl border border-brand-border shadow-sm text-left space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                  <span className="text-xs font-black text-brand-navy">PingME Lifeline Scan</span>
                  <span className="text-[10px] font-bold text-fresh-green bg-fresh-mint px-2 py-0.5 rounded-full">
                    400ms Read
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-brand-navy">Rohan Sharma (24)</div>
                    <div className="text-[11px] text-text-secondary">Asthma • Penicillin Allergy</div>
                  </div>
                  <div className="w-12 h-14 bg-emergency-red text-white rounded-xl flex flex-col items-center justify-center font-black">
                    <span className="text-[8px] uppercase">Blood</span>
                    <span className="text-lg">O+</span>
                  </div>
                </div>
                <div className="text-[10px] text-text-secondary pt-1 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Zero phone numbers visible on stranger&apos;s phone</span>
                </div>
              </div>
            )}

            {activeScene.visualType === 'distress' && (
              <div className="w-full max-w-sm bg-white p-4 rounded-2xl border border-brand-border shadow-sm text-left space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-navy">108 Link &amp; Bystander Report</span>
                  <span className="text-[10px] font-mono text-fresh-green font-bold">GPS Locked</span>
                </div>
                <div className="p-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-text-secondary space-y-1">
                  <div>📍 <strong>Location:</strong> Connaught Place Outer Circle, New Delhi</div>
                  <div>🚨 <strong>Situation:</strong> Road Accident / Collision</div>
                  <div className="italic text-[#D6880D]">&ldquo;Conscious, road skid, staying with him.&rdquo;</div>
                </div>
                <div className="py-2 bg-brand-tint text-brand-dark text-xs font-black rounded-xl text-center">
                  Reference ID #INC-4821 Transmitted
                </div>
              </div>
            )}

            {activeScene.visualType === 'family' && (
              <div className="w-full max-w-sm bg-white p-4 rounded-2xl border-2 border-brand-primary shadow-sm text-left space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-brand-navy">Family Real-Time Dashboard</span>
                  <span className="text-[10px] bg-red-100 text-emergency-red font-bold px-2 py-0.5 rounded animate-pulse">
                    LIVE ALERT
                  </span>
                </div>
                <div className="text-xs text-text-secondary">
                  OpenStreetMap Pin Active • Nearest Hospital: <strong>Apex Trauma Center (1.4 km)</strong>
                </div>
                <div className="pt-2 flex gap-2">
                  <div className="flex-1 py-2 bg-brand-navy text-white text-xs font-bold rounded-xl text-center">
                    ETA 12 Min Sent
                  </div>
                  <div className="px-3 py-2 bg-brand-tint text-brand-dark text-xs font-bold rounded-xl text-center border border-brand-primary/40">
                    Masked Call
                  </div>
                </div>
              </div>
            )}

            {activeScene.visualType === 'crisis' && (
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-left animate-in fade-in">
                <div className="p-3 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-1">
                  <div className="text-[10px] font-bold text-fresh-green uppercase">Crisis Camp Triage</div>
                  <div className="text-xs font-black text-brand-navy">Camp A Ledger</div>
                  <div className="text-[10px] text-text-secondary">Bulk-scan: Safe / Injured / Admitted</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-1">
                  <div className="text-[10px] font-bold text-[#D6880D] uppercase">Doctor Auth Unlock</div>
                  <div className="text-xs font-mono font-bold text-brand-navy">PIN: HOSP-1234</div>
                  <div className="text-[10px] text-text-secondary">Full clinical prescription unlocked</div>
                </div>
              </div>
            )}

            {activeScene.visualType === 'pass' && (
              <div className="space-y-2 max-w-md animate-in fade-in">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-tint text-brand-dark text-xs font-black border border-brand-primary/30">
                  <CreditCard className="w-3.5 h-3.5 text-brand-primary" />
                  <span>PingME Pass Token #PM-4821</span>
                </div>
                <h3 className="text-base font-black text-brand-navy">&ldquo;A QR that speaks for you when you can&apos;t.&rdquo;</h3>
                <p className="text-xs text-text-secondary">
                  Everyday convenience at coffee shops ensures the lifeline is always with you during emergencies.
                </p>
              </div>
            )}
          </div>

          {/* Voiceover Captions Display */}
          <div className="p-4 bg-brand-navy text-white rounded-2xl shadow-sm text-center space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-brand-primary font-black">
              Story Voiceover Narration
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              &ldquo;{activeScene.voiceover}&rdquo;
            </p>
          </div>

          {/* Progress Timeline Scrubber */}
          <div className="space-y-1.5">
            <div
              className="w-full h-2.5 bg-brand-border rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setSeconds(Math.floor(pos * 120));
              }}
            >
              <div
                className="h-full bg-brand-primary transition-all duration-200"
                style={{ width: `${(seconds / 120) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-text-secondary">
              <span>0:00 (Incident)</span>
              <span>0:25 (QR Scan)</span>
              <span>0:50 (GPS Alert)</span>
              <span>1:15 (Family Hub)</span>
              <span>1:40 (Crisis)</span>
              <span>2:00</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-primary hover:bg-brand-dark text-brand-navy rounded-xl text-xs font-black shadow-brand transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Story Demo'}</span>
              </button>

              <button
                onClick={() => {
                  setSeconds(0);
                  setIsPlaying(false);
                }}
                className="p-2.5 bg-brand-bg hover:bg-brand-tint text-brand-navy rounded-xl border border-brand-border transition-colors"
                title="Restart demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Scene Buttons */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold">
              {SCENES.map((sc, i) => (
                <button
                  key={sc.start}
                  onClick={() => setSeconds(sc.start)}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    seconds >= sc.start && seconds < sc.end
                      ? 'bg-brand-navy text-white'
                      : 'text-text-secondary hover:bg-brand-tint'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Script & Submission Note */}
        <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-subtle text-xs text-text-secondary space-y-2">
          <div className="font-bold text-brand-navy flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-fresh-green" />
            <span>Hackathon Submission Deliverable 3 Verified</span>
          </div>
          <p className="leading-relaxed">
            The full second-by-second narration script, camera directions, and production checklist have been committed to <strong className="text-brand-navy">DEMO_VIDEO_SCRIPT.md</strong> in your project root.
          </p>
        </div>
      </div>
    </div>
  );
}
