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
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChartIcon, MapIcon, PackageIcon, UsersIcon } from "lucide-react"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createSupabaseClient } from "@/lib/supabase"
import UploadExcel from "@/components/upload-excel"

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

  // Fake data for analytics
  const pieData = [
    { name: 'Fruits', value: 40, color: '#FF6384' },
    { name: 'Vegetables', value: 30, color: '#36A2EB' },
    { name: 'Grains', value: 20, color: '#FFCE56' },
    { name: 'Dairy', value: 10, color: '#4BC0C0' },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Food Rescue Network
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-8 p-8 pt-0">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Food Rescue Network</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Connecting donors with volunteers to reduce food waste and help those in need. View your analytics and manage your contributions.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <PieChartIcon className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">150 kg</div>
              <p className="text-xs opacity-90">+20% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Food</CardTitle>
              <PackageIcon className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45 items</div>
              <p className="text-xs opacity-90">Ready for pickup</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <MapIcon className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs opacity-90">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Donation Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Donations Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="donations" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {isDonor && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
            <CardHeader>
              <CardTitle>Your Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You have donated 25 kg of food this month. Dummy data for donor-specific view.</p>
            </CardContent>
          </Card>
        )}
        {/* <UploadExcel /> */}
      </div>
    </div>
  )
}
