'use client';

import { Briefcase } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-20 text-center">
      <div className="mb-8">
        <Briefcase className="w-20 h-20 mx-auto mb-6 text-blue-400" />
      </div>
      <h1 className="text-5xl font-bold mb-6">Job Application Tracker</h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
        Streamline your job search with our free application tracking system.
      </p>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Stay organized, never miss a follow-up, and land your dream job faster.
      </p>
    </section>
  );
}
