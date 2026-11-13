'use client';

import React, { useEffect, useState } from 'react';
import { NearbyHospital } from '@/types';
import { fetchNearbyHospitals } from '@/lib/hospitals';
import { Building2, Navigation, Phone, BedDouble, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

interface NearbyHospitalsProps {
  lat: number;
  lng: number;
}

export function NearbyHospitals({ lat, lng }: NearbyHospitalsProps) {
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const data = await fetchNearbyHospitals(lat, lng);
      setHospitals(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [lat, lng]);

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-brand-border">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
        <div>
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emergency-red" />
            <span>Nearby Emergency Trauma Centers</span>
          </h3>
          <p className="text-xs text-text-secondary">
            Triangulated via OpenStreetMap Overpass API &amp; Emergency Directory
          </p>
        </div>
        <button
          onClick={loadHospitals}
          disabled={loading}
          className="p-1.5 text-text-secondary hover:text-brand-navy rounded-xl hover:bg-brand-bg transition-colors"
          title="Refresh nearest hospitals"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-primary mb-2" />
          <p className="text-xs text-text-secondary">Querying nearest emergency facilities...</p>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="py-6 text-center text-xs text-text-secondary">
          No hospital records returned in 5km radius. Call 108 for emergency dispatch.
        </div>
      ) : (
        <div className="space-y-3">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-3.5 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-between gap-3 hover:border-brand-primary/40 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-brand-navy truncate">
                    {hosp.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emergency-50 text-emergency-red border border-emergency-red/20">
                    {hosp.distanceKm} km away
                  </span>
                  {hosp.source === 'openstreetmap' ? (
                    <span className="text-[9px] font-semibold text-brand-dark bg-brand-tint px-1.5 py-0.5 rounded border border-brand-primary/30">
                      OSM Live
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold text-text-secondary bg-white px-1.5 py-0.5 rounded border border-brand-border">
                      Verified Directory
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-text-secondary flex-wrap">
                  {hosp.address && <span className="truncate">{hosp.address}</span>}
                  {hosp.emergency_beds !== undefined && (
                    <span className="flex items-center gap-1 text-fresh-green font-medium flex-shrink-0">
                      <BedDouble className="w-3 h-3" />
                      {hosp.emergency_beds} Beds Logged
                    </span>
                  )}
                  {hosp.phone_masked && (
                    <span className="font-mono text-[10px]">
                      📞 {hosp.phone_masked}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-brand-tint/60 text-brand-navy rounded-xl text-xs font-semibold shadow-subtle border border-brand-border transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-brand-primary" />
                  <span className="hidden sm:inline">Directions</span>
                </a>
                <a
                  href="tel:108"
                  className="p-2 bg-emergency-red hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-subtle transition-colors"
                  title="Call 108 Ambulance"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
