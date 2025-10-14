"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { XIcon, ImageIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type CreatePostProps = {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
};

export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/s3", { method: "POST", body: formData });
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Upload failed");
    }
    if (!contentType?.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Unexpected response: ${text}`);
    }
    const data = await res.json();
    if (!data.url) throw new Error("Missing URL from upload response");
    return data.url as string;
  };

  const handleMediaUpload = async (file: File, type: "image" | "video") => {
    try {
      setUploading(true);
      setMedia(file);
      setMediaType(type);
      toast.success(`${type} selected`);
    } catch (err: any) {
      toast.error(`${type} selection failed: ` + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      let imageUrl = undefined;
      if (media) {
        imageUrl = await uploadToS3(media);
      }

      const postData = {
        content,
        imageUrl,
        mediaType,
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || "Failed to create post");
      }

      const data = await res.json();
      onSubmit?.(data);

      // Reset form
      setContent("");
      setMedia(null);
      setMediaType(null);
      toast.success("Post created");
    } catch (err: any) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-card text-card-foreground rounded-xl shadow-lg p-6">
          <p>Please log in to create a post.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-card text-card-foreground rounded-xl shadow-lg w-full max-w-xl mx-auto p-6 border border-border">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">Create a Post</h2>

        {/* User Avatar and Name */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.name}</p>
          </div>
        </div>

        {/* Content Textarea */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full border-none resize-none focus:ring-0 text-lg mb-6"
        />

        {/* Media Preview */}
        {media && mediaType === "image" && (
          <img src={URL.createObjectURL(media)} alt="Preview" className="mb-4 max-h-64 rounded-lg border" />
        )}
        {media && mediaType === "video" && (
          <video src={URL.createObjectURL(media)} controls className="mb-4 max-h-64 rounded-lg border" />
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-4">
            <label htmlFor="image-upload" className="cursor-pointer p-2 rounded-full hover:bg-muted">
              <ImageIcon size={24} className="text-muted-foreground hover:text-foreground" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMediaUpload(file, "image");
                }}
              />
            </label>
            <label htmlFor="video-upload" className="cursor-pointer p-2 rounded-full hover:bg-muted">
              <VideoIcon size={24} className="text-muted-foreground hover:text-foreground" />
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMediaUpload(file, "video");
                }}
              />
            </label>
          </div>
          <Button onClick={handleSubmit} disabled={loading || uploading || !content.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}