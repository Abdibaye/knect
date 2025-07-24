
"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";

import FollowSidebar from "@/components/home/home-layout";

import ChatListPage from "@/components/chat-list/chat-list";

type Mode = "posts" | "create" | "chat";


const Home = () => {
  const [mode, setMode] = useState<Mode>("posts");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for custom events from navbar or elsewhere
  useEffect(() => {
    const handleShowCreate = () => setMode("create");
    const handleShowChat = () => setMode("chat");
    const handleShowPosts = () => setMode("posts");

    document.addEventListener("showCreatePost", handleShowCreate);
    document.addEventListener("showChat", handleShowChat);
    document.addEventListener("showPosts", handleShowPosts);

    // Fetch posts on load
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
    <div className="w-full flex justify-center bg-amber-100">
      <div className="w-full max-w-2xl space-y-6">
        {/* === CREATE POST MODE === */}
        {mode === "create" && (
          <CreatePost onCancel={() => setMode("posts")} />
        )}

        {/* === CHAT MODE === */}
        {mode === "chat" && <ChatListPage />}

        {/* === POST MODE === */}
        {mode === "posts" && (
          <>
            {/* Fake post input */}
            <div
              className="cursor-pointer mx-auto lg:mx-0 mt-2 lg:w-190 w-100 p-4 border rounded-xl bg-muted dark:bg-zinc-800 text-muted-foreground hover:bg-muted/50"
              onClick={() => setMode("create")}
            >
              What's on your mind?
            </div>

            {loading && <div>Loading posts...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
