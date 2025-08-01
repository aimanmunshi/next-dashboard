"use client";
import { LoginForm } from "@/components/login-form";
import Pattern from "@/components/pattern"; // adjust path as needed
import { Headphones } from "lucide-react";


export default function LoginPage() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Pattern />
      </div>

      {/* Login Card */}
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm z-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
