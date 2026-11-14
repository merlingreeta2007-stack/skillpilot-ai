import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, User, BarChart3, Target, Map, MessageCircle, TrendingUp, Compass } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Learner Profile", url: "/profile", icon: User },
  { title: "Skill Analysis", url: "/skills", icon: BarChart3 },
  { title: "Career Matching", url: "/career", icon: Target },
  { title: "Learning Roadmap", url: "/roadmap", icon: Map },
  { title: "AI Mentor", url: "/mentor", icon: MessageCircle },
  { title: "Progress", url: "/progress", icon: TrendingUp },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-brand text-primary-foreground"><Compass className="h-5 w-5" /></div>
          {state === "expanded" && <span className="font-display text-lg font-bold">SkillPilot <span className="text-gradient">AI</span></span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup><SidebarGroupContent><SidebarMenu>
          {items.map((i) => (
            <SidebarMenuItem key={i.url}>
              <SidebarMenuButton asChild isActive={path === i.url} tooltip={i.title}>
                <Link to={i.url}><i.icon className="h-4 w-4" /><span>{i.title}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu></SidebarGroupContent></SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
