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
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, UploadIcon, Handshake } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"

// This is sample data.
const data = {
  teams: [
    {
      name: "Food Rescue Network",
      logo: (
        <Handshake
        />
      ),
      plan: "Zero Hunger",
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
  const [isDonor, setIsDonor] = React.useState(false);
  const [isVolunteer, setIsVolunteer] = React.useState(false);

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
        // Check if user is a donor
        const { data: donor } = await supabase.from('donors').select('*').eq('email', user.email).single();
        setIsDonor(!!donor);
        if (!donor) {
          const { data: volunteer } = await supabase.from('volunteers').select('*').eq('email', user.email).single();
          setIsVolunteer(!!volunteer);
        }
      }
    };
    fetchUser();
  }, []);

  const navMain = isDonor ? [
    {
      title: "Create Food Post",
      url: "/post-food/create",
      icon: <UploadIcon />,
    },
    {
      title: "View My Posts",
      url: "/post-food",
      icon: <PieChartIcon />,
    }
  ] : isVolunteer ? [
    {
      title: "View Donations",
      url: "/donations",
      icon: <PieChartIcon />,
    },
    {
      title: "My Deliveries",
      url: "/my-deliveries",
      icon: <MapIcon />,
    }
  ] : data.navMain;

  const sidebarData = {
    ...data,
    navMain,
    user: user || { name: "Loading...", email: "", avatar: "/default-avatar.jpg" },
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {/* <NavProjects projects={sidebarData.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
