import { Button } from "@/components/ui/button";
import Link from "next/link";

import React from "react";
import Navbar from "@/components/shared/navbar-form";
export default function Page() {
  return (
    <section className="relative w-full h-[80vh] md:h-[100vh]">
      <Navbar />
      <img
        src="/image/login-photo.jpg"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black/50 dark:bg-black/60 rounded-lg" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white dark:text-gray-100">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
          Empowering Students to Connect, Learn & Grow 🌱
        </h1>
        <p className="mt-4 text-base md:text-lg max-w-xl">
          Knect is the ultimate platform for Ethiopian university students to
          collaborate, share resources, and build the future together.
        </p>
        <Link href="/community" passHref>
          <Button className="mt-6 px-6 py-3 text-base font-medium" size="lg">
            Join the Community
          </Button>
        </Link>
      </div>
    </section>
  );
}
