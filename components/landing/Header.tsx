"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SignupModal";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="w-8 h-8" />
          <span className="text-xl font-bold">Job Tracker</span>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Button>
          <Button
            onClick={() => setIsSignupOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
}
