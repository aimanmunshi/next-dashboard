"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { LoginForm } from "@/components/login-form";
import Pattern from "@/components/pattern"; // adjust path if needed

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard"); // redirect if already logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      {/* Background Pattern */}
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
