"use client";
"use client"

import NotificationMenu from "@/components/navbar-components/notification-menu";
// not used anymore
import UserMenu from "@/components/navbar-components/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // for search bar

// not used anymore
import { Logo } from "./logo-form";
import ThemeToggle from "../theme-toggle";
import { ChartGanttIcon, MessageCircle, PlusIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";



type SignedNavbarProps = {
  className?: string;
};

export default function SignedNavbar({ className }: SignedNavbarProps) {
  const { data: session, isPending } = authClient.useSession()
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b px-4 md:px-6 ${
        className ?? ""
      }`}
    >
      <div className="flex h-16 items-center justify-between gap-10">
        {/* Left side - just brand name */}
        <Logo />

        {/* Middle - Search bar */}
        <div className="flex-1 max-w-md mx-auto w-full outline-none">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 text-sm  rounded-md"
          />
        </div>

        {/* Right side - untouched */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
          {/* <ChatBubbleLeftIcon className="w-6 h-6 text-blue-600 border border-blue-200 rounded-full p-1 hover:bg-blue-100 dark:hover:bg-blue-900 transition cursor-pointer" /> */}
        
          <MessageCircle />
          <Button
            size="sm"
            className="text-sm max-sm:aspect-square max-sm:p-0"
            onClick={() => {
              const event = new Event("showCreatePost");
              document.dispatchEvent(event);
            }}
          >
            <PlusIcon
              className="opacity-60 sm:-ms-1"
              size={16}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Post</span>
          </Button>

          <NotificationMenu />
          {isPending || !session?.user ? (
            <UserMenu name="" email="" />
          ) : (
            <UserMenu
              name={session.user.name || ""}
              email={session.user.email || ""}
              image={session.user.image || ""}
            />
          )}
        </div>
      </div>
    </header>
  );
}
