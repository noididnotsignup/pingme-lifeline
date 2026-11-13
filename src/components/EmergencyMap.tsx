'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface EmergencyMapProps {
  lat: number;
  lng: number;
  personName?: string;
  situation?: string;
}

export function EmergencyMap({ lat, lng, personName = 'Emergency Incident', situation = 'Accident' }: EmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    let resizeTimer: any = null;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Invalidate size to ensure proper rendering inside flex/grid containers
      resizeTimer = setTimeout(() => {
        if (isMounted && map) {
          map.invalidateSize();
        }
      }, 250);

      // CartoDB Voyager standard tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom pulsing emergency pin
      const emergencyIcon = L.divIcon({
        className: 'custom-emergency-marker',
        html: `
          <div class="emergency-pin-pulse"></div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // Add emergency marker
      const marker = L.marker([lat, lng], { icon: emergencyIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <strong style="color: #E5484D; font-size: 13px;">🚨 ${situation.toUpperCase()}</strong><br/>
          <span style="font-size: 12px; color: #1C1917; font-weight: 600;">${personName}</span><br/>
          <span style="font-size: 10px; color: #78716C; font-family: monospace;">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</span>
        </div>
      `).openPopup();

      // Pulsing circle around the location
      L.circle([lat, lng], {
        radius: 120,
        color: '#E5484D',
        fillColor: '#E5484D',
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);
    }

    initMap();

    return () => {
      isMounted = false;
      if (resizeTimer) clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, personName, situation]);

  return (
    <div className="relative w-full h-[280px] sm:h-[340px] rounded-3xl overflow-hidden shadow-card border border-brand-border">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-border shadow-subtle flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emergency-red animate-ping"></span>
        <span className="text-[11px] font-bold text-brand-navy">Live GPS Coordinate Lock</span>
        <span className="font-mono text-[10px] text-text-secondary">
          {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
        </span>
      </div>
    </div>
  );
}
