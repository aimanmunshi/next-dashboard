"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Not logged in → redirect to login page
      router.push("/login");
    } else {
      // Token found → allow access
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return <>{children}</>;
}
