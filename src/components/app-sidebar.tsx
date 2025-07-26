"use client"

import * as React from "react"
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
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Team A",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Team B",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Team C",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Service A",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Option 1",
          url: "#",
        },
        {
          title: "Option 2",
          url: "#",
        },
        {
          title: "Option 3",
          url: "#",
        },
      ],
    },
    {
      title: "Service B",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Option 1",
          url: "#",
        },
        {
          title: "Option 2",
          url: "#",
        },
        {
          title: "Option 3",
          url: "#",
        },
      ],
    },
    {
      title: "Service C",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Option 1",
          url: "#",
        },
        {
          title: "Option 2",
          url: "#",
        },
        {
          title: "Option 3",
          url: "#",
        },
        {
          title: "Option 4",
          url: "#",
        },
      ],
    },
    {
      title: "Service D",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Option 1",
          url: "#",
        },
        {
          title: "Option 2",
          url: "#",
        },
        {
          title: "Option 3",
          url: "#",
        },
        {
          title: "Option 4",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Project A",
      url: "#",
      icon: Frame,
    },
    {
      name: "Project B",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Project C",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
