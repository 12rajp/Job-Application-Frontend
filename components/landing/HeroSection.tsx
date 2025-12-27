'use client';

import { Briefcase } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <Briefcase className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-blue-400" />

      <h1 className="text-3xl sm:text-5xl font-bold mb-4">
        Job Application Tracker
      </h1>

      <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-3">
        Streamline your job search with our free application tracking system.
      </p>

      <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
        Stay organized, never miss a follow-up, and land your dream job faster.
      </p>
    </section>
  );
}
