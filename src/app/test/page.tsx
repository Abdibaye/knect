'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { HomeIcon, Icon, LayoutDashboard, LogOutIcon, PiIcon, Tv2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useSignOut } from "@/hooks/use-logout"
import { authClient } from "@/lib/auth-client"


export default function page() {
  const { data: session, isPending } = authClient.useSession()

  const handleLogout = useSignOut()

  return (
    <Card>
      <Card>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Card
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg graysca le">
                <AvatarImage src={session?.user.image ?? `https://avatar.vercel.sh/rauchg ${session?.user.email}`} alt={session?.user.name} />
                <AvatarFallback className="rounded-lg">{ session?.user.name && session?.user.name.length > 0 ?
                  session?.user.name?.charAt(0).toUpperCase() : session?.user.email?.charAt(0).toUpperCase() || "U"
                  }</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user.name && session.user.name.length > 0 ? session.user.name : session?.user.email.split("@")[0]}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {session?.user.email}
                </span>
              </div>
              <PiIcon className="ml-auto size-4" />
            </Card>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={session?.user.image ?? `https://avatar.vercel.sh/rauchg ${session?.user.email}`} alt={session?.user.name} />
<AvatarFallback className="rounded-lg">{ session?.user.name && session?.user.name.length > 0 ?
                  session?.user.name?.charAt(0).toUpperCase() : session?.user.email?.charAt(0).toUpperCase() || "U"
                  }</AvatarFallback>                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user.name && session.user.name.length > 0 ? session.user.name : session?.user.email.split("@")[0]}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/">
                <HomeIcon />
                HomePage
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/admin"}>
                <LayoutDashboard />
                Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/admin/courses"}>
                <Tv2 />
                Courses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </Card>
  )
}
