"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { XIcon, FileDown, FileText } from "lucide-react";

type Attachment = { name: string; url: string; type?: string };

type CreatePostProps = {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
};

export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState<string>("");
  const [imageUrl, setImageUrl] = useState(""); // Cover image URL
  const [image, setImage] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [resourceType, setResourceType] = useState("");
  const [role, setRole] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [doi, setDoi] = useState("");
  const [citation, setCitation] = useState("");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    // Event-specific fields
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");


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

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadToS3(file);
      setImageUrl(url);
      toast.success("Image uploaded");
      return url;
    } catch (err: any) {
      toast.error("Image upload failed: " + err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleAttachmentsUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploads: Attachment[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToS3(file);
        uploads.push({ name: file.name, url, type: file.type });
      }
      setAttachments((prev) => [...prev, ...uploads]);
      toast.success("Attachment(s) uploaded");
    } catch (err: any) {
      toast.error("Attachment upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload cover image if selected but no URL yet
      let coverUrl = imageUrl;
      if (image && !imageUrl) {
        coverUrl = await handleImageUpload(image);
      }

      // Build eventDetails if resourceType is Event
      let eventDetails = undefined;
      if (resourceType === "Event") {
        eventDetails = {
          date: eventDate || undefined,
          location: eventLocation || undefined,
        };
      }

      const postData = {
        title,
        summary,
        content,
        imageUrl: coverUrl,
        visibility,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        // Optional academic metadata
        resourceType: resourceType || undefined,
        role: role || undefined,
        university: university || undefined,
        department: department || undefined,
        doi: doi || undefined,
        citation: citation || undefined,
        attachments: attachments.length ? attachments : undefined,
        eventDetails,
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
      setTitle("");
      setSummary("");
      setContent("");
      setVisibility("public");
      setTags("");
      setImageUrl("");
      setImage(null);
      setAttachments([]);
      setResourceType("");
      setRole("");
      setUniversity("");
      setDepartment("");
      setDoi("");
      setCitation("");
  // Reset event fields
  setEventDate("");
  setEventLocation("");
  toast.success("Post created");
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-card text-card-foreground rounded-xl shadow-lg w-full max-w-xl mx-auto p-6 max-h-[90vh] overflow-y-auto border border-border">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">Create a Post</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <Label className="ml-1" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              required
            />
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-1">
            <Label className="ml-1" htmlFor="summary">
              Summary (1–2 sentences)
            </Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of your post..."
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <Label className="ml-1" htmlFor="content">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post here..."
              rows={5}
              required
            />
          </div>

          {/* Resource Type & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="ml-1" htmlFor="resourceType">
                Resource Type
              </Label>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger id="resourceType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Discussion">Discussion</SelectItem>
                  <SelectItem value="opportunity">opportunity</SelectItem>
                  <SelectItem value="Research Paper">Research Paper</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Lab Material">Lab Material</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="ml-1" htmlFor="role">
                Your Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                  <SelectItem value="Researcher">Researcher</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* University & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="ml-1" htmlFor="university">
                University
              </Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Addis Ababa University"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="ml-1" htmlFor="department">
                Department
              </Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Electrical Engineering"
              />
            </div>
          </div>

          {/* DOI & Citation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="ml-1" htmlFor="doi">
                DOI (optional)
              </Label>
              <Input
                id="doi"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g. 10.1000/xyz123"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="ml-1" htmlFor="citation">
                Citation (optional)
              </Label>
              <Input
                id="citation"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
                placeholder="APA/IEEE citation..."
              />
            </div>
          </div>

          {/* Event-specific fields (only for Event resourceType) */}
          {resourceType === "Event" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="ml-1" htmlFor="eventDate">
                  Event Date
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required={resourceType === "Event"}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="ml-1" htmlFor="eventLocation">
                  Event Location
                </Label>
                <Input
                  id="eventLocation"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Main Hall, Addis Ababa University"
                  required={resourceType === "Event"}
                />
              </div>
            </div>
          )}
          {/* Visibility */}
          <div className="flex flex-col gap-1">
            <Label className="ml-1" htmlFor="visibility">
              Visibility
            </Label>
            <Select onValueChange={setVisibility} value={visibility}>
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <Label className="ml-1" htmlFor="tags">
              Tags (comma separated)
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. AIResearch, Engineering, ML"
            />
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <Label className="ml-1" htmlFor="image">
              Upload Cover Image (optional)
            </Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  await handleImageUpload(file);
                }
              }}
            />
            {image && (
              <p className="text-sm text-muted-foreground mt-1">Selected: {image.name}</p>
            )}
            {imageUrl && (
              <img src={imageUrl} alt="Uploaded" className="mt-3 max-h-48 rounded-xl border shadow-sm" />
            )}
          </div>

          {/* Attachments */}
          <div className="flex flex-col gap-2">
            <Label className="ml-1" htmlFor="attachments">
              Attach Files (PDF, PPT, DOC)
            </Label>
            <Input
              type="file"
              id="attachments"
              accept=".pdf,.ppt,.pptx,.doc,.docx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length) {
                  await handleAttachmentsUpload(files);
                }
              }}
            />
            {attachments.length > 0 && (
              <ul className="mt-2 space-y-2">
                {attachments.map((a, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg border p-2 bg-muted/30">
                    <span className="flex items-center gap-2 text-sm truncate">
                      <FileText className="size-4 text-muted-foreground" /> {a.name}
                    </span>
                    <a href={a.url} download className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      <FileDown className="size-4" /> Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          {/* Submit & Cancel */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}