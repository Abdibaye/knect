
import React from 'react'
import SidebarItem from "./item"
import { LucideIcon,
    House,
    Telescope,
    CalendarArrowUp,
    FolderOpenDot,
    NotebookPen,
    HandCoins,
} from "lucide-react"
interface ISidebarItem{
    name: string;
    icon: LucideIcon;
    path: string ;
}
const items: ISidebarItem[] = [
   {
    name:"Home",
    icon: House,
    path:"/",
   },
   {
    name:"Discover",
    icon: Telescope,
    path:"/discover",
   },
   {
    name:"Resources",
    icon: FolderOpenDot,
    path:"/resources",
   },
   {
    name:"Study Group",
    icon: NotebookPen,
    path:"/study group",
   },
   {
    name:"Events",
    icon: CalendarArrowUp,
    path:"/events",
   },
   {
    name:"Mentorship",
    icon: HandCoins,
    path:"/mentorship",
   },

];

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10">
        <div className="flex flex-col w-full space-y-10">
        <h1	className="text-3xl font-sans font-semibold w-full italic  tracking-tight ml-4 p-3"> Knect </h1>
         <div className="flex flex-col space-y-1">
                {items.map(item=>[
               <SidebarItem key={item.path} item={item}/>
            ]

            )
            }
            </div>
        
    </div>
    </div>
  )
}

export default Sidebar