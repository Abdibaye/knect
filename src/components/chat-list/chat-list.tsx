// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { StreamChat, Channel as StreamChannelType } from "stream-chat";
// import {
//   Chat,
//   Channel,
//   Window,
//   MessageList,
//   MessageInput,
//   LoadingIndicator,
// } from "stream-chat-react";
// import { Button } from "@/components/ui/button";

// type ChatUser = {
//   id: string | number;
//   name: string | null;
//   image?: string | null;
// };

// type Me = {
//   id: string;
//   name?: string | null;
//   image?: string | null;
// } | null;

// function useMe() {
//   const [me, setMe] = useState<Me>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     const ctrl = new AbortController();
//     async function load() {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/auth/me", { cache: "no-store", signal: ctrl.signal });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data?.error || "Failed to load current user");
//         if (!cancelled) setMe(data.user ? { ...data.user, id: String(data.user.id) } : null);
//       } catch {
//         if (!cancelled) setMe(null);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       cancelled = true;
//       ctrl.abort();
//     };
//   }, []);

//   return { me, loading };
// }

// export default function ChatListPage() {
//   const router = useRouter();
//   const { me, loading: meLoading } = useMe();

//   const meId = useMemo(() => (me?.id ? String(me.id) : ""), [me?.id]);
//   const meName = useMemo(() => me?.name || (meId ? `User ${meId}` : "Me"), [me?.name, meId]);
//   const meImage = me?.image || undefined;

//   const publicKey = process.env.NEXT_PUBLIC_STREAM_KEY as string | undefined;

//   const [users, setUsers] = useState<ChatUser[]>([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

//   const [client, setClient] = useState<StreamChat | null>(null);
//   const [activeChannel, setActiveChannel] = useState<StreamChannelType | null>(null);
//   const [connecting, setConnecting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const searchRef = useRef<HTMLInputElement>(null);

//   // Load users (exclude me server-side and client-side)
//   useEffect(() => {
//     if (meLoading) return;
//     let cancelled = false;
//     const ctrl = new AbortController();

//     async function load() {
//       try {
//         setLoadingUsers(true);
//         const qs = new URLSearchParams();
//         if (meId) qs.set("exclude", String(meId));
//         if (search.trim()) qs.set("q", search.trim());
//         const res = await fetch(`/api/user/list?${qs.toString()}`, {
//           cache: "no-store",
//           signal: ctrl.signal,
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Failed to load users");
//         const cleaned = (data.users as ChatUser[]).filter((u) => String(u.id) !== String(meId));
//         if (!cancelled) setUsers(cleaned);
//       } catch {
//         if (!cancelled) setUsers([]);
//       } finally {
//         if (!cancelled) setLoadingUsers(false);
//       }
//     }

//     const t = setTimeout(load, 200);
//     return () => {
//       cancelled = true;
//       ctrl.abort();
//       clearTimeout(t);
//     };
//   }, [meLoading, meId, search]);

//   // Disconnect Stream on unmount
//   useEffect(() => {
//     return () => {
//       client?.disconnectUser().catch(() => {});
//     };
//   }, [client]);

//   // Connect and open DM when a user is selected
//   useEffect(() => {
//     let cancelled = false;

//     async function connectAndOpen() {
//       setError(null);

//       if (!selectedUser) {
//         setActiveChannel(null);
//         return;
//       }
//       if (!publicKey) {
//         setError("Missing NEXT_PUBLIC_STREAM_KEY. Set it in .env.local and restart.");
//         return;
//       }
//       if (!meId) {
//         setError("No signed-in user. Please sign in first.");
//         return;
//       }

//       setConnecting(true);

//       const peerId = String(selectedUser.id);
//       const peerName = selectedUser.name ?? peerId;
//       const peerImage = selectedUser.image ?? undefined;

//       try {
//         // 1) Token from server (also upserts users on Stream)
//         const tokenRes = await fetch("/api/stream/token", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userId: String(meId),
//             userName: meName,
//             userImage: meImage,
//             peerId,
//             peerName,
//             peerImage,
//           }),
//         });
//         const tokenData = await tokenRes.json();
//         if (!tokenRes.ok) throw new Error(tokenData.error || "Failed to get token");

//         // 2) Init/connect client once
//         const sc = client ?? StreamChat.getInstance(publicKey);
//         if (!client) {
//           await sc.connectUser({ id: String(meId), name: meName, image: meImage }, tokenData.token);
//           if (cancelled) return;
//           setClient(sc);
//         }

      
//         // });
//          const ch = (client ?? sc).channel("messaging", {
//           members: [String(meId), peerId],
//           distinct: true,
//         });

//         await ch.watch();
//         if (cancelled) return;
//         setActiveChannel(ch);

//         await ch.watch();
//         if (cancelled) return;
//         setActiveChannel(ch);
//       } catch (err: any) {
//         if (!cancelled) setError(err?.message || "Failed to open chat");
//         setActiveChannel(null);
//       } finally {
//         if (!cancelled) setConnecting(false);
//       }
//     }

