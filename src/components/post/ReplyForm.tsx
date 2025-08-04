"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ReplyFormProps {
  onSubmit: (reply: string) => void;
  onCancel?: () => void;
}

export function ReplyForm({ onSubmit, onCancel }: ReplyFormProps) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(reply);
    setReply("");
    setLoading(false);
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <Textarea
        value={reply}
        onChange={e => setReply(e.target.value)}
        placeholder="Write a reply..."
        className="min-h-[40px]"
        required
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" disabled={loading || !reply.trim()} size="sm">
          {loading ? "Replying..." : "Reply"}
        </Button>
      </div>
    </form>
  );
}