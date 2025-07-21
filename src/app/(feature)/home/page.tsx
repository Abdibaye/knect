
// "use client";

// import React, { useState, useEffect } from "react";
// import PostCard from "@/components/post/PostCard";
// import CreatePost from "@/components/post/CreatePost";

// const Home = () => {
//   const [creating, setCreating] = useState(false);

//   useEffect(() => {
//     const handleShowCreate = () => setCreating(true);
//     document.addEventListener("showCreatePost", handleShowCreate);

//     return () => {
//       document.removeEventListener("showCreatePost", handleShowCreate);
//     };
//   }, []);

//   return (
//     <div className="w-full mx-auto px-4 py-6 space-y-6">
//       {creating ? (
//         <CreatePost onCancel={() => setCreating(false)} />
//       ) : (
//         <div
//           className="cursor-pointer p-4 border rounded-xl bg-muted dark:bg-zinc-800 text-muted-foreground hover:bg-muted/50"
//           onClick={() => setCreating(true)}
//         >
//           What's on your mind?
//         </div>
//       )}

//       <PostCard />
//       <PostCard />
//       <PostCard />
//     </div>
//   );
// };

// export default Home;
"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";

import ChatListPage from "@/components/chat-list/chat-list";

type Mode = "posts" | "create" | "chat";

const Home = () => {
  const [mode, setMode] = useState<Mode>("posts");

  useEffect(() => {
    const handleShowCreate = () => setMode("create");
    const handleShowChat = () => setMode("chat");
    const handleShowPosts = () => setMode("posts");

    document.addEventListener("showCreatePost", handleShowCreate);
    document.addEventListener("showChat", handleShowChat);
    document.addEventListener("showPosts", handleShowPosts);

    return () => {
      document.removeEventListener("showCreatePost", handleShowCreate);
      document.removeEventListener("showChat", handleShowChat);
      document.removeEventListener("showPosts", handleShowPosts);
    };
  }, []);

  return (
    <div className="w-full mx-auto px-4 py-6 space-y-6">
      {mode === "create" ? (
        <CreatePost onCancel={() => setMode("posts")} />
      ) : mode === "chat" ? (
        <ChatListPage />
      ) : (
        <>
          <div
            className="cursor-pointer p-4 border rounded-xl bg-muted dark:bg-zinc-800 text-muted-foreground hover:bg-muted/50"
            onClick={() => setMode("create")}
          >
            What's on your mind?
          </div>
          <PostCard />
          <PostCard />
          <PostCard />
        </>
      )}
    </div>
  );
};

export default Home;