//     connectAndOpen();
//     return () => {
//       cancelled = true;
//     };
//   }, [selectedUser, meId, meName, meImage, client, publicKey]);

//   // Overlay + chat box (overlay blurs page)
//   const showOverlay = true;

//   return (
//     <>
//       {showOverlay && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9998]"
//           aria-hidden="true"
//           onClick={() => router.push("/home")}
//         />
//       )}

//       <div className="fixed bottom-4 right-4 z-[9999]">
//         <div className="w-[360px] h-[520px] bg-card rounded-xl shadow-xl border border-border overflow-hidden flex flex-col">
//           {/* Title bar */}
//           <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/40">
//             <div className="flex items-center gap-2">
//               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
//               <span className="font-semibold text-sm">Messages</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="h-8 w-8"
//                 onClick={() => router.push("/home")}
//                 aria-label="Close"
//               >
//                 ✕
//               </Button>
//             </div>
//           </div>

//           {/* Me loading gate */}
//           {meLoading ? (
//             <div className="flex-1 grid place-items-center">
//               <LoadingIndicator />
//             </div>
//           ) : !meId ? (
//             <div className="flex-1 grid place-items-center text-sm text-muted-foreground p-6 text-center">
//               Please sign in to use chat.
//             </div>
//           ) : !selectedUser ? (
//             <div className="flex flex-col h-full">
//               {/* Search */}
//               <div className="p-2 border-b border-border">
//                 <input
//                   ref={searchRef}
//                   className="w-full h-9 px-3 rounded-md bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
//                   placeholder="Search people…"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>

//               {/* List */}
//               <div className="flex-1 overflow-y-auto">
//                 {loadingUsers ? (
//                   <div className="h-full grid place-items-center">
//                     <LoadingIndicator />
//                   </div>
//                 ) : users.length === 0 ? (
//                   <div className="h-full grid place-items-center text-sm text-muted-foreground">
//                     No users found.
//                   </div>
//                 ) : (
//                   <ul>
//                     {users.map((user) => (
//                       <li
//                         key={String(user.id)}
//                         onClick={() => {
//                           if (String(user.id) === String(meId)) return;
//                           setSelectedUser(user);
//                         }}
//                         className="px-3 py-2 hover:bg-accent cursor-pointer border-b border-border flex items-center gap-3"
//                       >
//                         <span className="relative">
//                           <img
//                             src={user.image || "https://i.pravatar.cc/40?u=" + user.id}
//                             alt={user.name || String(user.id)}
//                             className="w-9 h-9 rounded-full object-cover"
//                           />
//                           <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-card" />
//                         </span>
//                         <div className="min-w-0">
//                           <div className="text-sm font-medium truncate">
//                             {user.name || "User " + user.id}
//                           </div>
//                           <div className="text-xs text-muted-foreground">Tap to open chat</div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col h-full">
//               {/* Conversation header */}
//               <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-muted/40">
//                 <div className="flex items-center gap-2 min-w-0">
//                   <span className="relative">
//                     <img
//                       src={selectedUser.image || "https://i.pravatar.cc/40?u=" + selectedUser.id}
//                       alt={selectedUser.name || String(selectedUser.id)}
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                     <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-muted/40" />
//                   </span>
//                   <div className="min-w-0">
//                     <div className="text-sm font-semibold truncate">
//                       {selectedUser.name || "User " + selectedUser.id}
//                     </div>
//                     <div className="text-[11px] text-muted-foreground">Active now</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Button size="sm" variant="outline" onClick={() => setSelectedUser(null)}>
//                     Back
//                   </Button>
//                 </div>
//               </div>

//               {/* Error banner */}
//               {error && (
//                 <div className="px-3 py-2 text-xs text-red-600 bg-red-50 border-b border-red-200">{error}</div>
//               )}

//               {/* Stream UI */}
//               <div className="flex-1 min-h-0">
//                 {!client || !activeChannel || connecting ? (
//                   <div className="h-full grid place-items-center">
//                     <LoadingIndicator />
//                   </div>
//                 ) : (
//                   <Chat client={client} theme="str-chat__theme-light">
//                     <Channel channel={activeChannel}>
//                       <Window>
//                         <MessageList />
//                         <MessageInput focus />
//                       </Window>
//                     </Channel>
//                   </Chat>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StreamChat, Channel as StreamChannelType } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  LoadingIndicator,
} from "stream-chat-react";
import { Button } from "@/components/ui/button";
import { Phone, Video, Settings } from "lucide-react";
import "stream-chat-react/dist/css/v2/index.css";

type ChatUser = {
  id: string | number;
  name: string | null;
  image?: string | null;
};

type Me = {
  id: string;
  name?: string | null;
  image?: string | null;
} | null;

