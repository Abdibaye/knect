"use client";

import { useContructUrl } from "@/hooks/use-contruct";
import { Bookmark, ChartNoAxesColumn, CheckIcon, MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { CommentList, Comment as CommentType } from "./CommentList";
import { Badge } from "../ui/badge";
import PostMenu from "./postMenu";

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
  initialComments?: CommentType[];
};

export default function PostCard({ post, initialComments = [] }: PostCardProps) {
  const imageUrl = useContructUrl(post.imageUrl);
  const authorImageUrl = post.author?.image ?? "";
  const authorName = post.author?.name || "Unknown";
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments from backend
  useEffect(() => {
    if (!showComments) return;
    const fetchComments = async () => {
      setLoadingComments(true);
      setError(null);
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch comments");
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [showComments, post.id]);

  // Add a new top-level comment
  const handleAddComment = async (content: string) => {
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId: post.id }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      // Refetch comments after posting
      const updated = await fetch(`/api/posts/${post.id}/comments`);
      setComments(await updated.json());
    } catch (err: any) {
      setError(err.message || "Failed to post comment");
    }
  };

  // Add a reply to a comment by id (recursive, via API)
  const handleReply = async (parentId: string, reply: string) => {
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply, postId: post.id, parentId }),
      });
      if (!res.ok) throw new Error("Failed to post reply");
      // Refetch comments after posting
      const updated = await fetch(`/api/posts/${post.id}/comments`);
      setComments(await updated.json());
    } catch (err: any) {
      setError(err.message || "Failed to post reply");
    }
  };

  const handleToggleComments = () => setShowComments((prev) => !prev);

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
              <div className="font-semibold text-sm text-foreground">
                {authorName}
              </div>
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
          <PostMenu />
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
            src={imageUrl}
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
          <button
            type="button"
            className="flex items-center gap-1 focus:outline-none hover:text-primary"
            aria-label="Show comments"
            onClick={handleToggleComments}
          >
            <MessageCircle className="size-5" />
            <span>{typeof post.commentCount === 'number' ? post.commentCount : comments.length}</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <ChartNoAxesColumn className="size-5" />
            <span>100</span>
          </div>
          <Bookmark className="size-5" />
        </div>
      </div>
      {/* Comments Section (hidden by default, toggled by button) */}
      {showComments && (
        <div className="mt-4">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {loadingComments ? (
            <div>Loading comments...</div>
          ) : (
            <>
              <CommentForm onSubmit={handleAddComment} />
              <CommentList comments={comments} onReply={handleReply} />
            </>
          )}
        </div>
      )}
    </div>
  );
}