"use client";

import { useContructUrl } from "@/hooks/use-contruct";
import { Share2 } from "lucide-react";
import Image from "next/image";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    tags?: string[];
    visibility?: string;
    author?: { name?: string; image?: string };
    likeCount?: number;
    commentCount?: number;
    createdAt?: string;
  };
};


export default function PostCard({ post }: PostCardProps) {
  const imageUrl = useContructUrl(post.imageUrl);
  const authorName = post.author?.name || "Unknown";
  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold overflow-hidden">
            {imageUrl && typeof imageUrl === "string" && imageUrl !== "" ? (
              <Image
                src={post.imageUrl}
                alt={authorName}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">
                {authorName[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">
              {authorName}
            </span>
            <span className="text-xs text-muted-foreground">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {post.visibility && (
            <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium">
              {post.visibility}
            </span>
          )}
          <button className="text-lg font-bold px-1">⋯</button>
        </div>
      </div>
      {/* Title */}
      <h3 className="text-base font-bold mt-2 text-foreground">{post.title}</h3>
      {/* Content */}
      <p className="text-sm text-foreground mt-1 whitespace-pre-line">{post.content}</p>
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {/* Image */}
      {post.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border max-h-80">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={800}
            height={400}
            className="w-full h-full object-cover"
            style={{ maxHeight: 320 }}
          />
        </div>
      )}
      {/* Footer Icons */}
      <div className="flex justify-around text-muted-foreground mt-3 text-sm">
        <div className="flex items-center gap-1">
          <span>♡</span> <span>{post.likeCount ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💬</span> <span>{post.commentCount ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-3 h-3 text-gray-600 dark:text-gray-300 cursor-pointer" /> <span>Share</span>
        </div>
      </div>
    </div>
  );
}
