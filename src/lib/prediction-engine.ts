import { LiveSatelliteData } from "./satellite-engine";

export interface ConjunctionAlert {
  id: string;
  primaryObject: string;
  primaryNorad: string;
  secondaryObject: string;
  secondaryNorad: string;
  timeToImpact: number; // minutes
  missDistance: number; // meters
  probability: number; // percentage (e.g., 1.5%)
  urgency: "CRITICAL" | "HIGH" | "ELEVATED";
}

export interface DecayPrediction {
  id: string;
  name: string;
  norad: string;
  currentAlt: number;
  predictedReentryDays: number;
  confidence: number;
}

// Deterministic random based on NORAD IDs
function pseudoRandom(seed: string) {
  let h = 0;
  for(let i = 0; i < seed.length; i++) 
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return Math.abs(h) / 2147483648;
}

export function generateConjunctions(satellites: LiveSatelliteData[]): ConjunctionAlert[] {
  if (satellites.length < 2) return [];
  
  const alerts: ConjunctionAlert[] = [];
  const now = new Date();

  // Create some stable, fake collisions based on current active catalog
  // We'll just grab the first 15 objects that have low health / high risk
  const highRisk = satellites.filter(s => s.status !== "NOMINAL").slice(0, 15);
  
  highRisk.forEach((sat, i) => {
    // Pick a random secondary object
    const r = pseudoRandom(sat.norad);
    const secondaryIdx = Math.floor(r * satellites.length);
    const secondary = satellites[secondaryIdx];

    if (!secondary || secondary.norad === sat.norad) return;

    const tca = Math.max(15, Math.floor(r * 2800)); // 15 mins to ~48 hours
    const dist = Math.max(50, Math.floor((1 - r) * 5000)); // 50m to 5000m
    const prob = (5000 - dist) / 5000 * 5 + (r * 2); // 0.1% to 7%
    
    let urgency: "CRITICAL" | "HIGH" | "ELEVATED" = "ELEVATED";
    if (dist < 500 && prob > 4) urgency = "CRITICAL";
    else if (dist < 1500) urgency = "HIGH";

    alerts.push({
      id: `C-${sat.norad}-${secondary.norad}`,
      primaryObject: sat.name,
      primaryNorad: sat.norad,
      secondaryObject: secondary.name || "UNKNOWN DEBRIS",
      secondaryNorad: secondary.norad || "N/A",
      timeToImpact: tca,
      missDistance: dist,
      probability: Number(prob.toFixed(3)),
      urgency
    });
  });

  return alerts.sort((a, b) => a.timeToImpact - b.timeToImpact);
}

export function generateDecayPredictions(satellites: LiveSatelliteData[]): DecayPrediction[] {
  // Focus on low altitude satellites
  const lowOrbit = satellites.filter(s => s.altitude < 450).slice(0, 20);
  
  return lowOrbit.map(sat => {
    const r = pseudoRandom(sat.norad);
    const days = Math.max(2, Math.floor((sat.altitude - 200) * r * 0.5));
    
    return {
      id: `D-${sat.norad}`,
      name: sat.name,
      norad: sat.norad,
      currentAlt: sat.altitude,
      predictedReentryDays: days,
      confidence: 85 + (r * 14)
    };
  }).sort((a, b) => a.predictedReentryDays - b.predictedReentryDays);
}
