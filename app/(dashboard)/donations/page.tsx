'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  NavigationIcon, 
  PackageIcon, 
  TimerIcon, 
  ArrowRightIcon, 
  RadarIcon 
} from 'lucide-react';

interface Donation {
  id: string;
  food_type: string;
  quantity: number;
  donor_lat: number;
  donor_lon: number;
  distance: number;
}

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: volunteer } = await supabase.from('volunteers').select('id, lat, lon').eq('email', user.email).single();
        if (volunteer) {
          setVolunteerId(volunteer.id);
          const { data: donationsData, error: donationsError } = await supabase.from('donations').select('*').eq('status', 'available');
          
          if (!donationsError) {
            const donorIds = [...new Set(donationsData.map(d => d.donor_id))];
            const { data: donorsData } = await supabase.from('donors').select('id, lat, lon').in('id', donorIds);
            
            if (donorsData) {
              const donorMap = donorsData.reduce((acc, d) => ({ ...acc, [d.id]: d }), {} as Record<string, any>);
              const nearby = donationsData.filter(d => {
                const donor = donorMap[d.donor_id];
                if (!donor || !donor.lat || !donor.lon) return false;
                return haversineDistance(volunteer.lat, volunteer.lon, donor.lat, donor.lon) < 5;
              }).map(d => {
                const donor = donorMap[d.donor_id];
                return {
                  id: d.id,
                  food_type: d.food_type,
                  quantity: d.quantity,
                  donor_lat: donor.lat,
                  donor_lon: donor.lon,
                  distance: haversineDistance(volunteer.lat, volunteer.lon, donor.lat, donor.lon)
                };
              });
              setDonations(nearby.sort((a, b) => a.distance - b.distance));
            }
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAccept = async (donationId: string) => {
    if (!volunteerId) return;
    const supabase = createSupabaseClient();
    const { error: updateError } = await supabase.from('donations').update({ status: 'picked' }).eq('id', donationId);
    if (updateError) return toast.error('Failed to accept');

    const { data: households } = await supabase.from('households').select('*').eq('priority_level', 'HIGH').order('hunger_probability', { ascending: false }).limit(1);
    
    if (households && households.length > 0) {
      const { error: insertError } = await supabase.from('deliveries').insert({
        donation_id: donationId,
        volunteer_id: volunteerId,
        household_id: households[0].id
      });
      if (!insertError) {
        toast.success('Pickup Confirmed! Route Optimized.');
        router.push('/my-deliveries');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center">
        <RadarIcon className="w-12 h-12 text-emerald-500 animate-spin-slow" />
        <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest">Scanning Nearby...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="text-center space-y-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block p-3 bg-emerald-100 rounded-2xl mb-2">
            <NavigationIcon className="w-6 h-6 text-emerald-600 fill-current" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Rescue Radar</h1>
          <p className="text-slate-500 font-medium">Available pick-ups within your 5km radius</p>
        </div>

        {/* --- LIST --- */}
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {donations.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-[32px] border border-slate-100">
                <PackageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No active pings in your area.</p>
              </motion.div>
            ) : (
              donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)] transition-all duration-500 rounded-[24px] bg-white">
                    <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                      {/* Distance Badge Side */}
                      <div className="bg-slate-900 md:w-32 flex flex-col items-center justify-center p-6 text-white text-center">
                        <p className="text-2xl font-black">{donation.distance.toFixed(1)}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Kilometers</p>
                        <TimerIcon className="w-4 h-4 mt-4 text-emerald-400 opacity-40" />
                      </div>

                      {/* Content Side */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-2 text-center md:text-left">
                          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Available Now
                          </div>
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{donation.food_type}</h3>
                          <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><PackageIcon className="w-4 h-4" /> {donation.quantity} kg</span>
                            <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4" /> Local Hub</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleAccept(donation.id)}
                          className="w-full md:w-auto h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-100"
                        >
                          Accept Pickup <ArrowRightIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
