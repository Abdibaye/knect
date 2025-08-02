import { EllipsisIcon, EyeOff, Flag } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PostMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none"
          aria-label="Open edit menu"
        >
          <EllipsisIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
  )
}
