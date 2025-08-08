"use client";

import { Calendar, CircleQuestionMarkIcon, Home, Inbox, Info, MailQuestionIcon, MessageCircle, Scroll, Search, Settings, Telescope, TestTube2, User, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items
const MainItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Opportunities",
    url: "/Opportunities",
    icon: Telescope,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: Inbox,
  },
  {
    title: "Event",
    url: "/event",
    icon: Calendar,
  },
  {
    title: "Community",
    url: "/community",
    icon: Users,
  },
  {
    title: "Research",
    url: "/research",
    icon: Scroll,
  },
  {
    title: "Labs & Materials",
    url: "/labs",
    icon: TestTube2,
  }
];

const SecondaryItems = [
   {
    title: "Settings",
    url: "/setting",
    icon: Settings,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
  {
    title: "get help",
    url: "/help",
    icon: CircleQuestionMarkIcon  
  }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MainItems.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <item.icon size={18} />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer area for secondary items */}
      <div className="mt-auto border-t border-border p-3">
        <SidebarMenu>
          {SecondaryItems.map((item) => {
            const isActive = pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/80 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon size={18} />
                    <span className="text-sm font-medium">
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
