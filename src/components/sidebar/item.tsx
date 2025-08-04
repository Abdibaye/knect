 import React from 'react'
 import { LucideIcon } from 'lucide-react';
 interface ISidebarItem{
    name: string;
    icon: LucideIcon;
    path: string ;
 }
 const SidebarItem = ({item}: {item: ISidebarItem}) => {
    const {name, icon: Icon } = item;
   return (
     <div className="flex items-center space-x-2 p-3 hover:bg-gray-400 cursor-pointer hover:text-background
     ">
          <Icon size={20}/> 
      <p className="text-sm font-semibold">{name}</p>
     </div>
   )
 }
 
 export default SidebarItem;
