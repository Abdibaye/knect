
"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";

const Home = () => {
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handleShowCreate = () => setCreating(true);
    document.addEventListener("showCreatePost", handleShowCreate);

    return () => {
      document.removeEventListener("showCreatePost", handleShowCreate);
    };
  }, []);

  return (
    <div className="w-full mx-auto px-4 py-6 space-y-6">
      {creating ? (
        <CreatePost onCancel={() => setCreating(false)} />
      ) : (
        <div
          className="cursor-pointer p-4 border rounded-xl bg-muted dark:bg-zinc-800 text-muted-foreground hover:bg-muted/50"
          onClick={() => setCreating(true)}
        >
          What's on your mind?
        </div>
      )}

      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};

export default Home;
