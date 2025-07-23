"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";
import FollowSidebar from "@/components/home/home-layout";

const Home = () => {
  const [creating, setCreating] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleShowCreate = () => setCreating(true);
    document.addEventListener("showCreatePost", handleShowCreate);

    // Fetch posts
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();

    return () => {
      document.removeEventListener("showCreatePost", handleShowCreate);
    };
  }, []);

  return (
    <div className="w-full flex justify-center bg-amber-100">
      <div className="w-full max-w-2xl space-y-6">
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

        {loading && <div>Loading posts...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
