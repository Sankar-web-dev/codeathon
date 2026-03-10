"use client"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Household {
  id: string
  household_id: string
  village_id: string
  family_size: number | null
  lat: number | null
  lon: number | null
  num_children: number | null
  num_elderly: number | null
  monthly_income: number | null
  employment_type: number | null
  school_attendance: number | null
  meals_per_day: number | null
  government_scheme_enrolled: number | null
  malnutrition_cases: number | null
  inflation_rate: number | null
  priority_score: number | null
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
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Households</CardTitle>
      </CardHeader>
      <CardContent>
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
                <TableHead>Num Children</TableHead>
                <TableHead>Num Elderly</TableHead>
                <TableHead>Monthly Income</TableHead>
                <TableHead>Employment Type</TableHead>
                <TableHead>School Attendance</TableHead>
                <TableHead>Meals/Day</TableHead>
                <TableHead>Gov Scheme</TableHead>
                <TableHead>Malnutrition Cases</TableHead>
                <TableHead>Inflation Rate</TableHead>
                <TableHead>Priority Score</TableHead>
                <TableHead>Priority Level</TableHead>
                <TableHead>Hunger Probability</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {households.map((household) => (
                <TableRow key={household.id}>
                  <TableCell>{household.id}</TableCell>
                  <TableCell>{household.household_id}</TableCell>
                  <TableCell>{household.village_id}</TableCell>
                  <TableCell>{household.family_size}</TableCell>
                  <TableCell>{household.lat}</TableCell>
                  <TableCell>{household.lon}</TableCell>
                  <TableCell>{household.num_children}</TableCell>
                  <TableCell>{household.num_elderly}</TableCell>
                  <TableCell>{household.monthly_income}</TableCell>
                  <TableCell>{household.employment_type}</TableCell>
                  <TableCell>{household.school_attendance}</TableCell>
                  <TableCell>{household.meals_per_day}</TableCell>
                  <TableCell>{household.government_scheme_enrolled}</TableCell>
                  <TableCell>{household.malnutrition_cases}</TableCell>
                  <TableCell>{household.inflation_rate}</TableCell>
                  <TableCell>{household.priority_score}</TableCell>
                  <TableCell>{household.priority_level}</TableCell>
                  <TableCell>{household.hunger_probability}</TableCell>
                  <TableCell>{new Date(household.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
