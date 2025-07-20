"use client";

import { Share2 } from "lucide-react";

export default function PostCard() {
  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
            {/* Avatar initial */}
            <span className="text-lg">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">
              Abdi Gashahun
            </span>
            <span className="text-xs text-muted-foreground">
              knect@<span className="text-purple-500">Tik Tak</span> • 8d
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button className="text-sm px-3 py-1 rounded-lg border hover:bg-muted font-medium">
            + Follow
          </button>
          <button className="text-lg font-bold px-1">⋯</button>
        </div>
      </div>

      {/* Caption */}
      <p className="text-sm text-foreground mt-2">
        What is Prisma? How can we connect to database that the real problem
        now?
      </p>
      {/* Image */}
      <div className="mt-4 overflow-hidden rounded-xl border max-h-80">
        <img
          src="/image/foto.jpg"
          alt="Post"
          className="w-full h-full object-cover "
        />
      </div>

      {/* Footer Icons */}
      <div className="flex justify-around text-muted-foreground mt-3 text-sm">
        <div className="flex items-center gap-1">
          <span>♡</span> <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💬</span> <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-3 h-3 text-gray-600 dark:text-gray-300 cursor-pointer" />{" "}
          <span>0</span>
        </div>
      </div>
    </div>
  );
}
