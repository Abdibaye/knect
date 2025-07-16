import Navbar from "@/components/shared/navbar-form";
import Footer from "@/components/shared/Footer";
import SignedNavbar from "@/components/shared/signed-navbar";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignedNavbar className="fixed top-0 left-0 right-0 z-50 bg-background" />
      <div className="pt-16">
        <SidebarProvider>
          <AppSidebar />

          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </>
  );
}
