'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  ShieldCheck,
  Compass,
  Lock,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  PhoneCall,
  Activity,
  AlertTriangle,
  Building2,
  Sparkles,
} from 'lucide-react';
import { QrGeneratorModal } from '@/components/QrGeneratorModal';

export default function LandingPage() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedDemoCode, setSelectedDemoCode] = useState('LIFE-9021');

  return (
    <div className="min-h-screen bg-brand-bg text-text-main flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-brand-border">
        {/* Soft golden ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-tint/70 to-transparent pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint border border-brand-primary/40 text-xs font-black text-brand-dark">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
                <span>Team The Callback • PingME Super App Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-[1.15]">
                A QR That Speaks for You <br className="hidden sm:inline" />
                <span className="text-brand-primary">When You Can&apos;t.</span>
              </h1>

              <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                One simple scan connects you to the people who matter, shares essential emergency information and helps your family respond when every second counts.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/owner/profile"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 bg-brand-primary hover:bg-brand-dark text-brand-navy rounded-2xl font-black text-base shadow-brand transition-all active:scale-[0.98]"
                >
                  <span>Create Your Emergency Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => {
                    setSelectedDemoCode('LIFE-9021');
                    setShowQrModal(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-brand-tint text-brand-navy border border-brand-border rounded-2xl font-bold text-base shadow-subtle transition-all"
                >
                  <Smartphone className="w-4 h-4 text-brand-primary" />
                  <span>Scan Demo Tag</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" /> Zero phone number exposure
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" /> No app required to scan
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" /> Instant 108 ambulance link
                </span>
              </div>
            </div>

            {/* Right Hero Graphic: Realistic Smartphone Emergency Profile */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px]">
                {/* Physical Tag Decorator */}
                <div className="absolute -top-6 -left-6 z-20 bg-white p-3 rounded-2xl shadow-elevated border border-brand-border flex items-center gap-2.5 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-brand-navy flex items-center justify-center font-mono text-xs font-black shadow-sm">
                    QR
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-brand-navy">PingME Helmet Tag</div>
                    <div className="text-[9px] font-mono text-text-secondary">ID: LIFE-9021</div>
                  </div>
                </div>

                {/* Smartphone Mockup Frame */}
                <div className="relative bg-brand-navy p-3.5 rounded-[2.5rem] shadow-2xl border-4 border-slate-800">
                  {/* Phone Speaker Notch */}
                  <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>

                  {/* Phone Screen Canvas */}
                  <div className="bg-white rounded-[2rem] p-4 space-y-4 shadow-inner text-left">
                    {/* Public Scan Screen Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-emergency-red animate-heartbeat" />
                        <span className="text-xs font-black tracking-tight text-brand-navy">PingME Lifeline</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-brand-tint text-brand-dark rounded-full border border-brand-primary/30">
                        ACTIVE
                      </span>
                    </div>

                    {/* Victim Medical Card Preview */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 relative">
                          <img
                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
                            alt="Rohan Sharma"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-brand-navy">Rohan Sharma</div>
                          <div className="text-[11px] text-text-secondary">English, Hindi</div>
                        </div>
                      </div>

                      <div className="w-11 h-14 rounded-xl bg-emergency-red text-white flex flex-col items-center justify-center font-black shadow-sm">
                        <span className="text-[8px] uppercase tracking-wider opacity-90">Blood</span>
                        <span className="text-base">O+</span>
                      </div>
                    </div>

                    {/* Allergies & Conditions */}
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 rounded-xl bg-brand-tint/60 border border-brand-primary/30 text-text-main flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                        <span>Allergy: <strong>Penicillin</strong></span>
                      </div>
                      <div className="p-2 rounded-xl bg-brand-bg border border-brand-border text-text-main flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                        <span>Condition: <strong>Mild Asthma</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons Mockup */}
                    <div className="space-y-2 pt-1">
                      <div className="w-full py-2.5 bg-emergency-red text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm">
                        <PhoneCall className="w-3.5 h-3.5" /> Call 108 Ambulance
                      </div>
                      <div className="w-full py-2.5 bg-brand-primary text-brand-navy rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-brand">
                        <HeartPulse className="w-3.5 h-3.5" /> I&apos;m with them (Alert Family)
                      </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="text-[9px] text-center text-text-secondary flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand-primary" />
                      <span>Phone numbers masked by PingME Relay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3-STEP PROCESS) */}
      <section className="py-16 bg-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-brand-primary">
              Simple 3-Step Lifecycle
            </span>
            <h2 className="text-3xl font-black text-brand-navy tracking-tight">
              How PingME Lifeline Works
            </h2>
            <p className="text-sm text-text-secondary">
              Engineered for the critical minutes of an emergency, protecting privacy at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-primary text-brand-navy font-black text-lg flex items-center justify-center mb-4 shadow-brand">
                  1
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  Register Your Emergency Profile
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Enter your blood group, critical allergies, pre-existing conditions, spoken language, and trusted family contacts in under 2 minutes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-border text-xs font-bold text-brand-dark">
                Full user privacy controls
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-navy text-white font-black text-lg flex items-center justify-center mb-4 shadow-subtle">
                  2
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  Link It to Your PingME QR Tag
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Affix the waterproof QR tag to your motorcycle helmet, car windshield, senior medical wristband, or child&apos;s school backpack.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-border text-xs font-bold text-brand-navy">
                One tag, multiple form factors
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emergency-red text-white font-black text-lg flex items-center justify-center mb-4 shadow-subtle">
                  3
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  Anyone Scans When Help Is Needed
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  A bystander scans the tag with their phone camera. Critical medical data appears instantly, 108 is dialed, and the family receives live GPS telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-border text-xs font-bold text-emergency-red">
                Zero app install required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE MODES: EVERYDAY, CRISIS, OFFICIAL */}
      <section className="py-16 bg-brand-bg border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-brand-primary">
              Adaptive Architecture
            </span>
            <h2 className="text-3xl font-black text-brand-navy tracking-tight">
              Three Modes, One Tag
            </h2>
            <p className="text-sm text-text-secondary">
              A single QR tag adapts dynamically to who is scanning it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Everyday Mode */}
            <div className="bg-white p-6 rounded-3xl shadow-card border border-brand-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emergency-50 text-emergency-red flex items-center justify-center mb-4">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emergency-50 text-emergency-red mb-2 inline-block">
                  Everyday Mode
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  Bystander First Response
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  A bystander scans the tag during a road accident, medical collapse, or lost elder scenario. Essential vitals are displayed without revealing phone numbers.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/t/LIFE-9021"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emergency-red hover:underline"
                >
                  <span>Experience Scan Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Crisis Mode */}
            <div className="bg-white p-6 rounded-3xl shadow-card border border-brand-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-tint text-brand-dark flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-tint text-brand-dark mb-2 inline-block">
                  Crisis Mode
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  Camp &amp; Triage Rescuer
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Verified rescuers scan multiple people in bulk at relief shelters or disaster camps, marking status as Safe, Injured, or Admitted. Families are updated automatically.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/rescuer/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:underline"
                >
                  <span>Open Rescuer Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Official Mode */}
            <div className="bg-white p-6 rounded-3xl shadow-card border border-brand-border flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-bg text-brand-navy flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-bg text-brand-navy mb-2 inline-block">
                  Official Mode
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  Hospital &amp; Police Verification
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Authorized police officers and hospital trauma directors unlock confidential clinical histories and log identification leads with complete audit security.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/official/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:underline"
                >
                  <span>Explore Official Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST AND PRIVACY SECTION */}
      <section className="py-16 bg-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="p-8 sm:p-12 rounded-[2rem] bg-brand-navy text-white shadow-elevated">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-primary text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                <span>Engineered for Absolute Privacy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Safety Without Compromising Your Identity.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Unlike handwritten emergency cards or vehicle windshield stickers that expose your personal mobile number to passersby, PingME Lifeline uses a zero-knowledge virtual relay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10">
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" /> No Phone Number Leakage
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calls between helpers and family members are routed through PingME&apos;s encrypted virtual exchange.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" /> Role-Based Access Control
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strangers see only vital allergies and blood group. Full medical history requires doctor authentication.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" /> Instant Family Real-Time Sync
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Family consoles receive instant live GPS telemetry and hospital triage options via Supabase Realtime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-12 bg-white text-text-secondary text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-brand-primary" />
            <span className="font-bold text-brand-navy">PingME Lifeline</span>
            <span>• Developed by Team The Callback</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/owner/profile" className="hover:text-brand-dark">Owner Profile</Link>
            <Link href="/family/dashboard" className="hover:text-brand-dark">Family Hub</Link>
            <Link href="/rescuer/dashboard" className="hover:text-brand-dark">Crisis Rescuer</Link>
            <Link href="/official/dashboard" className="hover:text-brand-dark">Official View</Link>
            <Link href="/pass" className="hover:text-brand-dark">PingME Pass</Link>
          </div>
        </div>
      </footer>

      {showQrModal && (
        <QrGeneratorModal
          initialCode={selectedDemoCode}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}
