"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GlobeIcon, SparklesIcon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const allowedPaths = ["/", "/login", "/signup"];

  if (!allowedPaths.includes(pathname)) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-6 py-3 flex justify-between items-center"
        >
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <GlobeIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Zero<span className="text-emerald-600">Hunger</span>
            </span>
          </Link>
          
          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm font-bold text-slate-600 hover:text-emerald-600 px-4 py-2 transition-all rounded-xl hover:bg-emerald-50">
                Sign In
              </button>
            </Link>
            
            <div className="h-4 w-[1px] bg-slate-200 mx-1" /> {/* Divider */}

            <Link href="/signup">
              <button className="relative group overflow-hidden bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                   Get Started
                  <SparklesIcon className="h-3.5 w-3.5 text-emerald-400" />
                </span>
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}