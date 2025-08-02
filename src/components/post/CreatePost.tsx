// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { XIcon } from "lucide-react";

// type CreatePostProps = {
//   onSubmit?: (data: any) => void;
//   onCancel?: () => void;
// };

// export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState(""); // was description
//   const [category, setCategory] = useState("");
//   const [visibility, setVisibility] = useState("public");
//   const [tags, setTags] = useState<string>("");
//   const [imageUrl, setImageUrl] = useState(""); // URL string for API
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Optional: handle image upload here if needed
//   // For now, just set imageUrl to empty or a placeholder

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // If you want to upload the image, do it here and set imageUrl
//     // For now, just skip image upload

//     const postData = {
//       title,
//       content,
//       imageUrl,
//       visibility,
//       tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
//     };

//     try {
//       const res = await fetch("/api/posts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(postData),
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || "Failed to create post");
//       }
//       const data = await res.json();
//       if (onSubmit) onSubmit(data);

//       // Reset form
//       setTitle("");
//       setContent("");
//       setCategory("");
//       setVisibility("public");
//       setTags("");
//       setImageUrl("");
//       setImage(null);
//     } catch (err: any) {
//       setError(err.message || "Failed to create post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
//       <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-xl mx-auto p-6">
//         {/* Close Button (top-right) */}
//         <button
//           onClick={() => {
//             if (onCancel) onCancel();
//           }}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//           aria-label="Close"
//         >
//           <XIcon size={18} />
//         </button>

//         <h2 className="text-xl font-semibold text-center mb-4">
//           Create a Post
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Title */}
//           <div>
//             <Label htmlFor="title">Title</Label>
//             <Input
//               id="title"
//               placeholder="Post title..."
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>

//           {/* Content */}
//           <div>
//             <Label htmlFor="content">Content</Label>
//             <Textarea
//               id="content"
//               placeholder="Write your post here..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               rows={5}
//               required
//             />
//           </div>

//           {/* Visibility */}
//           <div>
//             <Label htmlFor="visibility">Visibility</Label>
//             <Select onValueChange={setVisibility} value={visibility}>
//               <SelectTrigger id="visibility">
//                 <SelectValue placeholder="Select visibility" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="public">Public</SelectItem>
//                 <SelectItem value="private">Private</SelectItem>
//                 <SelectItem value="friends">Friends</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Tags */}
//           <div>
//             <Label htmlFor="tags">Tags (comma separated)</Label>
//             <Input
//               id="tags"
//               placeholder="e.g. react, nextjs, webdev"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//             />
//           </div>

//           {/* Image Upload (optional, not sent to API unless you handle upload) */}
//           <div>
//             <Label htmlFor="image">Upload Image (optional)</Label>
//             <Input
//               type="file"
//               id="image"
//               accept="image/*"
//               onChange={(e) => setImage(e.target.files?.[0] || null)}
//             />
//             {image && (
//               <p className="text-sm text-gray-500 mt-1">
//                 Selected: {image.name}
//               </p>
//             )}
//           </div>

//           {error && (
//             <div className="text-red-500 text-sm">{error}</div>
//           )}

//           {/* Submit & Cancel */}
//           <div className="flex justify-end gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 if (onCancel) onCancel();
//                 setTitle("");
//                 setContent("");
//                 setCategory("");
//                 setVisibility("public");
//                 setTags("");
//                 setImageUrl("");
//                 setImage(null);
//               }}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Posting..." : "Post"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
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
import { XIcon } from "lucide-react";

type CreatePostProps = {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
};

export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState<string>("");
  const [imageUrl, setImageUrl] = useState(""); // Final image URL
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/s3", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();

        if (!data.url) {
          throw new Error("Image upload response missing URL.");
        }

        setImageUrl(data.url); // update the image URL state
        return data.url;
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response from upload API: ${text}`);
      }
    } catch (err: any) {
      console.error("Image upload failed:", err.message);
      toast.error("Image upload failed: " + err.message);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let uploadedImageUrl = "";

    // Upload the image if one is selected
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const res = await fetch("/api/s3", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Image upload failed");

        uploadedImageUrl = data.url;
        setImageUrl(uploadedImageUrl);
      } catch (err: any) {
        setError("Image upload failed: " + err.message);
        setLoading(false);
        return;
      }
    }

    const postData = {
      title,
      content,
      imageUrl: uploadedImageUrl,
      visibility,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      const data = await res.json();
      if (onSubmit) onSubmit(data);

      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setVisibility("public");
      setTags("");
      setImageUrl("");
      setImage(null);
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Create a Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post here..."
              rows={5}
              required
            />
          </div>

          <div>
            <Label htmlFor="visibility">Visibility</Label>
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

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. react, nextjs"
            />
          </div>

          <div>
            <Label htmlFor="image">Upload Image (optional)</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  handleImageUpload(file); // upload immediately
                }
              }}
            />
            {image && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {image.name}
              </p>
            )}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-3 max-h-48 rounded shadow"
              />
            )}
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
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