"server only"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session){
        return redirect('/register');
    }

    return session;
}