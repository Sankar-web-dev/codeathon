'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';

import { MapContainerProps } from 'react-leaflet';

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
  const markAsDelivered = async (deliveryId: string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('deliveries')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', deliveryId);
    if (error) {
      console.error('Update error:', error);
      toast.error('Failed to update delivery');
    } else {
      toast.success('Delivery marked as completed');
      // Refresh deliveries
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
          if (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load deliveries');
          } else {
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
        } else {
          toast.error('Volunteer profile not found');
        }
      } else {
        toast.error('User not authenticated');
      }
      setLoading(false);
    };
    fetchDeliveries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Deliveries</h1>
        {deliveries.length === 0 ? (
          <p>No deliveries assigned.</p>
        ) : (
          deliveries.map((delivery) => (
            <Card key={delivery.id} className="mb-4">
              <CardHeader>
                <CardTitle>Delivery #{delivery.id.slice(0,8)}</CardTitle>
                <CardDescription>{delivery.food_type} - Quantity: {delivery.quantity}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Status: {delivery.status}</p>
                <p>Assigned: {new Date(delivery.assigned_at).toLocaleString()}</p>
                {delivery.status !== 'delivered' && (
                  <Button onClick={() => markAsDelivered(delivery.id)} className="mt-2">
                    Mark as Delivered
                  </Button>
                )}
                {volunteerLat && volunteerLon && delivery.household_lat && delivery.household_lon && (
                  <div className="h-64 mt-4">
                    <MapContainer center={[volunteerLat, volunteerLon]} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[volunteerLat, volunteerLon]}>
                        <Popup>Your Location</Popup>
                      </Marker>
                      <Marker position={[delivery.household_lat, delivery.household_lon]}>
                        <Popup>Household</Popup>
                      </Marker>
                      <Polyline positions={[[volunteerLat, volunteerLon], [delivery.household_lat, delivery.household_lon]]} color="blue" />
                    </MapContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}