'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Home, 
  MapPin, 
  Users, 
  Activity,
  TrendingUp,
  Gauge,
  Navigation
} from 'lucide-react';
import { calculateRiskLevel, getRiskBadgeVariant, Household } from '@/app/(dashboard)/visualizer/_types/householdTypes';

interface HouseholdDetailsSheetProps {
  household: Household | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HouseholdDetailsSheet({
  household,
  isOpen,
  onClose,
}: HouseholdDetailsSheetProps) {
  if (!household) return null;

  const riskScore = Math.round((household.hunger_probability ?? 0) * 100);
  const riskLevel = calculateRiskLevel(riskScore);
  const badgeVariant = getRiskBadgeVariant(riskLevel);

  const riskConfig = {
    low: { 
      label: 'Low Risk', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      icon: Activity
    },
    medium: { 
      label: 'Medium Risk', 
      color: 'text-amber-500', 
      bg: 'bg-amber-500',
      gradient: 'from-amber-500/20 to-amber-500/5',
      icon: TrendingUp
    },
    high: { 
      label: 'High Risk', 
      color: 'text-red-500', 
      bg: 'bg-red-500',
      gradient: 'from-red-500/20 to-red-500/5',
      icon: AlertTriangle
    },
  }[riskLevel];

  const RiskIcon = riskConfig.icon;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[420px] overflow-y-auto border-l border-border/50 bg-background/95 backdrop-blur-xl font-serif">
        <SheetHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${riskConfig.gradient} border border-border/50`}>
              <Home className={`h-5 w-5 ${riskConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-bold truncate">
                Household #{household.household_id}
              </SheetTitle>
              <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                {household.id}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5">
          {/* Risk Assessment Card - Hero Style */}
          <Card className={`border-0 bg-gradient-to-br ${riskConfig.gradient} shadow-lg`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RiskIcon className={`h-5 w-5 ${riskConfig.color}`} />
                  <span className="font-semibold">Risk Assessment</span>
                </div>
                <Badge variant={badgeVariant} className="font-semibold px-3 py-1">
                  {riskConfig.label}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-bold tracking-tight">{riskScore}</span>
                  <span className="text-muted-foreground text-sm mb-1">/100 risk score</span>
                </div>
                
                {/* Animated Progress Bar */}
                <div className="h-3 bg-background/50 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${riskConfig.bg} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                    style={{ width: `${riskScore}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
                
                {/* Score Labels */}
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Safe</span>
                  <span>Moderate</span>
                  <span>Critical</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Family Size</span>
                </div>
                <p className="text-2xl font-bold">{household.family_size ?? '-'}</p>
                <p className="text-xs text-muted-foreground">members</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-medium">Priority</span>
                </div>
                <p className="text-2xl font-bold capitalize">{household.priority_level ?? '-'}</p>
                <p className="text-xs text-muted-foreground">level</p>
              </CardContent>
            </Card>
          </div>

          {/* Location Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Geographic Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Navigation className="h-3 w-3" /> Latitude
                  </p>
                  <p className="font-mono text-sm font-semibold">
                    {household.lat?.toFixed(6) ?? '-'}°
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Navigation className="h-3 w-3 rotate-90" /> Longitude
                  </p>
                  <p className="font-mono text-sm font-semibold">
                    {household.lon?.toFixed(6) ?? '-'}°
                  </p>
                </div>
              </div>
              
              {household.village_id && (
                <>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Village ID</span>
                    <Badge variant="outline" className="font-mono">
                      #{household.village_id}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Record Info */}
          {household.created_at && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                Record created {new Date(household.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
