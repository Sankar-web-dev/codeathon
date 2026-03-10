'use client'
import { HouseholdDetailsSheet } from '@/components/globe/household-details-sheet'
import { HungerGlobe } from '@/components/globe/hunger-globe'
import React, { useEffect, useState } from 'react'
// import { fetchHouseholds, MOCK_HOUSEHOLDS } from '@/lib/supabase';
import { Household } from '@/lib/types';

const VisualizerPage = () => {
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
    <>
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
     </main>
    </>
  )
}

export default VisualizerPage