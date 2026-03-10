'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2Icon, 
  MapPinIcon, 
  TruckIcon, 
  ClockIcon, 
  ChevronRightIcon,
  Navigation2Icon,
  PackageCheckIcon
} from 'lucide-react';

// Dynamic Map Imports
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

interface Delivery {
  id: string;
  food_type: string;
  quantity: number;
  status: string;
  assigned_at: string;
  household_lat: number;
  household_lon: number;
}

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [volunteerLat, setVolunteerLat] = useState<number | null>(null);
  const [volunteerLon, setVolunteerLon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Logic remains identical to original
  const markAsDelivered = async (deliveryId: string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('deliveries')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', deliveryId);
    if (error) {
      toast.error('Failed to update delivery');
    } else {
      toast.success('Mission Accomplished!');
      // ... (Rest of refresh logic kept exactly as original)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: volunteer } = await supabase.from('volunteers').select('id, lat, lon').eq('email', user.email).single();
        if (volunteer) {
          const { data } = await supabase
            .from('deliveries')
            .select('id, status, assigned_at, donations(food_type, quantity), households(lat, lon)')
            .eq('volunteer_id', volunteer.id);
          if (data) {
            const formatted = data.map(d => ({
              id: d.id,
              food_type: d.donations?.[0]?.food_type || 'Unknown',
              quantity: d.donations?.[0]?.quantity || 0,
              status: d.status,
              assigned_at: d.assigned_at,
              household_lat: d.households?.[0]?.lat,
              household_lon: d.households?.[0]?.lon,
            }));
            setDeliveries(formatted);
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: volunteer } = await supabase.from('volunteers').select('id, lat, lon').eq('email', user.email).single();
        if (volunteer) {
          setVolunteerLat(volunteer.lat);
          setVolunteerLon(volunteer.lon);
          const { data, error } = await supabase
            .from('deliveries')
            .select('id, status, assigned_at, donations(food_type, quantity), households(lat, lon)')
            .eq('volunteer_id', volunteer.id);
          if (!error) {
            const formatted = data.map(d => ({
              id: d.id,
              food_type: d.donations?.[0]?.food_type || 'Unknown',
              quantity: d.donations?.[0]?.quantity || 0,
              status: d.status,
              assigned_at: d.assigned_at,
              household_lat: d.households?.[0]?.lat,
              household_lon: d.households?.[0]?.lon,
            }));
            setDeliveries(formatted);
          }
        }
      }
      setLoading(false);
    };
    fetchDeliveries();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Initializing Tracker...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <TruckIcon className="text-emerald-500 w-10 h-10" /> Active Missions
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Real-time delivery tracking and status management.</p>
          </div>
          <div className="hidden md:block bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Route</p>
            <p className="text-lg font-black text-emerald-600">{deliveries.filter(d => d.status !== 'delivered').length} Destinations</p>
          </div>
        </div>

        {deliveries.length === 0 ? (
          <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/50 p-20 text-center">
            <PackageCheckIcon className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800">Clear Horizon</h2>
            <p className="text-slate-500">No active deliveries assigned to your profile yet.</p>
          </Card>
        ) : (
          <div className="grid gap-8">
            <AnimatePresence>
              {deliveries.map((delivery) => (
                <motion.div 
                  key={delivery.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  layout
                >
                  <Card className="rounded-[32px] border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden bg-white">
                    <div className="flex flex-col lg:flex-row">
                      
                      {/* --- Left Side: Mission Info --- */}
                      <div className="flex-1 p-8 md:p-10 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            Mission ID: {delivery.id.slice(0, 8)}
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter flex items-center gap-2 border ${
                            delivery.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${delivery.status === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                            {delivery.status}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{delivery.food_type}</h2>
                          <div className="flex items-center gap-4 mt-3 text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100"><ClockIcon className="w-4 h-4" /> {new Date(delivery.assigned_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100"><Navigation2Icon className="w-4 h-4" /> {delivery.quantity} Units</span>
                          </div>
                        </div>

                        {/* Visual Progress Bar (The Hackathon Touch) */}
                        <div className="relative pt-6">
                          <div className="flex justify-between mb-2">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</p>
                             <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                {delivery.status === 'delivered' ? 'Completed' : 'En Route'}
                             </p>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: delivery.status === 'delivered' ? '100%' : '50%' }}
                              className="h-full bg-emerald-500"
                            />
                          </div>
                        </div>

                        {delivery.status !== 'delivered' && (
                          <Button 
                            onClick={() => markAsDelivered(delivery.id)} 
                            className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold flex gap-3 shadow-xl transition-all active:scale-95"
                          >
                            Confirm Successful Delivery <CheckCircle2Icon className="w-5 h-5 text-emerald-400" />
                          </Button>
                        )}
                      </div>

                      {/* --- Right Side: Tactical Map --- */}
                      <div className="w-full lg:w-[400px] h-[350px] lg:h-auto border-l border-slate-50 relative">
                        {volunteerLat && volunteerLon && delivery.household_lat && delivery.household_lon && (
                          <div className="absolute inset-0 z-0">
                            <MapContainer 
                                center={[volunteerLat, volunteerLon]} 
                                zoom={14} 
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={false}
                                zoomControl={false}
                            >
                              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                              <Marker position={[volunteerLat, volunteerLon]}>
                                <Popup>Your Current Position</Popup>
                              </Marker>
                              <Marker position={[delivery.household_lat, delivery.household_lon]}>
                                <Popup>Target Household</Popup>
                              </Marker>
                              <Polyline 
                                positions={[[volunteerLat, volunteerLon], [delivery.household_lat, delivery.household_lon]]} 
                                color="#10b981" 
                                weight={4}
                                dashArray="10, 10"
                              />
                            </MapContainer>
                          </div>
                        )}
                        {/* Map Overlay Button */}
                        <div className="absolute bottom-6 right-6 z-[400]">
                            <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur shadow-md rounded-xl font-bold border-none">
                                <MapPinIcon className="w-4 h-4 mr-2 text-emerald-600" /> Expand View
                            </Button>
                        </div>
                      </div>

                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}