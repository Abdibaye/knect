"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut(){
    const router = useRouter()
    const handleLogout = async function Logout() {
            await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login"); // redirect to login page
              toast.success("Logged out successfully");
            },
          },});}

    return handleLogout;
}