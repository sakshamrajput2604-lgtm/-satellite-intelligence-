import * as satellite from 'satellite.js';
import * as THREE from 'three';

export type SatStatus = "NOMINAL" | "WARNING" | "CRITICAL";

export interface LiveSatelliteData {
  id: string;
  name: string;
  norad: string;
  type: string;
  altitude: number; // km
  velocity: number; // km/s
  latitude: number;
  longitude: number;
  height: number;
  health: number;
  status: SatStatus;
  orbitType: string;
  line1: string;
  line2: string;
}

export function propagateSatellite(
  name: string,
  noradId: string,
  line1: string,
  line2: string,
  type: string,
  date: Date = new Date()
): LiveSatelliteData | null {
  try {
    const satrec = satellite.twoline2satrec(line1, line2);
    
    // Propagate satellite position/velocity
    const positionAndVelocity = satellite.propagate(satrec, date);
    const positionEci = positionAndVelocity.position;
    const velocityEci = positionAndVelocity.velocity;
    
    if (!positionEci || !velocityEci || typeof positionEci === 'boolean' || typeof velocityEci === 'boolean') {
      return null;
    }

    // Calculate geodetic position (Lat/Lon/Alt)
    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    
    const longitude = satellite.degreesLong(positionGd.longitude);
    const latitude = satellite.degreesLat(positionGd.latitude);
    const altitude = positionGd.height; // in km

    // Calculate magnitude of velocity (km/s)
    const velocity = Math.sqrt(
      Math.pow(velocityEci.x, 2) + 
      Math.pow(velocityEci.y, 2) + 
      Math.pow(velocityEci.z, 2)
    );

    // Derive pseudo-health and status based on orbital decay (BSTAR) and altitude
    // Real intelligence systems use BSTAR to predict drag. High BSTAR or low altitude = decay risk
    const bstar = satrec.bstar || 0;
    let health = 100;
    let status: SatStatus = "NOMINAL";

    if (altitude < 300) {
      health = Math.max(0, 100 - (300 - altitude) * 2);
      status = "CRITICAL";
    } else if (Math.abs(bstar) > 0.001) {
      health = 75;
      status = "WARNING";
    } else if (altitude < 400) {
      health = 85;
      status = "WARNING";
    }

    // Determine general orbit type based on altitude
    let orbitType = "LEO";
    if (altitude > 35000) orbitType = "GEO";
    else if (altitude > 2000) orbitType = "MEO";

    return {
      id: noradId,
      name,
      norad: noradId,
      type,
      altitude,
      velocity,
      latitude,
      longitude,
      height: altitude,
      health: Math.round(health),
      status,
      orbitType,
      line1,
      line2
    };

  } catch (error) {
    console.error(`Error propagating satellite ${noradId}:`, error);
    return null;
  }
}

export const EARTH_RADIUS = 5; // Our arbitrary 3D units for Earth radius

// Convert Lat, Lon, Alt to 3D Cartesian coordinates
export function getCartesian(lat: number, lon: number, alt: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Approximate scale: altitude in km / 6371 (Earth radius in km) * EARTH_RADIUS
  const r = EARTH_RADIUS + (alt / 6371) * EARTH_RADIUS;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = (r * Math.sin(phi) * Math.sin(theta));
  const y = (r * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
}
