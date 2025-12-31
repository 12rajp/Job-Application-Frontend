'use client';

import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Briefcase className="w-7 h-7 text-blue-400" />
        <span className="text-xl font-bold">Job Tracker</span>
      </div>

      <div className="flex gap-3">
        <Button  className="cursor-pointer bg-[blue] " onClick={() => router.push("/login")}>
          Login
        </Button>

        <Button className="cursor-pointer bg-[blue]  "  onClick={() => router.push("/signup")}>
          Sign Up
        </Button>
      </div>
    </header>
  );
}
