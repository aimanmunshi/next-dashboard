"use client";

import { ForgotForm } from "@/components/forgot-form";
import Pattern from "@/components/pattern"; // Make sure the path is correct

export default function ForgotPage() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <Pattern />
      </div>

      {/* Forgot Password Form */}
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm z-10">
          <ForgotForm />
        </div>
      </div>
    </div>
  );
}
