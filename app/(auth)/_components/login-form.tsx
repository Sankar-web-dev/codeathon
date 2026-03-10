'use client';

import { useState } from 'react';
import { useLogin } from '../_query/auth.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, ArrowLeftIcon, SparklesIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }, {
      onSuccess: () => {
        toast.success('Welcome back!');
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error(`Login failed: ${error.message}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Brand Identity (Matches Signup) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-600/20 via-transparent to-emerald-600/20"></div>
        
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 inline-flex items-center gap-2 text-emerald-400 mb-8"
          >
            <SparklesIcon className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Welcome Back</span>
          </motion.div>
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Log in to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Zero Hunger</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Access your dashboard to manage rescues, track volunteers, and see your community impact in real-time.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 italic font-serif">"</div>
              <p className="text-sm italic text-slate-400">Making food security a reality for everyone, everywhere.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 mb-12 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to home
          </Link>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Login</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-white border-slate-200 focus:ring-emerald-500 rounded-xl transition-all"
                />
                <MailIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password text-slate-700 font-semibold">Password</Label>
                <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 bg-white border-slate-200 rounded-xl transition-all"
                />
                <LockIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loginMutation.isPending} 
              className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                  Verifying...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
                Create one for free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}