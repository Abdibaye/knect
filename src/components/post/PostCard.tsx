"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Badge } from "../ui/badge";
import PostMenu from "./postMenu";
import {
  Bookmark,
  CheckIcon,
  Clock,
  FileDown,
  FileText,
  MessageCircle,
  Share2,
  ThumbsUp,
  ChartNoAxesColumn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentForm } from "./CommentForm";
import { CommentList, Comment as CommentType } from "./CommentList";

// Utility to format relative time
function getRelativeTime(dateString?: string) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now.getTime() - date.getTime()) / 1000; // in seconds
  if (isNaN(diff)) return "";
  if (diff < 60) return "just now";
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(diff / 31536000);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

// Types
type Collaborator = { id?: string; name?: string; image?: string };

type Attachment = { name: string; url: string; type?: string };

type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    tags?: string[];
    visibility?: string;
    author?: { name?: string; image?: string };
    authorId?: string;
    likeCount?: number;
    commentCount?: number;
    createdAt?: string;
    // Extended optional academic and content metadata
    university?: string;
    department?: string;
    role?: string; // Student | Lecturer | Researcher | ...
    resourceType?: string; // Research Paper | Event | Lab Material | Discussion | ...
    attachments?: Attachment[];
    views?: number;
    downloads?: number;
    collaborators?: Collaborator[];
    doi?: string;
    citation?: string;
    authorVerified?: boolean;
    summary?: string; // optional short summary separate from content
  };
  initialComments?: CommentType[];
};

// Choose an icon for file by extension
function FileIcon({ ext }: { ext: string }) {
  // Could be extended to map different icons
  return <FileText className="size-4 text-muted-foreground" aria-hidden="true" />;
}

