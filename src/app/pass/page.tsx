'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ShieldCheck,
  Building2,
  PowerOff,
} from 'lucide-react';

export default function PingMePassPage() {
  const [ebillConsent, setEbillConsent] = useState(true);
  const [loyaltyConsent, setLoyaltyConsent] = useState(true);
  const [offersConsent, setOffersConsent] = useState(false);
  const [contactRevoked, setContactRevoked] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-4 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint text-brand-dark text-xs font-black border border-brand-primary/40">
            <CreditCard className="w-3.5 h-3.5 text-brand-primary" />
            <span>Everyday Companion Feature • Concept Preview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
            PingME Pass — Privacy at Checkout
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            At malls and food courts, show your QR instead of announcing your personal phone number out loud.
          </p>
        </div>

        {/* The Concept: Customer Consent Screen */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-border space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-tint text-brand-dark flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-navy">Blue Tokai Coffee Roasters</h3>
                <p className="text-xs text-text-secondary">Requesting checkout customer identity</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-brand-navy px-2.5 py-1 bg-brand-tint rounded-lg border border-brand-primary/30">
              Masked: #PM-4821
            </span>
          </div>

          {/* Privacy Value Proposition */}
          <div className="p-3.5 rounded-2xl bg-brand-tint/60 border border-brand-primary/30 text-xs text-brand-navy flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <div>
              <strong>Your phone number is completely hidden.</strong> The merchant receives only an encrypted masked token (`PM-4821`) and only the permissions you explicitly grant below.
            </div>
          </div>

          {/* Interactive Consent Toggles */}
          {!contactRevoked ? (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Select Permissions for this Merchant:
              </div>

              {/* 1. E-Bill */}
              <div
                onClick={() => setEbillConsent(!ebillConsent)}
                className="p-4 rounded-2xl border border-brand-border hover:border-brand-primary/50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-brand-navy">Digital WhatsApp / SMS E-Bill</div>
                  <div className="text-[11px] text-text-secondary">Send electronic tax invoice to masked endpoint</div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  ebillConsent ? 'bg-fresh-mint text-fresh-green' : 'bg-slate-100 text-text-secondary'
                }`}>
                  {ebillConsent ? 'Allowed ✔' : 'Denied ✖'}
                </div>
              </div>

              {/* 2. Loyalty */}
              <div
                onClick={() => setLoyaltyConsent(!loyaltyConsent)}
                className="p-4 rounded-2xl border border-brand-border hover:border-brand-primary/50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-brand-navy">Store Loyalty &amp; Rewards Points</div>
                  <div className="text-[11px] text-text-secondary">Accrue store points linked to your masked ID</div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  loyaltyConsent ? 'bg-fresh-mint text-fresh-green' : 'bg-slate-100 text-text-secondary'
                }`}>
                  {loyaltyConsent ? 'Allowed ✔' : 'Denied ✖'}
                </div>
              </div>

              {/* 3. Promotional Offers */}
              <div
                onClick={() => setOffersConsent(!offersConsent)}
                className="p-4 rounded-2xl border border-brand-border hover:border-brand-primary/50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-brand-navy">Marketing &amp; Promotional Offers</div>
                  <div className="text-[11px] text-text-secondary">Receive seasonal discounts and sales SMS</div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  offersConsent ? 'bg-fresh-mint text-fresh-green' : 'bg-slate-100 text-text-secondary'
                }`}>
                  {offersConsent ? 'Allowed ✔' : 'Denied ✖'}
                </div>
              </div>

              {/* Stop Contact Action */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => alert('Consent preferences updated and synchronized with merchant POS.')}
                  className="flex-1 py-3 px-4 bg-brand-primary hover:bg-brand-dark text-brand-navy text-xs font-black rounded-xl shadow-brand transition-all"
                >
                  Save Consent Preferences
                </button>

                <button
                  onClick={() => setContactRevoked(true)}
                  className="py-3 px-4 bg-slate-100 hover:bg-emergency-50 hover:text-emergency-red text-text-secondary text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>Stop Contact (Revoke Token)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emergency-50 border border-emergency-red/30 text-center space-y-3">
              <div className="text-xs font-bold text-emergency-red">
                All Access Revoked for Blue Tokai Coffee Roasters
              </div>
              <p className="text-xs text-text-secondary">
                The merchant token #PM-4821 has been destroyed. They can no longer contact you or send messages.
              </p>
              <button
                onClick={() => setContactRevoked(false)}
                className="px-4 py-2 bg-brand-navy text-white text-xs font-bold rounded-xl"
              >
                Re-enable Access
              </button>
            </div>
          )}
        </div>

        {/* Why this matters */}
        <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-subtle text-xs text-text-secondary leading-relaxed">
          <strong className="text-brand-navy">Why PingME Pass is vital to the Lifeline ecosystem:</strong> By giving people an everyday reason to carry their PingME QR code at coffee shops, groceries, and retail stores, the QR tag is guaranteed to be in their wallet, phone, or vehicle if a medical emergency happens.
        </div>
      </div>
    </div>
  );
}
