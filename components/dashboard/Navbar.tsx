// "use client";

// import Link from "next/link";
// import { Briefcase } from "lucide-react";

// export function Navbar() {
//   return (
//     <nav className="bg-linear-to-r from-[#0B1D2E] to-[#1C3553] shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
//       <Link
//         href="/dashboard"
//         className="flex items-center gap-3 text-2xl font-bold text-white"
//       >
//         <Briefcase className="w-8 h-8 text-white" />
//         Job Tracker
//       </Link>
//       <div className="flex items-center gap-4">
//       </div>
//     </nav>
//   );
// }



"use client";

import Link from "next/link";
import { Briefcase, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar({ toggleSidebar }: { toggleSidebar?: () => void }) {
  return (
    <nav className="bg-linear-to-r from-[#0B1D2E] to-[#1C3553] shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 text-2xl font-bold text-white"
      >
        <Briefcase className="w-8 h-8 text-white" />
        Job Tracker
      </Link>
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-gray-700"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>
    </nav>
  );
}
