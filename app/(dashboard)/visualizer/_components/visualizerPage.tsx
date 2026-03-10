'use client'
import { HouseholdDetailsSheet } from '@/components/globe/household-details-sheet'
import { HungerGlobe } from '@/components/globe/hunger-globe'
import React, { useEffect, useState } from 'react'
import { useHouseholds } from '../_hooks/householdData';
import { Household } from '../_types/householdTypes';
import { useSidebar } from '@/components/ui/sidebar';

const VisualizerPage = () => {
    const { data: households = [], isLoading, error } = useHouseholds();
    const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
    const { setOpen } = useSidebar();

    useEffect(() => {
      setOpen(false);
    }, [setOpen]);
    
  return (
    <>
     <main className="w-full h-screen overflow-hidden">

        <HungerGlobe
                households={households}
                onMarkerClick={setSelectedHousehold}
                isLoading={isLoading}
              /> 
        
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