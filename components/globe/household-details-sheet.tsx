'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Household, calculateRiskLevel, getRiskBadgeVariant } from '@/lib/types';
import { X } from 'lucide-react';

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

  const riskLevel = calculateRiskLevel(household.hunger_risk_score);
  const badgeVariant = getRiskBadgeVariant(riskLevel);

  const riskLabel = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  }[riskLevel];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-2xl">{household.name}</SheetTitle>
              <SheetDescription className="mt-2">
                {household.location_description || 'Location data available'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Risk Assessment Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Food Security Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge variant={badgeVariant}>{riskLabel}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className="font-semibold">
                    {household.hunger_risk_score}/100
                  </span>
                </div>
                {/* Risk score bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      riskLevel === 'high'
                        ? 'bg-red-500'
                        : riskLevel === 'medium'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                    }`}
                    style={{
                      width: `${household.hunger_risk_score}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Household Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Household Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-muted-foreground">
                    Household Size
                  </span>
                  <span className="font-semibold">{household.household_size} people</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-muted-foreground">
                    Household ID
                  </span>
                  <span className="font-mono text-xs break-all">{household.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Geographic Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-muted-foreground">Latitude</span>
                  <span className="font-semibold">
                    {household.latitude.toFixed(4)}°
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-muted-foreground">Longitude</span>
                  <span className="font-semibold">
                    {household.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {household.created_at && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Record Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm">
                    {new Date(household.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
