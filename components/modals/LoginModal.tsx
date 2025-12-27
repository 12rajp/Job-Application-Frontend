"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {Dialog,DialogContent,DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async () => {
    if (!identifier || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    const result = await login({ identifier, password });

    if (!result.success) {
      setMessage(result.message || "Login failed");
    } else {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        onClose();
        setIdentifier("");
        setPassword("");
        setMessage("");
      }, 500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          bg-slate-800 text-white border-slate-700
          animate-in fade-in zoom-in-95 duration-300
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={loading}
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("successful")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-28 bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2" >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Loading" : "Login"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
