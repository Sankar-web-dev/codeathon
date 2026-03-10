'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon, ShoppingBasketIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        toast.error('Failed to post donations');
      } else {
        toast.success('Donations posted successfully!');
        setItems([{ food_type: '', quantity: '' }]);
        router.push('/post-food');
      }
    } catch (error) {
      toast.error('An error occurred while posting donations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
            <ShoppingBasketIcon className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Post Donation</h1>
          <p className="text-slate-500 font-medium mt-2 text-center">
            List surplus food items to connect with local volunteers instantly.
          </p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">Donation Manifest</CardTitle>
                <CardDescription>Specify the items you are ready to give</CardDescription>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="group relative flex items-end gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50"
                  >
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest ml-1">Type of Food</Label>
                      <Input
                        type="text"
                        value={item.food_type}
                        onChange={(e) => updateItem(index, 'food_type', e.target.value)}
                        placeholder="e.g. Fresh Apples"
                        className="h-12 bg-white border-slate-200 rounded-xl focus:ring-emerald-500"
                        required
                      />
                    </div>
                    
                    <div className="w-24 md:w-32 space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest ml-1">Qty (kg)</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        placeholder="0"
                        min="1"
                        className="h-12 bg-white border-slate-200 rounded-xl focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {items.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        className="h-12 w-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="pt-2 space-y-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addItem} 
                  className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-bold"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Another Food Item
                </Button>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-16 rounded-[24px] bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold shadow-2xl shadow-slate-200 flex gap-3 active:scale-[0.98] transition-all"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Publishing to Network...
                    </div>
                  ) : (
                    <>
                      <SparklesIcon className="w-6 h-6 text-emerald-400" />
                      Broadcast Donation
                      <ArrowRightIcon className="w-5 h-5 opacity-50" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}