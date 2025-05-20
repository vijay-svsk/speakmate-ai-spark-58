
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Mic, MessageSquare, Award, Book, BarChart, Headphones } from "lucide-react";

const navItems = [
  { title: "Dashboard", route: "/", icon: LayoutDashboard },
  { title: "Speaking Practice", route: "/speaking", icon: Mic },
  { title: "Conversation AI", route: "/conversation", icon: MessageSquare },
  { title: "Reflex Challenge", route: "/reflex", icon: Award },
  { title: "Pronunciation Mirror", route: "/pronunciation", icon: Headphones },
  { title: "Story Builder", route: "/story", icon: Book },
  { title: "Vocabulary Trainer", route: "/vocabulary", icon: Book },
  { title: "Grammar Clinic", route: "/grammar", icon: Book },
  { title: "Progress Report", route: "/progress", icon: BarChart }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-playfair text-lg text-primary">SpeakMate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.route} className="flex items-center gap-3 text-base py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
