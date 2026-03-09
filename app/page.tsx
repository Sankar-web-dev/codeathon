import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Food Rescue Network
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connecting restaurants, marriage halls, and hostels with NGOs and volunteers to redistribute surplus food instead of wasting it. Like Uber for surplus food!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Join as Donor 🍽️
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Join as Receiver 🤝
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Core Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Food Donation Post</h3>
            <p className="text-gray-600">
              Restaurants post leftover food with details like quantity, location, and pickup time.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">Live Food Map</h3>
            <p className="text-gray-600">
              View available donations near you with real-time updates.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Claim Food</h3>
            <p className="text-gray-600">
              NGOs and volunteers can easily claim pickup for available food.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Pickup Tracking</h3>
            <p className="text-gray-600">
              Track status from available to claimed, picked up, and delivered.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold mb-2">1. Donor Posts</h3>
              <p className="text-gray-600">
                Restaurants, halls, or hostels post surplus food details.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">2. Receiver Claims</h3>
              <p className="text-gray-600">
                NGOs or volunteers claim the food pickup.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🚴</div>
              <h3 className="text-xl font-semibold mb-2">3. Volunteer Picks Up</h3>
              <p className="text-gray-600">
                A volunteer collects the food from the donor.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🍲</div>
              <h3 className="text-xl font-semibold mb-2">4. Food Delivered</h3>
              <p className="text-gray-600">
                Surplus food reaches those in need, reducing waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Food Rescue Network. Fighting food waste, one meal at a time.</p>
        </div>
      </footer>
    </div>
  );
}
