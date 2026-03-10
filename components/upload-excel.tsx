"use client"

import * as XLSX from "xlsx"
import { useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  UploadIcon, FileSpreadsheetIcon, BarChart3Icon, 
  PieChartIcon, UsersIcon, BrainCircuitIcon, DatabaseIcon,
  CheckCircle2Icon
} from "lucide-react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from "recharts"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type HouseholdData = {
  household_id: string | number
  village_id: string | number
  family_size: number
  lat: number
  lon: number
  [key: string]: any 
}

export default function UploadExcel() {
  const [data, setData] = useState<HouseholdData[]>([])
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet)
        setData(jsonData as HouseholdData[])
      } catch (error) {
        console.error("Error parsing Excel:", error)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsBinaryString(file)
  }

  const sendToBackend = async () => {
    if (data.length === 0) return
    setLoading(true)
    try {
      const supabase = createSupabaseClient()
      const response = await fetch("http://10.154.202.78:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      if (Array.isArray(result)) {
        for (const item of result) {
          await supabase.from("households").insert({
            household_id: item.household_id.toString(),
            village_id: item.village_id.toString(),
            family_size: item.family_size,
            lat: item.lat,
            lon: item.lon,
            priority_level: item.priority_level,
            hunger_probability: item.hunger_probability,
          });
        }
        router.push("/households");
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const familySizeDistribution = () => {
    const familySizes = data.map((row) => row.family_size)
    const uniqueFamilySizes = [...new Set(familySizes)]
    return uniqueFamilySizes.map((size) => ({
      name: `Size ${size}`,
      value: familySizes.filter((s) => s === size).length,
    }))
  }

  const villageDistribution = () => {
    const villages = data.map((row) => row.village_id)
    const uniqueVillages = [...new Set(villages)]
    return uniqueVillages.map((village) => ({
      name: `V-${village}`,
      value: villages.filter((v) => v === village).length,
    }))
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Data Ingestion</h1>
            <p className="text-slate-500 font-medium">Upload datasets for AI-driven hunger risk assessment.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-2 bg-emerald-100 rounded-lg"><DatabaseIcon className="w-5 h-5 text-emerald-600" /></div>
            <div className="pr-4"><p className="text-xs text-slate-400 font-bold uppercase">System Status</p><p className="text-sm font-bold text-slate-700">Ready for Sync</p></div>
          </div>
        </div>

        {/* Upload Area */}
        <Card className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 rounded-[32px] ${data.length > 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-emerald-400'}`}>
          <CardContent className="p-12">
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
              <AnimatePresence mode="wait">
                {data.length === 0 ? (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <UploadIcon className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-xl font-bold text-slate-800">Drop your dataset here</p>
                    <p className="text-slate-400 mt-2 font-medium">Support for .xlsx and .csv formats</p>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                      <CheckCircle2Icon className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-xl font-bold text-emerald-800">Dataset Loaded Successfully</p>
                    <p className="text-emerald-600/70 mt-2 font-medium">{data.length} households parsed</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </label>
          </CardContent>
        </Card>

        {data.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Target Households" value={data.length} icon={<UsersIcon />} color="bg-blue-500" />
              <StatCard title="Avg Family Size" value={(data.reduce((s, r) => s + r.family_size, 0) / data.length).toFixed(1)} icon={<BarChart3Icon />} color="bg-emerald-500" />
              <StatCard title="Villages Covered" value={new Set(data.map(r => r.village_id)).size} icon={<PieChartIcon />} color="bg-violet-500" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartWrapper title="Family Demographics" subtitle="Distribution by member count">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={familySizeDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="Geographic Density" subtitle="Households across sectors">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={villageDistribution()} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                      {villageDistribution().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            {/* Action Button */}
            <Button 
              onClick={sendToBackend} 
              disabled={loading}
              className="w-full h-16 rounded-[24px] bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold shadow-2xl shadow-slate-200 flex gap-3 active:scale-[0.99] transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Running Neural Assessment...
                </div>
              ) : (
                <>
                  <BrainCircuitIcon className="w-6 h-6 text-emerald-400" />
                  Execute ML Prediction Model
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-black text-slate-800">{value}</p>
          </div>
          <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-opacity-20 transition-transform group-hover:scale-110`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ChartWrapper({ title, subtitle, children }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-[32px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">{title}</CardTitle>
        <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}