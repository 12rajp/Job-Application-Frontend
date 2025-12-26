"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Navbar() {
  return (
     <nav className="bg-linear-to-r from-blue-600 to-purple-600 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
     <Link href="/dashboard" className="flex items-center gap-3 text-2xl font-bold text-white">
        <Briefcase className="w-8 h-8 text-white" />
        Job Tracker
      </Link>
    </nav>
  );
}
