"use client";

import { Calendar, CircleQuestionMarkIcon, Home, Inbox, Info, MailQuestionIcon, MessageCircle, Scroll, Search, Settings, Telescope, TestTube2, User, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import * as React from "react";

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
    url: "/opportunities",
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
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <Sidebar>
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MainItems.map((item) => {
                const isActive = mounted && pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="hover:bg-transparent active:bg-transparent data-[state=open]:hover:bg-transparent hover:text-foreground active:text-foreground hover:border-accent data-[active=true]:bg-accent/20 data-[active=true]:text-foreground data-[active=true]:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <Link
                        href={item.url}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                          !isActive && "text-foreground/80 text-lg"
                        )}
                      >
                        <item.icon size={18} />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
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
            const isActive = mounted && pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="hover:bg-transparent active:bg-transparent data-[state=open]:hover:bg-transparent hover:text-foreground active:text-foreground border border-transparent hover:border-accent data-[active=true]:bg-accent/20 data-[active=true]:text-foreground data-[active=true]:border-accent"
                >
                  <Link
                    href={item.url}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                      !isActive && "text-foreground/80"
                    )}
                  >
                    <item.icon size={18} />
                    <span className="text-sm font-medium">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}

