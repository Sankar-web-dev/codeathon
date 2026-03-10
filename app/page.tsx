'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon, MapPinIcon, TruckIcon, UsersIcon, LeafIcon, GlobeIcon, TrendingUpIcon, AwardIcon, StarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const [mealsRescued, setMealsRescued] = useState(0);
  const [activeDonors, setActiveDonors] = useState(0);
  const [livesImpacted, setLivesImpacted] = useState(0);
  const [foodWasteReduced, setFoodWasteReduced] = useState(0);

  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
      const increment = end / (duration / 50);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 50);
    };

    animateValue(0, 10000, 2000, setMealsRescued);
    animateValue(0, 500, 2000, setActiveDonors);
    animateValue(0, 1200, 2000, setLivesImpacted);
    animateValue(0, 5, 2000, setFoodWasteReduced);
  }, []);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-100 overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-yellow-400/25 to-orange-500/25 rounded-full blur-xl animate-spin-slow delay-700"></div>
        <div className="absolute bottom-1/4 right-1/2 w-56 h-56 bg-gradient-to-r from-teal-400/30 to-green-500/30 rounded-full blur-2xl animate-pulse delay-1200"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 animate-pulse"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6 animate-bounce">
              <GlobeIcon className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in">
              Zero Hunger Network
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-300">
              Revolutionizing food rescue through sustainable technology. Connecting surplus food with communities in need, reducing waste and fighting hunger one meal at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-500">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
                  <HeartIcon className="mr-2 h-5 w-5 animate-pulse" />
                  Join as Donor
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
                  <UsersIcon className="mr-2 h-5 w-5 animate-pulse" />
                  Join as Volunteer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-spin-slow">
                <TrendingUpIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 animate-count">{mealsRescued.toLocaleString()}+</div>
              <p className="text-gray-600">Meals Rescued</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-spin-slow">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 animate-count">{activeDonors.toLocaleString()}+</div>
              <p className="text-gray-600">Active Donors</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-spin-slow">
                <AwardIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 animate-count">{livesImpacted.toLocaleString()}+</div>
              <p className="text-gray-600">Lives Impacted</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-spin-slow">
                <LeafIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 animate-count">{foodWasteReduced} Tons</div>
              <p className="text-gray-600">Food Waste Reduced</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 animate-fade-in">
            Sustainable Solutions for Food Security
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto animate-fade-in delay-300">
            Our platform leverages technology to create a circular economy for food, ensuring no edible surplus goes to waste.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 hover:border-green-200 animate-fade-in">
              <CardHeader className="text-center pb-4">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Smart Mapping</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Real-time location tracking connects donors with nearby receivers for efficient food rescue operations.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 hover:border-blue-200 animate-fade-in delay-200">
              <CardHeader className="text-center pb-4">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <TruckIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Logistics Optimization</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  AI-powered routing ensures food reaches its destination fresh and safe, maximizing nutritional value.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 hover:border-purple-200 animate-fade-in delay-400">
              <CardHeader className="text-center pb-4">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Community Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Building stronger communities by fostering collaboration between businesses and social organizations.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 hover:border-orange-200 animate-fade-in delay-600">
              <CardHeader className="text-center pb-4">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <LeafIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Environmental Benefits</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Reducing greenhouse gas emissions by diverting food waste from landfills to human consumption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 animate-fade-in">
            Success Stories
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto animate-fade-in delay-300">
            Hear from our community members who are making a difference.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Zero Hunger Network has transformed how we handle surplus food at our restaurant. We've rescued over 500 meals this month alone!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Rajesh Kumar</p>
                    <p className="text-sm text-gray-600">Restaurant Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "As a volunteer, I've seen firsthand how this platform connects generosity with need. It's truly making a difference in our community."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">P</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Priya Sharma</p>
                    <p className="text-sm text-gray-600">Community Volunteer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-400">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The NGO I work with now receives fresh food regularly. This platform has helped us serve 200 more families each week."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Amit Singh</p>
                    <p className="text-sm text-gray-600">NGO Coordinator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 animate-fade-in">
            The Zero Hunger Process
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto animate-fade-in delay-300">
            Our streamlined approach ensures food reaches those who need it most, efficiently and safely.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-110 transition-transform duration-500 animate-fade-in">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <div className="text-3xl animate-bounce">🏪</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">1. Food Posted</h3>
              <p className="text-gray-600">
                Donors list surplus food with detailed information about quantity and pickup requirements.
              </p>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-500 animate-fade-in delay-200">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <div className="text-3xl animate-bounce delay-200">📱</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">2. Smart Matching</h3>
              <p className="text-gray-600">
                Our platform automatically matches donors with nearby receivers based on location and needs.
              </p>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-500 animate-fade-in delay-400">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <div className="text-3xl animate-bounce delay-400">🚴</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">3. Efficient Pickup</h3>
              <p className="text-gray-600">
                Trained volunteers coordinate pickup times to ensure food quality and safety standards.
              </p>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-500 animate-fade-in delay-600">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <div className="text-3xl animate-bounce delay-600">🍲</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">4. Lives Nourished</h3>
              <p className="text-gray-600">
                Fresh, nutritious food reaches communities in need, combating hunger and malnutrition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">
            Join the Movement Towards Zero Hunger
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in delay-300">
            Be part of a sustainable future where no food goes to waste and every person has access to nutritious meals.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-2xl animate-pulse">
              <GlobeIcon className="mr-2 h-5 w-5" />
              Start Making a Difference
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center mb-4">
                <GlobeIcon className="h-8 w-8 text-green-400 mr-2 animate-spin-slow" />
                <span className="text-xl font-bold">Zero Hunger Network</span>
              </div>
              <p className="text-gray-400">
                Fighting food waste and hunger through innovative technology and community collaboration.
              </p>
            </div>
            <div className="animate-fade-in delay-200">
              <h3 className="text-lg font-semibold mb-4">For Donors</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">How to Donate</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Donor Benefits</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in delay-400">
              <h3 className="text-lg font-semibold mb-4">For Receivers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">How to Receive</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Partner Organizations</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Impact Reports</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in delay-600">
              <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Volunteer</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 animate-fade-in delay-700">
              &copy; 2024 Zero Hunger Network. Building a sustainable future, one meal at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
