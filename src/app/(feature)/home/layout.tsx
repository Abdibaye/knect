import Navbar from "@/components/shared/navbar-form";
import Footer from "@/components/shared/Footer";
import SignedNavbar from "@/components/shared/signed-navbar";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import FollowSidebar from "@/components/home/home-layout";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex">
        <main className="flex-1 lg:mr-64">{children}</main> <FollowSidebar />
      </div>
    </>
  );
}
