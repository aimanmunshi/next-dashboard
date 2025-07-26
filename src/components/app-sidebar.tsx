"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserData } from "@/lib/firestore-helpers"; // make sure this path is correct

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const teams = [
  { name: "Team A", logo: GalleryVerticalEnd, plan: "Enterprise" },
  { name: "Team B", logo: AudioWaveform, plan: "Startup" },
  { name: "Team C", logo: Command, plan: "Free" },
];

const navMain = [
  {
    title: "Service A",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [{ title: "Option 1", url: "#" }, { title: "Option 2", url: "#" }],
  },
  {
    title: "Service B",
    url: "#",
    icon: Bot,
    items: [{ title: "Option 1", url: "#" }, { title: "Option 2", url: "#" }],
  },
  {
    title: "Service C",
    url: "#",
    icon: BookOpen,
    items: [{ title: "Option 1", url: "#" }, { title: "Option 2", url: "#" }],
  },
  {
    title: "Service D",
    url: "#",
    icon: Settings2,
    items: [{ title: "Option 1", url: "#" }, { title: "Option 2", url: "#" }],
  },
];

const projects = [
  { name: "Project A", url: "#", icon: Frame },
  { name: "Project B", url: "#", icon: PieChart },
  { name: "Project C", url: "#", icon: Map },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserData(user.uid);
        setUserData({
          name: data?.name || "User",
          email: data?.email || "Email",
          avatar: user.photoURL || "https://github.com/shadcn.png",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
