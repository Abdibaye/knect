"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { XIcon, ImageIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import MultipleImageUploader from "./multipleImageUploader";
import type { UploadedFile } from "@/hooks/use-file-upload";

type CreatePostProps = {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
};

export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👇 Auto-resize effect
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

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
      const attachments: { name: string; url: string; type: string }[] = [];

      // If a single video is selected, upload it as imageUrl/mediaType=video
      if (media && mediaType === "video") {
        imageUrl = await uploadToS3(media);
      }

      // Upload all selected images and add to attachments
      if (images.length > 0) {
        for (const item of images) {
          // UploadedFile.file may be a pseudo File when coming from initial, skip upload in that case
          // but in CreatePost we don't set initial, so it's a real File; still guard gracefully
          const file = item.file as File;
          if (file && file.size >= 0) {
            const url = await uploadToS3(file);
            attachments.push({ name: file.name, url, type: file.type || "image/*" });
          }
        }
      }

      const postData = {
        content,
        imageUrl,
        mediaType,
        attachments: attachments.length ? attachments : undefined,
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

      setContent("");
      setMedia(null);
      setMediaType(null);
      setImages([]);
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

        {/* Auto-resizing Textarea */}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[80px] border-none resize-none focus:ring-0 text-lg mb-6 overflow-hidden"
        />

        {/* Media Preview */}
        {media && mediaType === "video" && (
          <video src={URL.createObjectURL(media)} controls className="mb-4 max-h-64 rounded-lg border" />
        )}
        <MultipleImageUploader onChange={setImages} maxFiles={6} maxSizeMB={5} />
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-4">
            {/* Image uploads handled by MultipleImageUploader */}
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
