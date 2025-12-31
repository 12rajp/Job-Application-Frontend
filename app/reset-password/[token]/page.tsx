"use client"

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to reset password");
        return;
      }

      toast.success(data.message || "Password reset successful!");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Set new password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your new password below
              </p>
            </div>
            
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </Field>

            <Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Resetting..." : "Reset password"}
              </Button>
            </Field>

            <FieldDescription className="text-center">
              Remember your password?{" "}
              <a href="/login" className="underline underline-offset-4">
                Back to login
              </a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
