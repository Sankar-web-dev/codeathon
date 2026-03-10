"use client"

import * as XLSX from "xlsx"
import { useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UploadIcon } from "lucide-react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from "recharts"
import { useRouter } from "next/navigation"
type HouseholdData = {
  household_id: string | number
  village_id: string | number
  family_size: number
  lat: number
  lon: number
  [key: string]: any // For additional columns
}

export default function UploadExcel() {
  const [data, setData] = useState<HouseholdData[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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
        alert("Error parsing Excel file")
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      

      const result = await response.json()
      if (Array.isArray(result)) {
      for (const item of result) {
        const { error } = await supabase.from("households").insert({
          household_id: item.household_id.toString(),
          village_id: item.village_id.toString(),
          family_size: item.family_size,
          lat: item.lat,
          lon: item.lon,
          priority_level: item.priority_level,
          hunger_probability: item.hunger_probability,
        });
        if (error) {
          console.error("Error inserting:", error);
        }
      }
      router.push("/households");
    } else {
      console.log("Result is not array:", result);
      alert("Unexpected response format");
    }
      console.log("Prediction result:", JSON.stringify(result, null, 2))
      
    } catch (error) {
      console.error("Error sending to backend:", error)
      alert("Error sending data to backend")
    } finally {
      setLoading(false)
    }
  }

  const familySizeDistribution = () => {
    const familySizes = data.map((row) => row.family_size)
    const uniqueFamilySizes = [...new Set(familySizes)]
    const distribution = uniqueFamilySizes.map((size) => ({
      name: `Family Size ${size}`,
      value: familySizes.filter((s) => s === size).length,
    }))
    return distribution
  }

  const villageDistribution = () => {
    const villages = data.map((row) => row.village_id)
    const uniqueVillages = [...new Set(villages)]
    const distribution = uniqueVillages.map((village) => ({
      name: `Village ${village}`,
      value: villages.filter((v) => v === village).length,
    }))
    return distribution
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadIcon className="h-5 w-5" />
          Upload Household Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {loading && <p>Processing...</p>}
          {data.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Households</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Family Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(data.reduce((sum, row) => sum + row.family_size, 0) / data.length).toFixed(1)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Villages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{new Set(data.map(row => row.village_id)).size}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Family Size Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={familySizeDistribution()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Households by Village</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={villageDistribution()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => {
                            if (!name || percent === undefined) return '';
                            return `${name} ${(percent * 100).toFixed(0)}%`;
                          }}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {villageDistribution().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              <Button onClick={sendToBackend} disabled={loading} className="w-full">
                {loading ? "Predicting..." : "Predict Hunger Risk"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

