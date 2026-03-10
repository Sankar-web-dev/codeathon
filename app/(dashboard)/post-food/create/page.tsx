'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon } from 'lucide-react';

interface DonationItem {
  food_type: string;
  quantity: string;
}

export default function PostForm() {
  const [items, setItems] = useState<DonationItem[]>([{ food_type: '', quantity: '' }]);
  const [donorId, setDonorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDonorId = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: donor } = await supabase.from('donors').select('id').eq('email', user.email).single();
        if (donor) {
          setDonorId(donor.id);
        } else {
          toast.error('Donor profile not found');
        }
      } else {
        toast.error('User not authenticated');
        router.push('/login');
      }
    };
    fetchDonorId();
  }, [router]);

  const addItem = () => {
    setItems([...items, { food_type: '', quantity: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof DonationItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorId) {
      toast.error('Donor ID not found');
      return;
    }
    const validItems = items.filter(item => item.food_type.trim() && item.quantity.trim());
    if (validItems.length === 0) {
      toast.error('Please add at least one valid item');
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseClient();
      const inserts = validItems.map(item => ({
        donor_id: donorId,
        food_type: item.food_type.trim(),
        quantity: parseInt(item.quantity.trim()),
        status: 'available'
      }));
      const { error } = await supabase.from('donations').insert(inserts);
      if (error) {
        console.error('Insert error:', error);
        toast.error('Failed to post donations');
      } else {
        toast.success('Donations posted successfully!');
        setItems([{ food_type: '', quantity: '' }]);
        router.push('/post-food');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred while posting donations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Post Food Donations</CardTitle>
          <CardDescription className="text-center">Add multiple food items for donation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-end space-x-2 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`food_type_${index}`}>Food Type</Label>
                  <Input
                    id={`food_type_${index}`}
                    type="text"
                    value={item.food_type}
                    onChange={(e) => updateItem(index, 'food_type', e.target.value)}
                    placeholder="e.g., Rice, Bread"
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                  <Input
                    id={`quantity_${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    placeholder="e.g., 10"
                    min="1"
                    required
                  />
                </div>
                {items.length > 1 && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(index)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Another Item
            </Button>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Posting...' : 'Post Donations'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}