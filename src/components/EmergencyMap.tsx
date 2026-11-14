'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface EmergencyMapProps {
  lat: number;
  lng: number;
  personName?: string;
  situation?: string;
  registeredLat?: number;
  registeredLng?: number;
  registeredLocationName?: string;
  showRegisteredBaseline?: boolean;
}

export function EmergencyMap({
  lat,
  lng,
  personName = 'Emergency Incident',
  situation = 'Accident',
  registeredLat,
  registeredLng,
  registeredLocationName = 'Registered Home Base (New Delhi)',
  showRegisteredBaseline = false,
}: EmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    let resizeTimer: any = null;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      // Fix default Leaflet icon paths in Next.js webpack bundling
      try {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      } catch {}

      // Clean up previous map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance centered on the live incident coordinates
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      mapInstanceRef.current = map;

      // Ensure proper sizing after layout paint
      resizeTimer = setTimeout(() => {
        if (isMounted && map) {
          map.invalidateSize();
        }
      }, 200);

      // 100% Free OpenStreetMap Standard Tile Layer — Zero API Key Required
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // 1. Live Bystander / Incident GPS Marker (Red Pulsing Beacon)
      const liveIncidentIcon = L.divIcon({
        className: 'custom-emergency-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #E5484D; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background-color: #E5484D; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">!</div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const incidentMarker = L.marker([lat, lng], { icon: liveIncidentIcon }).addTo(map);
      incidentMarker.bindPopup(`
        <div style="font-family: inherit; padding: 6px; min-width: 180px;">
          <div style="display: inline-block; padding: 2px 6px; border-radius: 4px; background: #FEE2E2; color: #DC2626; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">
            🚨 LIVE INCIDENT GPS
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #1C1917;">${personName}</div>
          <div style="font-size: 11px; color: #DC2626; font-weight: 600; margin-top: 2px;">Situation: ${situation.toUpperCase()}</div>
          <div style="font-size: 10px; color: #78716C; font-family: monospace; margin-top: 4px;">
            ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E
          </div>
          <div style="font-size: 9px; color: #059669; font-weight: 600; margin-top: 4px;">
            ✔ Transmitted by Bystander Phone GPS
          </div>
        </div>
      `).openPopup();

      // Pulsing circle around the incident location
      L.circle([lat, lng], {
        radius: 150,
        color: '#E5484D',
        fillColor: '#E5484D',
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);

      // 2. Tag Owner Registered Base Location (Distinguished Blue Pin)
      if (showRegisteredBaseline && registeredLat && registeredLng) {
        const registeredBaseIcon = L.divIcon({
          className: 'custom-registered-marker',
          html: `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #2563EB; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">🏠</div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const registeredMarker = L.marker([registeredLat, registeredLng], { icon: registeredBaseIcon }).addTo(map);
        registeredMarker.bindPopup(`
          <div style="font-family: inherit; padding: 6px; min-width: 180px;">
            <div style="display: inline-block; padding: 2px 6px; border-radius: 4px; background: #DBEAFE; color: #1D4ED8; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">
              🏠 REGISTERED BASELINE
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #1C1917;">${personName}&apos;s Registered Base</div>
            <div style="font-size: 11px; color: #4B5563; margin-top: 2px;">${registeredLocationName}</div>
            <div style="font-size: 10px; color: #78716C; font-family: monospace; margin-top: 4px;">
              ${registeredLat.toFixed(5)}° N, ${registeredLng.toFixed(5)}° E
            </div>
          </div>
        `);

        // Fit bounds to show both the registered home and live incident location
        const bounds = L.latLngBounds([
          [lat, lng],
          [registeredLat, registeredLng],
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }

    initMap();

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, personName, situation, registeredLat, registeredLng, registeredLocationName, showRegisteredBaseline]);

  return (
    <div className="relative w-full h-[300px] sm:h-[380px] rounded-3xl overflow-hidden shadow-card border border-brand-border bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Status & Coordinates Pill */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-border shadow-subtle flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emergency-red animate-ping"></span>
        <span className="text-[11px] font-bold text-brand-navy">Live Incident GPS Lock</span>
        <span className="font-mono text-[10px] text-text-secondary">
          {lat.toFixed(4)}°, {lng.toFixed(4)}°
        </span>
      </div>

      {/* Legend identifying Helper GPS vs Registered Citizen Baseline */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-brand-border shadow-subtle flex items-center gap-3 text-[10px] font-semibold text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emergency-red"></span>
          <span className="text-brand-navy font-bold">Helper Live GPS</span>
        </span>
        {showRegisteredBaseline && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Registered Home Base</span>
          </span>
        )}
        <span className="text-[9px] text-fresh-green font-bold bg-fresh-mint px-1.5 py-0.5 rounded border border-fresh-green/30">
          OpenStreetMap (No Key Required)
        </span>
      </div>
    </div>
  );
}
