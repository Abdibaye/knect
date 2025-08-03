"use client";

import { useContructUrl } from "@/hooks/use-contruct";
import { Bookmark, ChartColumn, ChartNoAxesColumn, CheckIcon, Ellipsis, MessageCircle, Share2, ThumbsUp, View } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useState } from "react";
import PostMenu from "./postMenu";



type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    tags?: string[];
    visibility?: string;
    author?: {name?: string; image?: string };
    authorId?: string;
    likeCount?: number;
    commentCount?: number;
    createdAt?: string;
  };
};


export default function PostCard({ post }: PostCardProps) {
  const imageUrl = useContructUrl(post.imageUrl);
  const authorImageUrl = post.author?.image ?? ""
  const authorName = post.author?.name || "Unknown";
  const [menu, setMenu] = useState(false);

  
  return (
    <div className="rounded-xl border lg:ml-15 bg-white dark:bg-zinc-900 shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold overflow-hidden">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
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
           <div className="flex items-center gap-1">
             <button onClick={() => (window.location.href = `/profile/${post.authorId}`)} className="text-sm cursor-pointer font-semibold text-foreground hover:underline">
              <div className="font-semibold text-sm text-foreground">
              {authorName}
            </div>
             </button>
            <Badge variant="outline" className="gap-1">
      <CheckIcon className="text-emerald-500 items-center" size={12} aria-hidden="true" />
      verified
    </Badge>
           </div>
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
          <PostMenu  />
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
      <div className="flex justify-between mx-2 text-muted-foreground mt-3 text-sm">
        <div className="flex items-center gap-1">
          <ThumbsUp className="size-5" />
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="size-5" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <ChartNoAxesColumn className="size-5" />
            <span>100</span>
          </div>
          <Bookmark className="size-5" />
        </div>
      </div>
    </div>
  );
}
