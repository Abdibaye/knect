import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@prisma/client";
 
 
const prisma = new PrismaClient();
export const auth = betterAuth({
  
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Session configuration
  // NOTE: Using a very short expiry for testing. Change to "7d" or the equivalent seconds for production.
  // If your Better Auth version expects a numeric value, use seconds (e.g., 7 * 24 * 60 * 60)
  // If it supports duration strings, prefer "7d".
  session: {
    expiresIn: 7 * 24 * 60 * 60 , // 30 seconds for testing; set to 7 * 24 * 60 * 60 (or "7d") for 7 days
  } as any,

  emailAndPassword: {
    	enabled: true,
    	autoSignIn: false 
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});