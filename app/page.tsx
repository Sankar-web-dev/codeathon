'use client';

import React, { useEffect, useState } from 'react';
import { HungerGlobe } from '@/components/globe/hunger-globe';
import { HouseholdDetailsSheet } from '@/components/globe/household-details-sheet';
import { Household } from '@/app/(dashboard)/visualizer/_types/householdTypes';
// import { fetchHouseholds, MOCK_HOUSEHOLDS } from '@/lib/supabase';

export default function Home() {
  // const [households, setHouseholds] = useState<Household[]>(MOCK_HOUSEHOLDS);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // const data = await fetchHouseholds();
        // setHouseholds(data);
      } catch (err) {
        console.error('Failed to load households:', err);
        setError('Failed to load household data. Using demo data.');
        // setHouseholds(MOCK_HOUSEHOLDS);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="w-full h-screen overflow-hidden">
      {/* <HungerGlobe
        households={households}
        onMarkerClick={setSelectedHousehold}
        isLoading={isLoading}
      /> */}

      <HouseholdDetailsSheet
        household={selectedHousehold}
        isOpen={selectedHousehold !== null}
        onClose={() => setSelectedHousehold(null)}
      />

      {error && (
        <div className="absolute bottom-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg max-w-sm">
          {error}
        </div>
      )}

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none p-6">
        <h1 className="text-white text-3xl font-bold">Hunger Risk Globe</h1>
        <p className="text-gray-300 text-sm mt-2">
          Interactive visualization of household food security risks. Click any marker to view details.
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-sm text-white space-y-2 pointer-events-auto">
        <p className="font-semibold mb-3">Risk Levels</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Low Risk (0-33)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Medium Risk (34-66)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>High Risk (67-100)</span>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-sm text-white pointer-events-auto">
        <p className="font-semibold mb-2">Controls</p>
        <p className="text-gray-300">🖱️ Drag to rotate</p>
        <p className="text-gray-300">🔍 Scroll to zoom</p>
        <p className="text-gray-300">Click markers for details</p>
      </div>
    </main>
  );
}
