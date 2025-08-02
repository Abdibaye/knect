import Navbar from "@/components/shared/navbar-form";

import SignedNavbar from "@/components/shared/signed-navbar";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
// import { requireAdmin } from "../data/admin/require-admin";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await requireAdmin();
  return (
    <>
      <SignedNavbar className="fixed top-0 left-0 right-0 z-50 bg-background" />
      
      <div className="pt-16">
  <SidebarProvider>
    <div className="flex">
      {/* Sidebar only on large screens */}
      <div className="hidden sm:block">
        <AppSidebar />
      </div>

      {/* Icon only on small screens */}
      <div className="md:hidden fixed top-15  left-0 z-50">
        <SidebarTrigger />
      </div>

      {/* Main content always visible */}
      <main className="flex-1 px-4">
        {children}
      </main>
    </div>
  </SidebarProvider>
</div>

     
    </>
  );
}
