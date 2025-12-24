"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, PlusCircle, User, LogOut, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-blue-600">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Job Application Dashboard
        </Link>

        <Link href="/applications" className="hover:text-blue-500">Applications</Link>
        <Link href="/add-application" className="hover:text-blue-500">Add Application</Link>
        <Link href="/profile" className="hover:text-blue-500">Profile</Link>
        <Link href="/documents" className="hover:text-blue-500">Document</Link>
      </div>

      <Button variant="outline" onClick={() => console.log("Logout")}>
        <LogOut className="w-4 h-4 mr-1" /> Logout
      </Button>
    </nav>
  );
}
