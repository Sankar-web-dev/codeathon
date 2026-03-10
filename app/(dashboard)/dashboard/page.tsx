'use client';

import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  PieChartIcon, MapIcon, PackageIcon, 
  TrendingUpIcon, SparklesIcon, ActivityIcon,
  LayoutDashboardIcon
} from "lucide-react"
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { createSupabaseClient } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function Page() {
  const [isDonor, setIsDonor] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: donor } = await supabase.from('donors').select('id').eq('email', user.email).single();
        setIsDonor(!!donor);
      }
    };
    fetchUserType();
  }, []);

  const pieData = [
    { name: 'Fruits', value: 40, color: '#10b981' },
    { name: 'Vegetables', value: 30, color: '#3b82f6' },
    { name: 'Grains', value: 20, color: '#8b5cf6' },
    { name: 'Dairy', value: 10, color: '#f59e0b' },
  ];

  const lineData = [
    { month: 'Jan', donations: 20 },
    { month: 'Feb', donations: 35 },
    { month: 'Mar', donations: 50 },
    { month: 'Apr', donations: 45 },
    { month: 'May', donations: 60 },
    { month: 'Jun', donations: 75 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* --- PRESTIGE HEADER --- */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger className="hover:bg-slate-100 rounded-lg" />
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-2 font-medium">
                  <LayoutDashboardIcon className="w-4 h-4" /> ZeroHunger
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-slate-900">Operations Center</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-10">
        
        {/* --- WELCOME BANNER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[32px] bg-slate-900 p-10 text-white shadow-2xl shadow-slate-200"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/20 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                <SparklesIcon className="w-3 h-3" /> System Live
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Operations Center</h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl">
                Real-time overview of the <span className="text-white">ZeroHunger Network</span>. Managing logistics and community impact.
              </p>
            </div>
            <div className="flex gap-4">
               <div className="text-center bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Impact Level</p>
                  <p className="text-2xl font-black text-emerald-400 italic">GOLD</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Network Weight" value="150 kg" change="+22%" icon={<TrendingUpIcon />} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Active Inventory" value="45 Units" change="Ready" icon={<PackageIcon />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard title="Claim Pipeline" value="12" change="Urgent" icon={<ActivityIcon />} color="text-violet-600" bg="bg-violet-50" />
        </div>

        {/* --- ANALYTICS --- */}
        <div className="grid gap-8 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="lg:col-span-4 border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold text-slate-800">Rescue Velocity</CardTitle>
              <p className="text-sm text-slate-400 font-medium">Monthly donation throughput (kg)</p>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={lineData}>
                  <defs>
                    <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} 
                  />
                  <Area type="monotone" dataKey="donations" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorDon)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Side Chart */}
          <Card className="lg:col-span-3 border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold text-slate-800">Nutritional Mix</CardTitle>
              <p className="text-sm text-slate-400 font-medium">Category distribution percentage</p>
            </CardHeader>
            <CardContent className="p-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs font-bold text-slate-600 uppercase">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- DONOR SPECIFIC UI --- */}
        {isDonor && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[32px] bg-gradient-to-br from-emerald-500 to-teal-600 p-1 shadow-xl shadow-emerald-200"
          >
            <div className="bg-white rounded-[28px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className="p-4 bg-emerald-100 rounded-2xl">
                  <HeartIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your Donor Impact</h3>
                  <p className="text-slate-500 font-medium">You’ve diverted <span className="text-emerald-600 font-bold">25 kg</span> of waste this month alone.</p>
                </div>
              </div>
              <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95">
                New Donation
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden group hover:shadow-xl hover:shadow-slate-200 transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div className={`p-4 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110`}>
            {icon}
          </div>
          <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
            {change}
          </span>
        </div>
        <div className="mt-6">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function HeartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  )
}