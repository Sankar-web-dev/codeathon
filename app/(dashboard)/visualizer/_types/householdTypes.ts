export type RiskLevel = 'low' | 'medium' | 'high';

export interface Household {
  id: string;
  household_id: number;
  village_id: number | null;
  family_size: number | null;
  lat: number | null;
  lon: number | null;
  priority_level: string | null;
  hunger_probability: number | null;
  created_at: string | null;
}

export interface HouseholdWithRisk extends Household {
  risk_level: RiskLevel;
  risk_color: string;
}

export function calculateRiskLevel(score: number): RiskLevel {
  if (score <= 33) return 'low';
  if (score <= 66) return 'medium';
  return 'high';
}

export function getRiskColor(riskLevel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: '#22c55e',      // green
    medium: '#f97316',   // orange
    high: '#ef4444',     // red
  };
  return colors[riskLevel];
}

export function getRiskBadgeVariant(riskLevel: RiskLevel): 'default' | 'secondary' | 'destructive' {
  const variants: Record<RiskLevel, 'default' | 'secondary' | 'destructive'> = {
    low: 'default',
    medium: 'secondary',
    high: 'destructive',
  };
  return variants[riskLevel];
}
