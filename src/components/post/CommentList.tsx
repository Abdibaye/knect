import React, { useState } from "react";
import { ReplyForm } from "./ReplyForm";

export type Comment = {
  id: string;
  author: { id: string; name: string; image?: string };
  content: string;
  createdAt: string;
  replies?: Comment[];
};

interface CommentListProps {
  comments: Comment[];
  onReply?: (parentId: string, reply: string) => void;
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
        <li key={comment.id} className="border rounded-md p-2 bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            {comment.author?.image && (
              <img
                src={comment.author.image}
                alt={comment.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="font-semibold text-xs text-foreground">{comment.author?.name || "Unknown"}</span>
            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-sm text-foreground whitespace-pre-line mb-1">{comment.content}</div>
          <button
            className="text-xs text-blue-500 hover:underline"
            onClick={() => setReplyingTo(comment.id)}
          >
            Reply
          </button>
          {replyingTo === comment.id && (
            <ReplyForm
              onSubmit={(reply) => handleReply(comment.id, reply)}
              onCancel={() => setReplyingTo(null)}
            />
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