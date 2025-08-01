"use client";
import { SignupForm } from "@/components/signup-form";
import Pattern from "@/components/pattern"; // adjust path if needed

export default function SignupPage() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <Pattern />
      </div>

      {/* Signup Form */}
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm z-10">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
