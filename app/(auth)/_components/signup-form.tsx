'use client';

import { useState } from 'react';
import { useSignup } from '../_query/auth.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const MapSelector = dynamic(() => import('@/app/(dashboard)/donor/_components/maps'), { ssr: false });

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'volunteer'>('volunteer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<{lat: number; lon: number} | null>(null);
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
        if (role === 'donor') {
          const supabase = createSupabaseClient();
          const { error } = await supabase.from('donors').insert({
            name,
            phone,
            email,
            lat: location?.lat || null,
            lon: location?.lon || null,
          });
          if (error) {
            console.error('Error inserting donor:', error);
            toast.error('Signup successful but failed to register as donor');
          }
        } else if (role === 'volunteer') {
          const supabase = createSupabaseClient();
          const { error } = await supabase.from('volunteers').insert({
            name,
            phone,
            email,
            lat: location?.lat || null,
            lon: location?.lon || null,
          });
          if (error) {
            console.error('Error inserting volunteer:', error);
            toast.error('Signup successful but failed to register as volunteer');
          }
        }
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error(`Signup failed: ${error.message}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">Create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label>Role</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="volunteer"
                    checked={role === 'volunteer'}
                    onChange={(e) => setRole(e.target.value as 'volunteer')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-900">Volunteer</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="donor"
                    checked={role === 'donor'}
                    onChange={(e) => setRole(e.target.value as 'donor')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-900">Donor</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <MapSelector setLocation={setLocation} />
            </div>
            <Button type="submit" disabled={signupMutation.isPending} className="w-full">
              {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
          <div className="text-center">
            <a href="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Log in</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}