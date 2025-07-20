import Navbar from "@/components/shared/navbar-form";
import Footer from "@/components/shared/Footer";
import SignedNavbar from "@/components/shared/signed-navbar";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import FollowSidebar from "@/components/home/home-layout";
import { requireAdmin } from "@/app/data/admin/require-admin";

export default function FeatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
  <FollowSidebar />
  {children}
  </>;
}
