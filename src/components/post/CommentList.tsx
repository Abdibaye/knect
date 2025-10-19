import React, { useState } from "react";
import { ReplyForm } from "./ReplyForm";
import { Clock, ThumbsUp } from "lucide-react";

export type Comment = {
  id: string;
  author: { id: string; name: string; image?: string; university?: string, department?: string } | null;
  content: string;
  createdAt: string;
  replies?: Comment[];
};

interface CommentListProps {
  comments: Comment[];
  onReply?: (parentId: string, reply: string) => void;
}

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

export function CommentList({ comments, onReply }: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (parentId: string, reply: string) => {
    if (onReply) onReply(parentId, reply);
    setReplyingTo(null);
  };

  if (!comments.length) {
    return <div className="text-muted-foreground text-sm mt-2">No comments yet.</div>;
  }
  return (
    <ul className="space-y-3 mt-2">
      {comments.map((comment) => (
        <li id={`comment-${comment.id}`} key={comment.id} className="rounded-br-3xl rounded-tl-3xl p-2 w-fit bg-muted/25">
                <header className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold overflow-hidden">
                      {comment.author?.image ? (
                        <img
                          src={comment.author?.image!}
                          alt={comment.author?.name || "User avatar"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">{comment.author?.name[0]?.toUpperCase() || "?"}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => (window.location.href = `/profile/${comment.author?.id}`)}
                          className="text-sm cursor-pointer font-semibold text-foreground hover:underline"
                          aria-label={`${comment.author?.name} profile`}
                        >
                          <span className="truncate max-w-[200px] sm:max-w-[280px] text-sm/3 inline-block">{comment.author?.name}</span>
                        </button>

                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {comment.author?.university && (
                          <span>{comment.author?.university}</span>
                        )}
                        {comment.author?.university && comment.author?.department && <span aria-hidden>•</span>}
                        {comment.author?.department && (
                          <span>{comment.author?.department}</span>   
                        )}
                        <span aria-hidden>•</span>
                        <time dateTime={comment.createdAt} className="inline-flex items-center gap-1">
                          {getRelativeTime(comment.createdAt)}
                          <Clock className="text-muted-foreground" size={12} aria-hidden="true" />
                        </time>
                      </div>
                    </div>
                  </div>
        
                </header>
          <div className="text-sm mt-4 ml-13 max-w-[400px] text-foreground whitespace-pre-line mb-1">{comment.content}</div>
          <div className="mt-1 pr-2 flex w-full items-center justify-end gap-4 text-muted-foreground">
            <button>
              {/* Placeholder for like button or other actions */}
              <ThumbsUp className="text-muted-foreground" size={12} aria-hidden="true" />
            </button>
            <button
            className="text-xs text-blue-500 hover:underline"
            onClick={() => setReplyingTo(comment.id)}
          >
            Reply
          </button>
          </div>
          {replyingTo === comment.id && (
            <div className="mt-2 flex w-full justify-end">
              <ReplyForm
                onSubmit={(reply) => handleReply(comment.id, reply)}
                onCancel={() => setReplyingTo(null)}
              />
            </div>
          )}
          {/* Render replies recursively */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-2">
              <CommentList comments={comment.replies} onReply={onReply} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}