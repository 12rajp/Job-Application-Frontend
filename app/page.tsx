'use client';

import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import Features from "@/components/landing/Features";
import WhyChoose from "@/components/landing/WhyChoose";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />
      <HeroSection />
      <Features />
      <WhyChoose />
    </div>
  );
}
