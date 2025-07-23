
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
import { XIcon } from "lucide-react";

type CreatePostProps = {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
};

export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      description,
      category,
      image,
    };

    if (onSubmit) onSubmit(postData);

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-xl mx-auto p-6">
        {/* Close Button (top-right) */}
        <button
          onClick={() => {
            if (onCancel) onCancel();
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-4">
          Create a Post
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
         

          {/* Description */}
          <div>
            {/* <Label htmlFor="description">What's in your mind</Label> */}
            <Textarea
              id="description"
              placeholder="Write your post here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">General</SelectItem>
                <SelectItem value="news">Questions</SelectItem>
                <SelectItem value="fun">Opportunity</SelectItem>
                <SelectItem value="fun">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {image.name}
              </p>
            )}
          </div>

          {/* Submit & Cancel */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (onCancel) onCancel();
                setTitle("");
                setDescription("");
                setCategory("");
                setImage(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Post</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
