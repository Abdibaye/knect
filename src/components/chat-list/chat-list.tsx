"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


type User = {
  id: number;
  name: string;
  lastMessage: string;
  avatarUrl: string;
};

type Message = {
  id: number;
  sender: "me" | "other";
  text: string;
};

export default function ChatListPage() {
  const router = useRouter();

  const users: User[] = [
    {
      id: 1,
      name: "Abdi",
      lastMessage: "Say hi!",
      avatarUrl: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Fami",
      lastMessage: "Say hi!",
      avatarUrl: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 3,
      name: "Helina",
      lastMessage: "Say hi!",
      avatarUrl: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 4,
      name: "Tsion",
      lastMessage: "Say hi!",
      avatarUrl: "https://i.pravatar.cc/40?img=4",
    },
  ];

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages, selectedUser]);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: input,
    };

    setMessages((prev) => {
      const userMsgs = prev[selectedUser.id] || [];
      return { ...prev, [selectedUser.id]: [...userMsgs, newMsg] };
    });

    setInput("");

    setTimeout(() => {
      setMessages((prev) => {
        const userMsgs = prev[selectedUser.id] || [];
        const replyMsg: Message = {
          id: Date.now() + 1,
          sender: "other",
          text: "Thanks for your message!",
        };
        return { ...prev, [selectedUser.id]: [...userMsgs, replyMsg] };
      });
    }, 1000);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      {/* Chat page container */}
      <div className="relative bg-white mt-2 mb-2 dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-2xl mx-auto h-[500px] overflow-hidden flex flex-col">
        {/* Chat List or Chat Box */}
        {!selectedUser && (
          <>
            <h2 className="p-4 text-xl text-center font-bold border-b border-gray-200 dark:border-zinc-700">
              Chats
            </h2>
            <ul className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedUser(user);
                  }}
                  className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex items-center gap-3"
                  tabIndex={0}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {user.lastMessage}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Go Home Button */}
            <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
    <Button
  className="w-full"
  variant="outline"
  onClick={() => (window.location.href = "/home")}
>
  Go Home
</Button>

            </div>
          </>
        )}

        {selectedUser && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h2 className="text-lg font-bold">{selectedUser.name}</h2>
              </div>
              <Button variant="outline" size="sm" onClick={handleBack}>
                Back
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-zinc-800">
              {(messages[selectedUser.id] || []).length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-10">
                  Say hi to start chat with {selectedUser.name}
                </p>
              )}
              {(messages[selectedUser.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] px-4 py-2 rounded-lg text-sm break-words ${
                    msg.sender === "me"
                      ? "ml-auto bg-blue-600 text-white rounded-br-none"
                      : "mr-auto bg-gray-200 dark:bg-zinc-700 text-black dark:text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex p-3 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            >
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow"
                autoComplete="off"
              />
              <Button type="submit" className="ml-2" disabled={!input.trim()}>
                Send
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
