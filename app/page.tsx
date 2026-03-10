'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HeartIcon, MapPinIcon, TruckIcon, UsersIcon, LeafIcon, 
  GlobeIcon, TrendingUpIcon, AwardIcon, StarIcon, ArrowRightIcon 
} from "lucide-react";
import Navbar from "@/components/navbar";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Progress Bar for "Wow" Factor */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50" style={{ scaleX }} />
      
      <Navbar />
      
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-100">
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Animated Mesh Gradient Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-[120px] animate-pulse delay-700" />
          </div>

          <div className="container mx-auto px-6 text-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live: 1,200+ meals rescued today
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
                Feed <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">People</span>, <br />
                Not <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Landfills</span>.
              </motion.h1>

              <motion.p variants={fadeIn} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                The world's most advanced circular food economy platform. 
                Using AI to bridge the gap between surplus and scarcity.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-10 text-lg rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1">
                    Become a Donor <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-2xl border-2 hover:bg-slate-50 transition-all">
                    Volunteer Locally
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- STATS SECTION (Glassmorphism) --- */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Meals Rescued", value: "12,400+", icon: TrendingUpIcon, color: "text-emerald-600" },
                { label: "Active Donors", value: "850+", icon: UsersIcon, color: "text-blue-600" },
                { label: "Lives Impacted", value: "45k+", icon: HeartIcon, color: "text-rose-600" },
                { label: "CO2 Saved", value: "12 Tons", icon: LeafIcon, color: "text-teal-600" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-3xl bg-white/60 backdrop-blur-md border border-white shadow-sm flex flex-col items-center text-center"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color} mb-3`} />
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURE SECTION (Winning Cards) --- */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold mb-4">Our Technology</h2>
                <p className="text-lg text-slate-600">We don't just move food; we optimize the entire rescue lifecycle with proprietary logistics and smart-matching AI.</p>
              </div>
              <Button variant="ghost" className="text-emerald-600 font-bold hover:bg-emerald-50">
                View Tech Stack <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<MapPinIcon className="w-6 h-6" />}
                title="Hyper-Local Dispatch"
                desc="Real-time geographic matching ensures food travels less than 5 miles on average."
                color="bg-emerald-500"
              />
              <FeatureCard 
                icon={<TruckIcon className="w-6 h-6" />}
                title="Cold-Chain Tracking"
                desc="IoT integration to monitor temperature and food safety during every second of transport."
                color="bg-blue-500"
              />
              <FeatureCard 
                icon={<UsersIcon className="w-6 h-6" />}
                title="Impact Analytics"
                desc="Detailed ESG reporting for businesses to track their contribution to UN Zero Hunger goals."
                color="bg-purple-500"
              />
            </div>
          </div>
        </section>

        {/* --- INTERACTIVE CTA SECTION --- */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="relative rounded-[40px] bg-slate-900 p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/20 to-transparent" />
              
              <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to shrink your waste footprint?</h2>
                  <p className="text-slate-400 text-lg mb-8">Join the network that's redefining what's possible in the fight against hunger. Setup takes less than 3 minutes.</p>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-14 px-8 rounded-xl text-lg font-bold">
                    Start Rescuing Now
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 text-3xl font-bold">98%<span className="text-xs text-slate-500 ml-1">Efficiency</span></div>
                    <div className="h-48 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-white text-xl font-medium text-center p-4 italic">"The Uber for food rescue."</div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="h-48 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-center p-4">Trusted by 50+ Enterprises</div>
                    <div className="h-32 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-3xl font-bold">24/7<span className="text-xs text-slate-500 ml-1">Ops</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

// Sub-component for clean code
function FeatureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500"
    >
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>
      <div className="h-1.5 w-12 bg-slate-200 rounded-full group-hover:w-full group-hover:bg-emerald-500 transition-all duration-500" />
    </motion.div>
  );
}