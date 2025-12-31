"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login, loading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      return;
    }

    await login({ identifier, password });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email or username below to login
          </p>
        </div>
        
        <Field>
          <FieldLabel htmlFor="identifier">Email or Username</FieldLabel>
          <Input 
            id="identifier" 
            type="text" 
            placeholder="m@example.com or username" 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required 
          />
        </Field>
        
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
            >
              Forgot your password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            placeholder="Min 6 Character"
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading} className="w-full cursor-pointer">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline underline-offset-4 cursor-pointer">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
 