function useMe() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", { cache: "no-store", signal: ctrl.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load current user");
        if (!cancelled) setMe(data.user ? { ...data.user, id: String(data.user.id) } : null);
      } catch {
        if (!cancelled) setMe(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  return { me, loading };
}

export default function ChatListPage() {
  const router = useRouter();
  const { me, loading: meLoading } = useMe();

  const meId = useMemo(() => (me?.id ? String(me.id) : ""), [me?.id]);
  const meName = useMemo(() => me?.name || (meId ? `User ${meId}` : "Me"), [me?.name, meId]);
  const meImage = me?.image || undefined;

  const publicKey = process.env.NEXT_PUBLIC_STREAM_KEY as string | undefined;

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const [client, setClient] = useState<StreamChat | null>(null);
  const [activeChannel, setActiveChannel] = useState<StreamChannelType | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (meLoading) return;
    let cancelled = false;
    const ctrl = new AbortController();

    async function load() {
      try {
        setLoadingUsers(true);
        const qs = new URLSearchParams();
        if (meId) qs.set("exclude", String(meId));
        if (search.trim()) qs.set("q", search.trim());
        const res = await fetch(`/api/user/list?${qs.toString()}`, {
          cache: "no-store",
          signal: ctrl.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load users");
        const cleaned = (data.users as ChatUser[]).filter((u) => String(u.id) !== String(meId));
        if (!cancelled) setUsers(cleaned);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    const t = setTimeout(load, 200);
    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(t);
    };
  }, [meLoading, meId, search]);

  useEffect(() => {
    return () => {
      client?.disconnectUser().catch(() => {});
    };
  }, [client]);

  useEffect(() => {
    let cancelled = false;

    async function connectAndOpen() {
      setError(null);

      if (!selectedUser) {
        setActiveChannel(null);
        return;
      }
      if (!publicKey) {
        setError("Missing NEXT_PUBLIC_STREAM_KEY. Set it in .env.local and restart.");
        return;
      }
      if (!meId) {
        setError("No signed-in user. Please sign in first.");
        return;
      }

      setConnecting(true);

      const peerId = String(selectedUser.id);
      const peerName = selectedUser.name ?? peerId;
      const peerImage = selectedUser.image ?? undefined;

      try {
        const tokenRes = await fetch("/api/stream/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: String(meId),
            userName: meName,
            userImage: meImage,
            peerId,
            peerName,
            peerImage,
          }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(tokenData.error || "Failed to get token");

        const sc = client ?? StreamChat.getInstance(publicKey);
        if (!client) {
          await sc.connectUser({ id: String(meId), name: meName, image: meImage }, tokenData.token);
          if (cancelled) return;
          setClient(sc);
        }

        const ch = (client ?? sc).channel("messaging", {
          members: [String(meId), peerId],
          distinct: true,
        });

        await ch.watch();
        if (cancelled) return;
        setActiveChannel(ch);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to open chat");
        setActiveChannel(null);
      } finally {
        if (!cancelled) setConnecting(false);
      }
    }

    connectAndOpen();
    return () => {
      cancelled = true;
    };
  }, [selectedUser, meId, meName, meImage, client, publicKey]);

  const showOverlay = true;

  return (
    <>
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9998]"
          aria-hidden="true"
          onClick={() => router.push("/home")}
        />
      )}

      <div className="fixed bottom-4 right-4 z-[9999]">
        <div className="w-[360px] h-[520px] bg-white rounded-xl shadow-lg border flex flex-col">
          {!selectedUser ? (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b flex items-center font-bold text-lg">Chats</div>
              <div className="p-2 border-b">
                <input
                  ref={searchRef}
                  className="w-full h-9 px-3 rounded-full bg-gray-100 text-sm outline-none"
                  placeholder="Search Messenger"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingUsers ? (
                  <div className="h-full grid place-items-center">
                    <LoadingIndicator />
                  </div>
                ) : users.length === 0 ? (
                  <div className="h-full grid place-items-center text-sm text-gray-500">
                    No users found.
                  </div>
                ) : (
                  <ul>
                    {users.map((user) => (
                      <li
                        key={String(user.id)}
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b flex items-center gap-3"
                      >
                        <img
                          src={user.image || "https://i.pravatar.cc/40?u=" + user.id}
                          alt={user.name || String(user.id)}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium">{user.name || "User " + user.id}</div>
                          <div className="text-xs text-gray-500">Tap to chat</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-3 py-2 border-b flex items-center justify-between bg-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedUser.image || "https://i.pravatar.cc/40?u=" + selectedUser.id}
                    alt={selectedUser.name || String(selectedUser.id)}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{selectedUser.name}</div>
                    <div className="text-xs text-gray-500">Active now</div>
                  </div>
                </div>
                <div className="flex gap-3 text-gray-600">
                  <Phone size={18} />
                  <Video size={18} />
                  <Settings size={18} />
                </div>
              </div>
              <div className="flex-1 min-h-0">
                {!client || !activeChannel || connecting ? (
                  <div className="h-full grid place-items-center">
                    <LoadingIndicator />
                  </div>
                ) : (
                  <Chat client={client} theme="str-chat__theme-light">
                    <Channel channel={activeChannel}>
                      <Window>
                        <MessageList />
                        <MessageInput focus />
                      </Window>
                    </Channel>
                  </Chat>
                )}
              </div>
              <div className="p-2 text-center text-sm text-blue-600 cursor-pointer" onClick={() => setSelectedUser(null)}>
                Back to Chats
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
