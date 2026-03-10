"use client"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Households</h1>
        <p className="text-muted-foreground">
          View all household data including predictions and details.
        </p>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Household ID</TableHead>
                <TableHead>Village ID</TableHead>
                <TableHead>Family Size</TableHead>
                <TableHead>Lat</TableHead>
                <TableHead>Lon</TableHead>
                <TableHead>Priority Level</TableHead>
                <TableHead>Hunger Probability</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {households.map((household) => (
                <TableRow key={household.id}>
                  <TableCell className="font-mono text-sm">{household.id}</TableCell>
                  <TableCell>{household.household_id}</TableCell>
                  <TableCell>{household.village_id}</TableCell>
                  <TableCell>{household.family_size}</TableCell>
                  <TableCell>{household.lat}</TableCell>
                  <TableCell>{household.lon}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        household.priority_level === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : household.priority_level === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {household.priority_level}
                    </span>
                  </TableCell>
                  <TableCell>{household.hunger_probability}</TableCell>
                  <TableCell>{new Date(household.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
