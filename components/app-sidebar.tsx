"use client"

import * as React from "react"

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
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, UploadIcon } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"

// This is sample data.
const data = {
  teams: [
    {
      name: "Food Rescue Network",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Community",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <FrameIcon />,
    },
    {
      title: "Upload Excel",
      url: "/dashboard/upload",
      icon: <UploadIcon />,
    },
    {
      title: "Donations",
      url: "#",
      icon: <PieChartIcon />,
      items: [
        {
          title: "Post Donation",
          url: "/dashboard/donate",
        },
        {
          title: "My Donations",
          url: "/dashboard/my-donations",
        },
      ],
    },
    {
      title: "Claims",
      url: "#",
      icon: <MapIcon />,
      items: [
        {
          title: "Available Food",
          url: "/dashboard/available",
        },
        {
          title: "My Claims",
          url: "/dashboard/my-claims",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Food Rescue Project",
      url: "/dashboard/project/food-rescue",
      icon: <BookOpenIcon />,
    },
    {
      name: "Community Outreach",
      url: "/dashboard/project/outreach",
      icon: <BotIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || "/default-avatar.jpg"
        });
      }
    };
    fetchUser();
  }, []);

  const sidebarData = {
    ...data,
    user: user || { name: "Loading...", email: "", avatar: "/default-avatar.jpg" },
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavProjects projects={sidebarData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
