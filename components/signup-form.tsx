"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const { signup, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const res = await signup({ user_name: username, email, password });

    if (res.success) {
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)} 
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center mb-2">
          <h1 className="text-xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-xs">
            Fill in the form below to create your account
          </p>
        </div>
        
        <Field>
          <FieldLabel htmlFor="name">Username</FieldLabel>
          <Input 
            id="name" 
            type="text" 
            placeholder="John Doe" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </Field>
        
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input 
            id="password" 
            type="password" 
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input 
            id="confirm-password" 
            type="password" 
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading} className="w-full cursor-pointer">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>
        
        <FieldDescription className="text-center text-sm">
          Already have an account? <a href="/login" className="underline cursor-pointer">Sign in</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
