'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Donation {
  id: string;
  food_type: string;
  quantity: number;
  donor_lat: number;
  donor_lon: number;
  distance: number;
}

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
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
  const [volunteerLat, setVolunteerLat] = useState<number | null>(null);
  const [volunteerLon, setVolunteerLon] = useState<number | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: volunteer } = await supabase.from('volunteers').select('id, lat, lon').eq('email', user.email).single();
        if (volunteer) {
          setVolunteerId(volunteer.id);
          setVolunteerLat(volunteer.lat);
          setVolunteerLon(volunteer.lon);
          // Fetch donations
          const { data: donationsData, error: donationsError } = await supabase.from('donations').select('*').eq('status', 'available');
          if (donationsError) {
            console.error('Donations fetch error:', donationsError);
            toast.error('Failed to load donations');
          } else {
            // Fetch donors
            const donorIds = [...new Set(donationsData.map(d => d.donor_id))];
            const { data: donorsData, error: donorsError } = await supabase.from('donors').select('id, lat, lon').in('id', donorIds);
            if (donorsError) {
              console.error('Donors fetch error:', donorsError);
              toast.error('Failed to load donor locations');
            } else {
              const donorMap = donorsData.reduce((acc, d) => {
                acc[d.id] = d;
                return acc;
              }, {} as Record<string, any>);
              const nearby = donationsData.filter(d => {
                const donor = donorMap[d.donor_id];
                if (!donor || !donor.lat || !donor.lon) return false;
                const dist = haversineDistance(volunteer.lat, volunteer.lon, donor.lat, donor.lon);
                return dist < 5;
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
              setDonations(nearby);
            }
          }
        } else {
          toast.error('Volunteer profile not found');
        }
      } else {
        toast.error('User not authenticated');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAccept = async (donationId: string) => {
    if (!volunteerId) return;
    const supabase = createSupabaseClient();
    // Update donation status
    const { error: updateError } = await supabase.from('donations').update({ status: 'picked' }).eq('id', donationId);
    if (updateError) {
      toast.error('Failed to accept donation');
      return;
    }
    // Find high priority household
    const { data: households, error: householdError } = await supabase
      .from('households')
      .select('*')
      .eq('priority_level', 'HIGH')
      .order('hunger_probability', { ascending: false })
      .limit(1);
    if (householdError || !households || households.length === 0) {
      toast.error('No high priority household found');
      return;
    }
    const household = households[0];
    // Insert delivery
    const { error: insertError } = await supabase.from('deliveries').insert({
      donation_id: donationId,
      volunteer_id: volunteerId,
      household_id: household.id
    });
    if (insertError) {
      console.error('Insert error:', insertError);
      toast.error('Failed to create delivery record');
    } else {
      toast.success('Donation accepted! Check your deliveries.');
      router.push('/my-deliveries');
      // Remove from list
      setDonations(donations.filter(d => d.id !== donationId));
    }
  };

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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Nearby Donations</CardTitle>
            <CardDescription className="text-center">Available donations within 5km</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {donations.length === 0 ? (
              <p className="text-center text-gray-500">No nearby donations available.</p>
            ) : (
              donations.map((donation) => (
                <div key={donation.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{donation.food_type}</p>
                    <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                    <p className="text-sm text-gray-600">Distance: {donation.distance.toFixed(2)} km</p>
                  </div>
                  <Button onClick={() => handleAccept(donation.id)}>Accept Pickup</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}