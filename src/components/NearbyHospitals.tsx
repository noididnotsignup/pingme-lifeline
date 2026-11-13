'use client';

import React, { useEffect, useState } from 'react';
import { NearbyHospital } from '@/types';
import { fetchNearbyHospitals } from '@/lib/hospitals';
import { Building2, Navigation, Phone, BedDouble, AlertCircle, RefreshCw } from 'lucide-react';

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
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-card border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emergency-600" />
            <span>Nearby Emergency Trauma Centers</span>
          </h3>
          <p className="text-xs text-slate-500">Live triage proximity via OpenStreetMap &amp; Overpass API</p>
        </div>
        <button
          onClick={loadHospitals}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Refresh nearest hospitals"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mb-2" />
          <p className="text-xs text-slate-500">Querying nearest emergency facilities...</p>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">
          No hospital records returned in 5km radius. Call 108 for emergency routing.
        </div>
      ) : (
        <div className="space-y-3">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {hosp.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emergency-100 dark:bg-emergency-950/60 text-emergency-700 dark:text-emergency-300 border border-emergency-200/50 dark:border-emergency-800/30">
                    {hosp.distanceKm} km
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {hosp.address && <span className="truncate">{hosp.address}</span>}
                  {hosp.emergency_beds && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium flex-shrink-0">
                      <BedDouble className="w-3 h-3" />
                      {hosp.emergency_beds} Beds Avail.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-pingme-600" />
                  <span className="hidden sm:inline">Route</span>
                </a>
                <a
                  href="tel:108"
                  className="p-2 bg-emergency-600 hover:bg-emergency-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  title="Call Ambulance"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
