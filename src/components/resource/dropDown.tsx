import { EllipsisIcon, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FilterComponent from "./filter"

export default function Component() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
           variant="outline" className="flex items-center space-x-2"
        >
         <Filter />
         filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        
            <FilterComponent />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
