export type SatStatus = "NOMINAL" | "WARNING" | "CRITICAL";

export interface SatelliteData {
  id: string;
  name: string;
  norad: string;
  altitude: string;
  velocity: string;
  health: number;
  status: SatStatus;
  orbitType: string;
  type: string;
}

export const mockSatellites: SatelliteData[] = [
  { id: "1", name: "Starlink-3091", norad: "49201", altitude: "550 km", velocity: "7.59 km/s", health: 98, status: "NOMINAL", orbitType: "LEO", type: "Comm" },
  { id: "2", name: "ISS (ZARYA)", norad: "25544", altitude: "420 km", velocity: "7.66 km/s", health: 100, status: "NOMINAL", orbitType: "LEO", type: "Station" },
  { id: "3", name: "GOES-16", norad: "41866", altitude: "35,786 km", velocity: "3.07 km/s", health: 92, status: "NOMINAL", orbitType: "GEO", type: "Weather" },
  { id: "4", name: "Hubble Space Telescope", norad: "20580", altitude: "540 km", velocity: "7.59 km/s", health: 85, status: "WARNING", orbitType: "LEO", type: "Science" },
  { id: "5", name: "Iridium 33 Debris", norad: "33802", altitude: "780 km", velocity: "7.45 km/s", health: 0, status: "CRITICAL", orbitType: "LEO", type: "Debris" },
  { id: "6", name: "GPS BIIR-11", norad: "28190", altitude: "20,200 km", velocity: "3.87 km/s", health: 95, status: "NOMINAL", orbitType: "MEO", type: "Nav" },
  { id: "7", name: "Sentinel-1A", norad: "39634", altitude: "693 km", velocity: "7.50 km/s", health: 88, status: "NOMINAL", orbitType: "SSO", type: "Earth Obs" },
  { id: "8", name: "Cosmos 2251 Debris", norad: "33796", altitude: "790 km", velocity: "7.44 km/s", health: 0, status: "CRITICAL", orbitType: "LEO", type: "Debris" },
  { id: "9", name: "Telstar 19V", norad: "43562", altitude: "35,786 km", velocity: "3.07 km/s", health: 76, status: "WARNING", orbitType: "GEO", type: "Comm" },
  { id: "10", name: "Landsat 8", norad: "39084", altitude: "705 km", velocity: "7.50 km/s", health: 99, status: "NOMINAL", orbitType: "SSO", type: "Earth Obs" },
];
