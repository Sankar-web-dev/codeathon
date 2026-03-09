"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const allowedPaths = ["/", "/login", "/signup"];

  if (!allowedPaths.includes(pathname)) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Food Rescue Network
          </Link>
          
          <div className="flex space-x-4">
            <Link href="/login">
              <button className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
