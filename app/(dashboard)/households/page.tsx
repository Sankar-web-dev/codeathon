"use client"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"
import { 
  UsersIcon, 
  MapPinIcon, 
  AlertTriangleIcon, 
  SearchIcon, 
  ShieldAlertIcon,
  BrainCircuitIcon,
  FilterIcon
} from "lucide-react"

interface Household {
  id: string
  household_id: string
  village_id: string
  family_size: number | null
  lat: number | null
  lon: number | null
  priority_level: string | null
  hunger_probability: number | null
  created_at: string
}

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState<Household[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHouseholds = async () => {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from("households")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching households:", error)
      } else {
        setHouseholds(data || [])
      }
      setLoading(false)
    }

    fetchHouseholds()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
            <BrainCircuitIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
        </div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Parsing Model Data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20">
      <div className="container mx-auto p-6 lg:p-10 space-y-10">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldAlertIcon className="w-3 h-3" /> Risk Assessment Active
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Household Intelligence</h1>
            <p className="text-slate-500 font-medium mt-1">
              AI-prioritized list of households based on hunger vulnerability metrics.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Database</p>
                <p className="text-sm font-bold text-slate-700">{households.length} Profiles</p>
              </div>
              <FilterIcon className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        </div>

        {/* --- THE INTELLIGENCE TABLE --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-none">
                <TableRow className="border-none">
                  <TableHead className="py-6 pl-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Reference</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Demographics</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Geo-Location</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Risk Priority</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Probability</TableHead>
                  <TableHead className="pr-8 font-black text-slate-400 uppercase tracking-widest text-[10px] text-right">Data Ingested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {households.map((h, idx) => (
                    <motion.tr 
                      key={h.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* ID Cell */}
                      <TableCell className="py-5 pl-8">
                        <div>
                          <p className="font-bold text-slate-800">#{h.household_id}</p>
                          <p className="text-[10px] font-medium text-slate-400">UID: {h.id.slice(0,8)}</p>
                        </div>
                      </TableCell>

                      {/* Demographics Cell */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">Village {h.village_id}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <UsersIcon className="w-3 h-3" /> Size: {h.family_size}
                          </span>
                        </div>
                      </TableCell>

                      {/* Location Cell */}
                      <TableCell>
                        <div className="text-xs font-medium text-slate-500 space-y-1">
                          <p className="flex items-center gap-1"><MapPinIcon className="w-3 h-3 text-blue-400" /> {h.lat?.toFixed(4)}</p>
                          <p className="ml-4">{h.lon?.toFixed(4)}</p>
                        </div>
                      </TableCell>

                      {/* Priority Badge */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            h.priority_level === 'HIGH'
                              ? 'bg-rose-50 text-rose-600 border-rose-100'
                              : h.priority_level === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}
                        >
                          <AlertTriangleIcon className={`w-3 h-3 ${h.priority_level === 'HIGH' ? 'animate-pulse' : ''}`} />
                          {h.priority_level}
                        </span>
                      </TableCell>

                      {/* Probability Progress */}
                      <TableCell>
                        <div className="w-32 space-y-1.5">
                           <div className="flex justify-between text-[10px] font-bold text-slate-500">
                             <span>{( (h.hunger_probability || 0) * 100 ).toFixed(0)}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full ${
                                 (h.hunger_probability || 0) > 0.7 ? 'bg-rose-500' : 'bg-blue-500'
                               }`}
                               style={{ width: `${(h.hunger_probability || 0) * 100}%` }}
                             />
                           </div>
                        </div>
                      </TableCell>

                      {/* Date Cell */}
                      <TableCell className="pr-8 text-right">
                        <p className="text-xs font-bold text-slate-600">{new Date(h.created_at).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400">{new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}