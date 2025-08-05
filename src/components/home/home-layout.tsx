"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

const initialPeopleToFollow = [
  { name: "John Doe", handle: "@johndoe" },
  { name: "Jane Smith", handle: "@janesmith" },
  { name: "Jbeka An", handle: "@mint" },
  { name: "Kebek", handle: "@eyob" },
];

const initialChannelsToFollow = [
  { name: "Tech News" },
  { name: "Frontend Devs" },
  { name: "Backend dev" },
  { name: "Solver Am" },
];

export default function FollowSidebar() {
  const [followedPeople, setFollowedPeople] = useState<boolean[]>(
    new Array(initialPeopleToFollow.length).fill(false)
  );
  const [followedChannels, setFollowedChannels] = useState<boolean[]>(
    new Array(initialChannelsToFollow.length).fill(false)
  );

  const togglePersonFollow = (index: number) => {
    const updated = [...followedPeople];
    updated[index] = !updated[index];
    setFollowedPeople(updated);
  };

  const toggleChannelFollow = (index: number) => {
    const updated = [...followedChannels];
    updated[index] = !updated[index];
    setFollowedChannels(updated);
  };

  return (
    <aside className="hidden lg:block fixed top-0 right-0 h-screen w-74 mt-16 p-4 space-y-6 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 z-40 overflow-y-auto">
      {/* Who to follow section */}
      <section className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">
          Who to connect with
        </h2>
        <ul className="space-y-4">
          {initialPeopleToFollow.map((person, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-zinc-800 dark:text-white">
                    {person.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {person.handle}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => togglePersonFollow(i)}
                className={`text-sm font-medium bg-blue-500 ${
                  followedPeople[i]
                    ? "text-white hover:underline"
                    : "text-white  hover:underline"
                }`}
              >
                {followedPeople[i] ? "Following" : "Follow"}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* Channels to follow section */}
      <section className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">
          Communities to follow
        </h2>
        <ul className="space-y-3">
          {initialChannelsToFollow.map((channel, i) => (
            <li key={i} className="flex justify-between items-center">
              <span className="text-sm text-zinc-800 dark:text-white">
                {channel.name}
              </span>
              <Button
                onClick={() => toggleChannelFollow(i)}
                className={`text-sm font-medium bg-blue-500 ${
                  followedChannels[i]
                    ? "text-white hover:underline"
                    : "text-white hover:underline"
                }`}
              >
                {followedChannels[i] ? "Following" : "Follow"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
