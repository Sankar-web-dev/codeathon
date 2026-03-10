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
import { PlusIcon, PencilIcon, TrashIcon, HistoryIcon, UtensilsCrossedIcon, CalendarIcon, MoreVerticalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
          if (!error) setDonations(data || []);
        }
      }
      setLoading(false);
    };
    fetchDonations();
  }, []);

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
    
    if (!error) {
      toast.success('Donation updated');
      setDonations(donations.map(d => d.id === editingDonation.id ? { ...d, food_type: editFoodType, quantity: parseInt(editQuantity) } : d));
      setEditingDonation(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('donations').delete().eq('id', deleteConfirm);
    if (!error) {
      toast.success('Donation deleted');
      setDonations(donations.filter(d => d.id !== deleteConfirm));
    }
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Syncing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <HistoryIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Donation Ledger</h1>
            </div>
            <p className="text-slate-500 font-medium ml-12">Monitor and manage your active food contributions.</p>
          </motion.div>
          
          <Button 
            onClick={() => router.push('/post-food/create')}
            className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Donation
          </Button>
        </div>

        {/* --- MAIN CONTENT CARD --- */}
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-0">
            {donations.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossedIcon className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No active donations</h3>
                <p className="text-slate-500">Your rescue history will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none">
                      <TableHead className="py-5 pl-8 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Type</TableHead>
                      <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Quantity</TableHead>
                      <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</TableHead>
                      <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Date</TableHead>
                      <TableHead className="pr-8 text-right font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {donations.map((donation, index) => (
                        <motion.tr 
                          key={donation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group border-b border-slate-50 hover:bg-emerald-50/30 transition-colors"
                        >
                          <TableCell className="py-5 pl-8">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                {donation.food_type.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-700">{donation.food_type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-slate-600">{donation.quantity} kg</TableCell>
                          <TableCell>
                            <StatusBadge status={donation.status} />
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              {new Date(donation.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="pr-8 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-md" onClick={() => setEditingDonation(donation)}>
                                <PencilIcon className="w-4 h-4 text-slate-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600" onClick={() => setDeleteConfirm(donation.id)}>
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- DIALOGS (Styled) --- */}
        <Dialog open={!!editingDonation} onOpenChange={() => setEditingDonation(null)}>
          <DialogContent className="rounded-[32px] border-none shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Update Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Food Classification</Label>
                <Input value={editFoodType} onChange={(e) => setEditFoodType(e.target.value)} className="h-12 rounded-xl bg-slate-50 border-none" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Quantity (Units)</Label>
                <Input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} className="h-12 rounded-xl bg-slate-50 border-none" required />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 font-bold">Commit Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="rounded-[32px] border-none p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-slate-500 py-4">Are you sure? This will permanently remove this entry from the rescue ledger. This action cannot be undone.</p>
            <DialogFooter className="gap-3">
              <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" className="rounded-xl font-bold bg-rose-500" onClick={handleDelete}>Delete Permanently</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    claimed: "bg-blue-100 text-blue-700 border-blue-200",
    default: "bg-slate-100 text-slate-700 border-slate-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${styles[status] || styles.default}`}>
      {status}
    </span>
  );
}