export default function PostCard({ post, initialComments = [] }: PostCardProps) {
  const router = useRouter();
  const postUrl = useMemo(() => `/posts/${post.id}`, [post.id]);

  const imageUrl = post.imageUrl || "/placeholder-image.png";
  const authorImageUrl = post.author?.image ?? "";
  const authorName = post.author?.name || "Unknown";

  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [likeCount, setLikeCount] = useState<number>(post.likeCount ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [likedUsers, setLikedUsers] = useState<{ id: string; name?: string; image?: string }[]>([]);
  const [showLikes, setShowLikes] = useState(false);

  const { data: session } = authClient.useSession();

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
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId: post.id }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
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
      const updated = await fetch(`/api/posts/${post.id}/comments`);
      setComments(await updated.json());
    } catch (err: any) {
      setError(err.message || "Failed to post reply");
    }
  };

  const handleToggleComments = () => setShowComments((prev) => !prev);

  const toggleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to like post");
      const data = await res.json();
      setIsLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      // Optionally show error
    }
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.summary || post.content, url: postUrl });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(location.origin + postUrl);
        // optional toast
      }
    } catch {}
  };

  const filterBy = (key: string, value?: string) => {
    if (!value) return;
    const params = new URLSearchParams({ [key]: value });
    // Navigate to home with filters applied
    router.push(`/home?${params.toString()}`);
  };

  const summary = post.summary || (post.content ? post.content.slice(0, 180) + (post.content.length > 180 ? "…" : "") : "");

  const fetchLikedUsers = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/likes`);
      if (!res.ok) throw new Error("Failed to fetch likes");
      setLikedUsers(await res.json());
      setShowLikes(true);
    } catch {}
  };

  return (
    <article className="rounded-xl overflow-hidden border bg-card text-card-foreground shadow-sm p-4 w-full">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold overflow-hidden">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
                alt={authorName}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">{authorName[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => (window.location.href = `/profile/${post.authorId}`)}
                className="text-sm cursor-pointer font-semibold text-foreground hover:underline"
                aria-label={`${authorName} profile`}
              >
                <span className="truncate max-w-[200px] sm:max-w-[280px] inline-block">{authorName}</span>
              </button>
              {post.authorVerified && (
                <Badge variant="outline" className="gap-1">
                  <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
                  Verified
                </Badge>
              )}
              {post.role && (
                <Badge  variant="outline" className="px-2 py-0.5">{post.role}</Badge>
              )}
              {post.resourceType && (
                <Badge variant="outline" className="px-2 py-0.5">{post.resourceType}</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
              {post.university && (
                <button onClick={() => filterBy("university", post.university)} className="hover:underline text-primary">
                  {post.university}
                </button>
              )}
              {post.university && post.department && <span aria-hidden>•</span>}
              {post.department && (
                <button onClick={() => filterBy("department", post.department)} className="hover:underline text-primary">
                  {post.department}
                </button>
              )}
              <span aria-hidden>•</span>
              <time dateTime={post.createdAt} className="inline-flex items-center gap-1">
                {getRelativeTime(post.createdAt)}
                <Clock className="text-muted-foreground" size={12} aria-hidden="true" />
              </time>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {post.visibility && (
            <Badge variant="outline" className="text-xs font-medium">{post.visibility}</Badge>
          )}
          <PostMenu post={{ id: post.id, authorId: post.authorId }} currentUserId={session?.user.id} />
        </div>
      </header>

      {/* Title & Summary */}
      <section className="mt-2">
        <h2 className="text-xl md:text-2xl font-bold leading-snug">{post.title}</h2>
        {summary && <p className="text-sm md:text-base text-foreground/90 mt-1">{summary}</p>}
      </section>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-3" aria-label="topics">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline" className="rounded-full">#{tag}</Badge>
            </li>
          ))}
        </ul>
      )}

      {/* Image Preview */}
      {post.imageUrl && (
        <figure className="-mx-4 mt-4 overflow-hidden rounded-none border-y bg-transparent">
          <Image
            src={imageUrl}
            alt="Post image"
            width={1200}
            height={630}
            className="block w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </figure>
      )}

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="mt-4 space-y-2" aria-label="attachments">
          {post.attachments.map((f, idx) => {
            const ext = (f.name.split(".").pop() || "").toLowerCase();
            return (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center gap-3 min-w-0">
                  <FileIcon ext={ext} />
                  <span className="text-sm truncate">{f.name}</span>
                </div>
                <a
                  href={f.url}
                  download
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileDown className="size-4" /> Download
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Engagement Row */}
      <nav className="mt-4 grid grid-cols-4 gap-2 text-sm" aria-label="post actions">
        <button
          type="button"
          onClick={toggleLike}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 transition-colors ${
            isLiked ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
          aria-pressed={isLiked}
          aria-label="Like"
        >
          <ThumbsUp className="size-5" />
          <span
            className="cursor-pointer underline decoration-dotted decoration-2 underline-offset-2"
            onClick={e => { e.stopPropagation(); fetchLikedUsers(); }}
            title="View who liked"
          >
            {likeCount}
          </span>
        </button>
        {showLikes && (
          <div className="absolute z-50 bg-card border rounded shadow p-2 mt-2">
            <div className="font-semibold mb-1">Liked by:</div>
            <ul className="max-h-40 overflow-y-auto">
              {likedUsers.length === 0 && <li className="text-xs text-muted-foreground">No likes yet</li>}
              {likedUsers.map(u => (
                <li key={u.id} className="flex items-center gap-2 py-1">
                  {u.image && <img src={u.image} alt={u.name} className="w-5 h-5 rounded-full" />}
                  <span className="text-sm">{u.name || u.id}</span>
                </li>
              ))}
            </ul>
            <button className="mt-2 text-xs text-primary hover:underline" onClick={() => setShowLikes(false)}>Close</button>
          </div>
        )}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Comments"
          onClick={handleToggleComments}
        >
          <MessageCircle className="size-5" />
          <span>{typeof post.commentCount === "number" ? post.commentCount : comments.length}</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Share"
        >
          <Share2 className="size-5" />
          <span>Share</span>
        </button>
        <button
          type="button"
          onClick={() => setIsSaved((v) => !v)}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 transition-colors ${
            isSaved ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
          aria-pressed={isSaved}
          aria-label="Save"
        >
          <Bookmark className="size-5" />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
      </nav>

      {/* Footer Meta */}
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {typeof post.views === "number" && (
            <span className="inline-flex items-center gap-1"><ChartNoAxesColumn className="size-4" />{post.views}</span>
          )}
          {typeof post.downloads === "number" && (
            <span className="inline-flex items-center gap-1"><FileDown className="size-4" />{post.downloads}</span>
          )}
        </div>
        {post.collaborators && post.collaborators.length > 0 && (
          <div className="flex -space-x-2">
            {post.collaborators.slice(0, 5).map((c, i) => (
              <Avatar key={i} className="h-6 w-6 ring-2 ring-background">
                <AvatarImage src={c.image ?? undefined} />
                <AvatarFallback>{c.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </footer>

      {/* Research identifiers */}
      {(post.doi || post.citation) && (
        <div className="mt-2 text-xs italic text-muted-foreground">
          {post.doi && (
            <span>
              DOI: <a className="text-primary hover:underline" href={`https://doi.org/${post.doi}`} target="_blank" rel="noreferrer">{post.doi}</a>
            </span>
          )}
          {post.doi && post.citation && <span className="mx-2">•</span>}
          {post.citation && <span>{post.citation}</span>}
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <section className="mt-4">
          {error && <div className="text-destructive mb-2">{error}</div>}
          {loadingComments ? (
            <div>Loading comments...</div>
          ) : (
            <>
              <CommentForm onSubmit={handleAddComment} />
              <CommentList comments={comments} onReply={handleReply} />
            </>
          )}
        </section>
      )}
    </article>
  );
}