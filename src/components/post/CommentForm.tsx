"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(comment);
    setComment("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <Textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="min-h-[60px]"
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !comment.trim()} size="sm">
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}