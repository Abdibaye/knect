
import { Delete, EllipsisIcon, EyeOff, Flag, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


type PostMenuProps = {
  post: { id: string; authorId?: string };
  currentUserId?: string;
  onDelete?: () => void;
};

export default function PostMenu({ post, currentUserId, onDelete }: PostMenuProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      toast.success("Post deleted");
      if (onDelete) onDelete();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post");
    } finally {
      setLoading(false);
    }
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none hover:bg-transparent border border-transparent hover:border-accent"
          aria-label="Open edit menu"
        >
          <EllipsisIcon size={16} aria-hidden="true" />
          
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {currentUserId === post.authorId && (
          <DropdownMenuItem onClick={handleDelete} disabled={loading}>
            <div className="flex items-center gap-2">
              <Trash2 className="mr-2" size={16} />
              <p>{loading ? "Deleting..." : "Delete Post"}</p>
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <div className="flex items-center gap-2">
            <Flag className="mr-2" size={16} />
            <p>Report Post</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex items-center gap-2">
            <EyeOff className="mr-2" size={16} />
            <p>Not Interested</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
