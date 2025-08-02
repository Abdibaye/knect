
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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl space-y-4">
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
              className= "flex justify-between cursor-pointer w-full  lg:ml-14 mt-3  lg:w-170  p-4 border rounded-xl bg-muted dark:bg-zinc-800 text-muted-foreground "
              onClick={() => setMode("create")}
            >
              <p>Got a project, question, or idea? Drop it here.</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-pen-line-icon lucide-file-pen-line"
              >
                <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                <path d="M8 18h1" />
              </svg>
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
