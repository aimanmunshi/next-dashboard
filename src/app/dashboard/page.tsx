"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import { KpiCard } from "@/components/ui/kpi-card";
import { Folder, Wrench, Clock } from "lucide-react";
import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function Page() {
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Prefer displayName, fallback to email
        setUserName(user.displayName || user.email?.split("@")[0] || "User")
      }
    })
    return () => unsubscribe()
  }, [])
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          {/* Left: Sidebar + Breadcrumb */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right: Mode Toggle */}
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here’s a quick overview of your dashboard
          </p>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <KpiCard title="" value="" icon={null} subtext="" />
            <KpiCard title="" value="" icon={null} subtext="" />
            <KpiCard title="" value="" icon={null} subtext="" />
          </div>
          {/* Main Analytics Panel */}
          <div className="bg-muted/50 min-h-[470px] rounded-xl" />

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
