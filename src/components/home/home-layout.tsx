"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Plus, User, UserPlus, Scroll, Inbox, Tv, Circle } from "lucide-react";


const featuredResearch = [
  {
    title: "Advances in Renewable Energy",
    org: "Addis Ababa University",
  },
  {
    title: "Quantum Computing",
    org: "University of California",
  },
  {
    title: "Social Media Trends Among Students",
    org: "SciNews",
  },
];

const closingOpportunities = [
  {
    title: "Graduate Research Fellowship",
    org: "Addis Ababa University",
  },
  {
    title: "Tech Innovation Challenge",
    org: "Tech Innovation",
  },
];

const initialChannelsToFollow = [
  { name: "Astu General" },
  { name: "CSEC" },
];

export default function FollowSidebar() {
  const [followedChannels, setFollowedChannels] = useState<boolean[]>(
    new Array(initialChannelsToFollow.length).fill(false)
  );

  const toggleChannelFollow = (index: number) => {
    const updated = [...followedChannels];
    updated[index] = !updated[index];
    setFollowedChannels(updated);
  };

  return (
    <aside className="hidden lg:block fixed top-2 right-0 h-screen w-74 mt-16 p-4 space-y-4 z-40 overflow-y-auto">
      {/* Featured research */}
      <section className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl shadow-sm mb-2">
        <h2 className="text-base font-semibold mb-3 text-zinc-800 dark:text-white">Featured research</h2>
        <ul className="space-y-2">
          {featuredResearch.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Scroll className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-800 dark:text-white font-medium leading-tight">{item.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.org}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Opportunities closing soon */}
      <section className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl shadow-sm mb-2">
        <h2 className="text-base font-semibold mb-3 text-zinc-800 dark:text-white">Opportunities closing soon</h2>
        <ul className="space-y-2">
          {closingOpportunities.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Inbox className="w-4 h-4 text-blue-600 dark:text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-800 dark:text-white font-medium leading-tight">{item.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.org}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Communities to follow */}
      <section className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold mb-3 text-zinc-800 dark:text-white">Communities to follow</h2>
          <Tv className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-2" />
        </div>
        <ul className="space-y-3">
          {initialChannelsToFollow.map((channel, i) => (
            <li key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9">
                <AvatarImage src={"csec.jpg"} alt={channel.name} />
                <AvatarFallback>
                  <Circle className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold text-zinc-800 dark:text-white">{channel.name}</p>
              </div>
              <Button
                onClick={() => toggleChannelFollow(i)}
                className={`text-sm font-medium bg-blue-600 rounded-md px-4 py-1.5 ${
                  followedChannels[i]
                    ? "text-white hover:underline"
                    : "text-white hover:underline"
                }`}
              >
                <Plus className="w-4 h-4 mr-1" />
                {followedChannels[i] ? "Following" : "Follow"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
