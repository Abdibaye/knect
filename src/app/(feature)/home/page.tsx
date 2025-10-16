"use client";

import React, { useState, useEffect, useCallback } from "react";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";
import PostCardSkeleton from "@/components/post/PostCardSkeleton";
import ChatListPage from "@/components/chat-list/chat-list";
import PostComposerPrompt from "@/components/post/PostComposerPrompt";

type Mode = "posts" | "create" | "chat";

const Home = () => {
  const [mode, setMode] = useState<Mode>("posts");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
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
  }, []);

  // Listen for custom events from navbar or elsewhere + initial fetch
  useEffect(() => {
    const handleShowCreate = () => setMode("create");
    const handleShowChat = () => setMode("chat");
    const handleShowPosts = () => setMode("posts");

    document.addEventListener("showCreatePost", handleShowCreate);
    document.addEventListener("showChat", handleShowChat);
    document.addEventListener("showPosts", handleShowPosts);

    loadPosts();

    return () => {
      document.removeEventListener("showCreatePost", handleShowCreate);
      document.removeEventListener("showChat", handleShowChat);
      document.removeEventListener("showPosts", handleShowPosts);
    };
  }, [loadPosts]);

  return (
    <div className="w-full flex justify-center lg:ml-9 mt-3 min-[1024px]:pr-[21rem] min-[1381px]:pr-0 2xl:pr-0">
      <div className="w-full max-w-2xl space-y-4">
        {/* === CREATE POST MODE === */}
        {mode === "create" && (
          <CreatePost
            onCancel={() => setMode("posts")}
            onSubmit={async () => {
              setMode("posts");
              await loadPosts();
            }}
          />
        )}

        {/* === CHAT MODE === */}
        {mode === "chat" && <ChatListPage />}

        {/* === POST MODE === */}
        {mode === "posts" && (
          <>
            {/* Composer prompt */}
            <PostComposerPrompt onCompose={() => setMode("create")} />
            {loading && (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            )}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && posts.map((post) => <PostCard key={post.id} post={post} />)}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
