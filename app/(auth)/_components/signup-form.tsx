'use client';

import { useState } from 'react';
import { useSignup } from '../_query/auth.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, UserIcon, ShieldCheckIcon, MapPinIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

const MapSelector = dynamic(() => import('@/app/(dashboard)/donor/_components/maps'), { ssr: false });

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'volunteer'>('volunteer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const signupMutation = useSignup();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (role === 'donor' && (!name || !phone)) {
      toast.error('Name and phone are required for donors');
      return;
    }
    signupMutation.mutate({ email, password }, {
      onSuccess: async () => {
        toast.success('Signup successful!');
        const supabase = createSupabaseClient();
        const table = role === 'donor' ? 'donors' : 'volunteers';
        
        const { error } = await supabase.from(table).insert({
          name,
          phone,
          email,
          lat: location?.lat || null,
          lon: location?.lon || null,
        });

        if (error) {
          console.error(`Error inserting ${role}:`, error);
          toast.error(`Signup successful but failed to register as ${role}`);
        }
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error(`Signup failed: ${error.message}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden font-sans">
      {/* Left Side: Branding/Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/20 to-blue-600/20"></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block p-4 rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-500/50"
          >
            <HeartIcon className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Join the <span className="text-emerald-400">Zero Hunger</span> Revolution.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Your location helps us find the most efficient route to deliver fresh food to those who need it most.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="text-white font-bold">Secure</h4>
              <p className="text-slate-400 text-sm">Enterprise-grade data protection.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPinIcon className="w-6 h-6 text-blue-400 mb-2" />
              <h4 className="text-white font-bold">Local</h4>
              <p className="text-slate-400 text-sm">Real-time matching in your city.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/50 overflow-y-auto">
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 mb-8 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to home
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
            <p className="text-slate-500 mt-2">Enter your details to start making an impact.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Switcher (Premium Look) */}
            <div className="bg-slate-200/50 p-1 rounded-xl flex gap-1 mb-6">
              <button
                type="button"
                onClick={() => setRole('volunteer')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'volunteer' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'donor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Donor
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 h-12 bg-white border-slate-200 focus:ring-emerald-500 rounded-xl"
                  />
                  <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password text-slate-700 font-semibold">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-white border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword text-slate-700 font-semibold">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 bg-white border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone text-slate-700 font-semibold">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-12 bg-white border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-emerald-500" /> Set Primary Location
                </Label>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <MapSelector setLocation={setLocation} />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={signupMutation.isPending} 
              className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
            >
              {signupMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                  Creating Account...
                </span>
              ) : 'Get Started'}
            </Button>
          </form>

          <div className="mt-8 text-center text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}