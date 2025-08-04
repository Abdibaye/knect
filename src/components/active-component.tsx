// app/components/FeatureSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function FeatureSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Resources", href: "/feature/resources" },
    { name: "Event", href: "/feature/event" },
    { name: "Group", href: "/feature/group" },
    { name: "Community", href: "/feature/community" },
    { name: "Setting", href: "/feature/setting" },
  ];

  return (
    <aside className="hidden md:block w-64 p-4 border-r dark:border-zinc-800">
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block px-4 py-2 rounded-lg transition font-medium",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
