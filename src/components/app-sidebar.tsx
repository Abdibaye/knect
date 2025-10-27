"use client";

import { Calendar, CircleQuestionMarkIcon, Home, Inbox, Info, Scroll, Settings, Telescope, TestTube2, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
    comingSoon: true,
  },
  {
    title: "Community",
    url: "/community",
    icon: Users,
    comingSoon: true,
  },
  {
    title: "Research",
    url: "/research",
    icon: Scroll,
    comingSoon: true,
  },
  {
    title: "Labs & Materials",
    url: "/labs",
    icon: TestTube2,
    comingSoon: true,
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
                const isComingSoon = Boolean(item.comingSoon);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={clsx(
                        "relative overflow-hidden hover:bg-transparent active:bg-transparent data-[state=open]:hover:bg-transparent hover:text-foreground active:text-foreground hover:border-accent data-[active=true]:bg-accent/20 data-[active=true]:text-foreground data-[active=true]:border-accent focus-visible:ring-1 focus-visible:ring-ring",
                        isComingSoon && "border border-dashed border-border/70 bg-muted/30 text-muted-foreground"
                      )}
                    >
                      <Link
                        href={item.url}
                        className={clsx(
                          "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 transition-all",
                          !isActive && "text-foreground/80 text-lg",
                          isComingSoon && "pointer-events-none select-none opacity-70"
                        )}
                        aria-disabled={isComingSoon}
                        tabIndex={isComingSoon ? -1 : 0}
                      >
                        <span className="flex items-center gap-2">
                          <item.icon size={18} />
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </span>
                        {isComingSoon ? (
                          <Badge variant="outline" className="border-dashed px-2 py-0 text-[10px] uppercase tracking-wide">
                            Coming soon
                          </Badge>
                        ) : null}
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

