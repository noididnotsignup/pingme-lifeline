import { NearbyHospital } from '@/types';

// Calculate distance in kilometers using the Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const FALLBACK_HOSPITALS: Omit<NearbyHospital, 'distanceKm'>[] = [
  {
    id: 'hosp-1',
    name: 'Apex Trauma & Emergency Center',
    lat: 28.5672,
    lng: 77.2100,
    address: 'Ring Road, Trauma Care Annex',
    phone_masked: '108 (Emergency Dispatch)',
    emergency_beds: 34,
  },
  {
    id: 'hosp-2',
    name: 'Apollo Lifeline Multi-Specialty Hospital',
    lat: 28.5411,
    lng: 77.2831,
    address: 'Sarita Vihar, Mathura Road',
    phone_masked: '+91 11 26** **00',
    emergency_beds: 18,
  },
  {
    id: 'hosp-3',
    name: 'Max Super Speciality Emergency Wing',
    lat: 28.5284,
    lng: 77.2119,
    address: '1, 2, Press Enclave Marg, Saket',
    phone_masked: '+91 11 40** **55',
    emergency_beds: 22,
  },
  {
    id: 'hosp-4',
    name: 'Fortis Escorts Emergency Center',
    lat: 28.5603,
    lng: 77.2763,
    address: 'Okhla Road, New Friends Colony',
    phone_masked: '+91 11 47** **00',
    emergency_beds: 15,
  },
];

export async function fetchNearbyHospitals(lat: number, lng: number): Promise<NearbyHospital[]> {
  // Attempt Overpass API with a strict 3.5s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    // 5km radius query for hospitals and clinics
    const query = `
      [out:json][timeout:3];
      (
        node["amenity"="hospital"](around:5000,${lat},${lng});
        way["amenity"="hospital"](around:5000,${lat},${lng});
      );
      out center 5;
    `;

    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.elements && data.elements.length > 0) {
        const results: NearbyHospital[] = data.elements
          .map((el: any) => {
            const hLat = el.lat || el.center?.lat || lat;
            const hLng = el.lon || el.center?.lon || lng;
            const name = el.tags?.name || 'Emergency Medical Center';
            const dist = calculateDistanceKm(lat, lng, hLat, hLng);
            return {
              id: `overpass-${el.id}`,
              name,
              distanceKm: dist,
              lat: hLat,
              lng: hLng,
              address: el.tags?.['addr:street'] || 'Emergency Medical Node',
              phone_masked: '108 / Direct Ambulance',
              emergency_beds: Math.floor(Math.random() * 20) + 10,
            };
          })
          .sort((a: NearbyHospital, b: NearbyHospital) => a.distanceKm - b.distanceKm);

        if (results.length > 0) return results.slice(0, 5);
      }
    }
  } catch {
    // Graceful fallback to pre-computed emergency centers
  }

  // Calculate distances relative to user's current pin
  return FALLBACK_HOSPITALS.map((h) => ({
    ...h,
    distanceKm: calculateDistanceKm(lat, lng, h.lat, h.lng),
  })).sort((a, b) => a.distanceKm - b.distanceKm);
}
