'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface Donation {
  id: string;
  food_type: string;
  quantity: number;
  status: string;
  created_at: string;
}

export default function PostFood() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editFoodType, setEditFoodType] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: donor } = await supabase.from('donors').select('id').eq('email', user.email).single();
        if (donor) {
          const { data, error } = await supabase
            .from('donations')
            .select('*')
            .eq('donor_id', donor.id)
            .order('created_at', { ascending: false });
          if (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load donations');
          } else {
            setDonations(data || []);
          }
        } else {
          toast.error('Donor profile not found');
        }
      } else {
        toast.error('User not authenticated');
        router.push('/login');
      }
      setLoading(false);
    };
    fetchDonations();
  }, [router]);

  useEffect(() => {
    if (editingDonation) {
      setEditFoodType(editingDonation.food_type);
      setEditQuantity(editingDonation.quantity.toString());
    }
  }, [editingDonation]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonation) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('donations').update({
      food_type: editFoodType,
      quantity: parseInt(editQuantity)
    }).eq('id', editingDonation.id);
    if (error) {
      toast.error('Failed to update donation');
    } else {
      toast.success('Donation updated');
      setDonations(donations.map(d => d.id === editingDonation.id ? { ...d, food_type: editFoodType, quantity: parseInt(editQuantity) } : d));
      setEditingDonation(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('donations').delete().eq('id', deleteConfirm);
    if (error) {
      toast.error('Failed to delete donation');
    } else {
      toast.success('Donation deleted');
      setDonations(donations.filter(d => d.id !== deleteConfirm));
    }
    setDeleteConfirm(null);
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">My Food Donations</CardTitle>
            <CardDescription className="text-center">View your posted food donations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => router.push('/post-food/create')}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Post New Donation
              </Button>
            </div>
            {donations.length === 0 ? (
              <p className="text-center text-gray-500">No donations posted yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{donation.food_type}</TableCell>
                      <TableCell>{donation.quantity}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'available' ? 'bg-green-100 text-green-800' :
                          donation.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {donation.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingDonation(donation)}>
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(donation.id)}>
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!editingDonation} onOpenChange={() => setEditingDonation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Donation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit_food_type">Food Type</Label>
                <Input id="edit_food_type" value={editFoodType} onChange={(e) => setEditFoodType(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="edit_quantity">Quantity</Label>
                <Input id="edit_quantity" type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} min="1" required />
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this donation?</p>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}