"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";

import ChatListPage from "@/components/chat-list/chat-list";

type Mode = "posts" | "create" | "chat";

const Home = () => {
  const [creating, setCreating] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleShowCreate = () => setMode("create");
    const handleShowChat = () => setMode("chat");
    const handleShowPosts = () => setMode("posts");

    document.addEventListener("showCreatePost", handleShowCreate);
    document.addEventListener("showChat", handleShowChat);
    document.addEventListener("showPosts", handleShowPosts);

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
      document.removeEventListener("showChat", handleShowChat);
      document.removeEventListener("showPosts", handleShowPosts);
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
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
