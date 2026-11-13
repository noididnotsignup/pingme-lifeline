'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse,
  QrCode,
  Users,
  Compass,
  Lock,
  UserCheck,
  CreditCard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { QrGeneratorModal } from './QrGeneratorModal';

export function Header() {
  const pathname = usePathname();
  const [showQrModal, setShowQrModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCode, setActiveCode] = useState('LIFE-9021');

  const navLinks = [
    { label: 'Scan Tag', href: '/t/LIFE-9021', icon: HeartPulse, priority: true },
    { label: 'Family Hub', href: '/family/dashboard', icon: Users },
    { label: 'Owner Profile', href: '/owner/profile', icon: UserCheck },
    { label: 'Rescuer Crisis', href: '/rescuer/dashboard', icon: Compass },
    { label: 'Official', href: '/official/dashboard', icon: Lock },
    { label: 'Pass', href: '/pass', icon: CreditCard },
  ];

  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-white/95 backdrop-blur-md shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Team The Callback */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-primary text-brand-navy shadow-brand group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-brand-navy animate-heartbeat" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-fresh-green"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-brand-navy">PingME</span>
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-brand-tint text-brand-dark rounded-md border border-brand-primary/40">
                  Lifeline
                </span>
              </div>
              <span className="text-[10px] font-medium text-text-secondary">
                by Team The Callback
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isCurrent(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-primary text-brand-navy shadow-brand'
                      : link.priority
                      ? 'bg-emergency-50 text-emergency-red hover:bg-emergency-100'
                      : 'text-text-main hover:bg-brand-tint hover:text-brand-dark'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const currentTag = pathname.startsWith('/t/') ? pathname.replace('/t/', '') : 'LIFE-9021';
                setActiveCode(currentTag);
                setShowQrModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy hover:bg-black text-white rounded-xl text-xs font-bold shadow-subtle transition-all"
              title="Show interactive QR code for phone scanning"
            >
              <QrCode className="w-3.5 h-3.5 text-brand-primary" />
              <span className="hidden sm:inline">Phone QR</span>
            </button>

            <Link
              href="/auth"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-tint hover:bg-brand-primary/20 text-brand-dark border border-brand-primary/40 rounded-xl text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Roles</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-text-main rounded-xl hover:bg-brand-tint"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 bg-white border-b border-brand-border space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isCurrent(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-primary text-brand-navy shadow-sm'
                      : 'text-text-main hover:bg-brand-tint'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-brand-dark bg-brand-tint mt-2"
            >
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Switch Demo Persona / Role</span>
            </Link>
          </div>
        )}
      </header>

      {showQrModal && (
        <QrGeneratorModal
          initialCode={activeCode}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </>
  );
}
