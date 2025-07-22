"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

// Helper to upload image and get URL (uses /api/s3, with progress)
async function uploadImage(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/s3");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.url);
        } catch (err) {
          reject(new Error("Invalid server response"));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.error || "Failed to upload image"));
        } catch {
          reject(new Error("Failed to upload image"));
        }
      }
    };
    xhr.onerror = () => reject(new Error("Failed to upload image"));
    xhr.send(formData);
  });
}

type CreatePostProps = {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
};

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
  { value: "FRIENDS", label: "Friends" },
];

export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    setProgress(0);
    let imageUrl = "";
    try {
      if (image) {
        imageUrl = await uploadImage(image, setProgress);
      }
      const postData = {
        title,
        content,
        imageUrl: imageUrl || undefined,
        visibility,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }
      setSuccess(true);
      setTitle("");
      setContent("");
      setVisibility("");
      setTags("");
      setImage(null);
      if (onSubmit) onSubmit(postData);
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border  bg-white dark:bg-zinc-900 lg:mr-120 mr-25 shadow-sm p-4 w-full">
      <h2 className="text-xl text-center font-bold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-5 ">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-2"
          />
        </div>
        {/* Content */}
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            className="w-full mt-2"
          />
        </div>
        {/* Visibility */}
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <Select onValueChange={setVisibility} value={visibility}>
            <SelectTrigger id="visibility" className="w-full mt-2">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Comma separated tags (e.g. react, nextjs, prisma)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full mt-2"
          />
        </div>
        {/* Image Upload */}
        <div>
          <Label htmlFor="image">Upload Image</Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full mt-2"
          />
          {image && (
            <>
              <p className="text-sm text-gray-500 mt-1">Selected: {image.name}</p>
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded border"
                  style={{ objectFit: "cover", maxHeight: 200 }}
                />
              </div>
            </>
          )}
          {loading && progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        {/* Error/Success/Loading */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Post created successfully!</p>}
        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onCancel) onCancel();
              setTitle("");
              setContent("");
              setVisibility("");
              setTags("");
              setImage(null);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
