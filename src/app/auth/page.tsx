'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Users,
  Compass,
  Lock,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AuthRolePage() {
  const demoRoles = [
    {
      id: 'helper',
      title: 'Anonymous Helper / Bystander',
      desc: 'No account needed. Scans QR tag, views emergency vitals, calls 108, and transmits location.',
      route: '/t/LIFE-9021',
      icon: HeartPulse,
      badge: 'Public / Zero-Login',
      badgeColor: 'bg-emergency-50 text-emergency-red',
    },
    {
      id: 'family',
      title: 'Family Member Account',
      desc: 'Receives real-time distress alerts, views map pin, finds nearby hospitals, and sends arrival ETA.',
      route: '/family/dashboard',
      icon: Users,
      badge: 'Realtime Console',
      badgeColor: 'bg-brand-tint text-brand-dark',
    },
    {
      id: 'owner',
      title: 'Tag Owner / Citizen',
      desc: 'Registers emergency info, edits blood group & allergies, and generates printable QR tags.',
      route: '/owner/profile',
      icon: UserCheck,
      badge: 'Profile & Tags',
      badgeColor: 'bg-fresh-mint text-fresh-green',
    },
    {
      id: 'rescuer',
      title: 'Verified Rescuer (Crisis Mode)',
      desc: 'Bulk scans citizens at disaster relief shelters, marks Safe/Injured/Admitted, and updates families.',
      route: '/rescuer/dashboard',
      icon: Compass,
      badge: 'Crisis Triage',
      badgeColor: 'bg-brand-tint text-brand-dark',
    },
    {
      id: 'official',
      title: 'Police & Hospital Official',
      desc: 'Enters hospital code (HOSP-1234) to unlock full clinical records and records sensitive identification leads.',
      route: '/official/dashboard',
      icon: Lock,
      badge: 'Restricted Access',
      badgeColor: 'bg-slate-100 text-brand-navy',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-4 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint border border-brand-primary/40 text-xs font-black text-brand-dark">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span>Hackathon Demonstration Persona Switcher</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
            Select Your Active Demo Role
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto">
            Test PingME Lifeline from any perspective. Each role accesses different levels of emergency data and functionality.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoRoles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="p-5 bg-white rounded-3xl shadow-card border border-brand-border flex flex-col justify-between hover:border-brand-primary/60 hover:shadow-elevated transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </div>

                  <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-dark transition-colors">
                    {role.title}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-brand-border">
                  <Link
                    href={role.route}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-bg hover:bg-brand-primary hover:text-brand-navy text-brand-navy rounded-xl text-xs font-bold transition-all"
                  >
                    <span>Launch as {role.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Reassurance */}
        <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-subtle flex items-center justify-center gap-2 text-xs text-text-secondary text-center">
          <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" />
          <span>No passwords or real phone numbers required. All demo accounts are pre-seeded and ready.</span>
        </div>
      </div>
    </div>
  );
}
