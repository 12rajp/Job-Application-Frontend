"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field,FieldDescription,FieldGroup,FieldLabel,} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to send reset email");
        return;
      }

      toast.success(data.message || "Password reset link sent to your email!");
      setSuccess(true);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Forgot password error:", err);
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
              <h1 className="text-2xl font-bold">Reset your password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email address and we&apos;ll send you a link to reset
                your password
              </p>
            </div>

            {!success ? (
              <>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                </Field>
              </>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                <p className="font-medium mb-1">Check your email!</p>
                <p>We&apos;ve sent a password reset link to {email}</p>
              </div>
            )}

            <FieldDescription className="text-center">
              Remember your password?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Back to login
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
