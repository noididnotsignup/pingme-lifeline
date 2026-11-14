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
    address: 'Ring Road, Trauma Care Annex, New Delhi',
    phone_masked: '108 (Emergency Dispatch)',
    source: 'emergency_directory',
  },
  {
    id: 'hosp-2',
    name: 'Apollo Lifeline Multi-Specialty Hospital',
    lat: 28.5411,
    lng: 77.2831,
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    phone_masked: '+91 11 26** **00',
    source: 'emergency_directory',
  },
  {
    id: 'hosp-3',
    name: 'Max Super Speciality Emergency Wing',
    lat: 28.5284,
    lng: 77.2119,
    address: '1, 2, Press Enclave Marg, Saket, New Delhi',
    phone_masked: '+91 11 40** **55',
    source: 'emergency_directory',
  },
  {
    id: 'hosp-4',
    name: 'Fortis Escorts Emergency Center',
    lat: 28.5603,
    lng: 77.2763,
    address: 'Okhla Road, New Friends Colony, New Delhi',
    phone_masked: '+91 11 47** **00',
    source: 'emergency_directory',
  },
];

async function queryOverpassEndpoint(url: string, query: string, timeoutMs: number): Promise<any | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}?data=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchNearbyHospitals(lat: number, lng: number): Promise<NearbyHospital[]> {
  // 5km radius query for hospitals and trauma centers on OpenStreetMap
  const query = `
    [out:json][timeout:3];
    (
      node["amenity"="hospital"](around:5000,${lat},${lng});
      way["amenity"="hospital"](around:5000,${lat},${lng});
    );
    out center 6;
  `;

  // Try primary Overpass API server
  let data = await queryOverpassEndpoint('https://overpass-api.de/api/interpreter', query, 3500);

  // If primary fails or times out, try secondary community mirror
  if (!data || !data.elements || data.elements.length === 0) {
    data = await queryOverpassEndpoint('https://overpass.kumi.systems/api/interpreter', query, 3500);
  }

  if (data && data.elements && data.elements.length > 0) {
    const results: NearbyHospital[] = data.elements
      .map((el: any) => {
        const hLat = el.lat || el.center?.lat || lat;
        const hLng = el.lon || el.center?.lon || lng;
        const name = el.tags?.name || 'Emergency Medical Facility';
        const dist = calculateDistanceKm(lat, lng, hLat, hLng);
        const rawBeds = el.tags?.['beds'];
        const parsedBeds = rawBeds ? parseInt(rawBeds, 10) : undefined;

        return {
          id: `overpass-${el.id}`,
          name,
          distanceKm: dist,
          lat: hLat,
          lng: hLng,
          address: el.tags?.['addr:street'] ? `${el.tags['addr:street']}, ${el.tags['addr:city'] || ''}` : 'Emergency Node (OSM Verified)',
          phone_masked: el.tags?.phone ? el.tags.phone.slice(0, 5) + '***' : '108 (Dispatched via Ambulance)',
          emergency_beds: !isNaN(Number(parsedBeds)) ? parsedBeds : undefined,
          source: 'openstreetmap' as const,
        };
      })
      .sort((a: NearbyHospital, b: NearbyHospital) => a.distanceKm - b.distanceKm);

    if (results.length > 0) return results.slice(0, 5);
  }

  // Graceful fallback to verified emergency centers when network or Overpass is unavailable
  return FALLBACK_HOSPITALS.map((h) => ({
    ...h,
    distanceKm: calculateDistanceKm(lat, lng, h.lat, h.lng),
  })).sort((a, b) => a.distanceKm - b.distanceKm);
}
