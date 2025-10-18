import Navbar from "@/components/shared/navbar-form";
import Footer from "@/components/shared/Footer";
import SignedNavbar from "@/components/shared/signed-navbar";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import FollowSidebar from "@/components/home/home-layout";
import { requireGuest } from "@/app/data/auth/require-guest";

export default async function FeatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect authenticated users away from auth routes (login/register) to home
  await requireGuest();
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
