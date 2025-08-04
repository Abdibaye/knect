import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Component() {
  const id = useId()
  return (
    <div className="flex flex-col gap-4 p-2">
        <div className="flex items-center gap-2" >
           <Checkbox id={id} />
        <p className="text-gray-600 dark:text-gray-400 text-sm" key={id}>Sort by Start Date</p> 
        </div>
       <div className="flex items-center gap-2">
         <Checkbox id={id} />
         <p  className="text-gray-600 dark:text-gray-400 text-sm" key={id}> Group by Catagories</p> 
       </div>
      
    </div>
  )
}
