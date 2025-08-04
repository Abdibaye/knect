// "use client";

// import { useState } from "react";
// import { Calendar, MapPin, Clock, Users, Search, Filter } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// const events = [
//   {
//     id: "1",
//     title: "Frontend Developer Meetup",
//     description:
//       "Join us for an evening of discussions about the latest frontend technologies and trends.",
//     date: "2024-01-15",
//     time: "18:00",
//     location: "Tech Hub, Downtown",
//     attendees: 45,
//     maxAttendees: 100,
//     category: "Meetup",
//     isOnline: false,
//     price: "Free",
//     organizer: "Frontend Community",
//     tags: ["React", "JavaScript", "Networking"],
//   },
//   {
//     id: "2",
//     title: "React Workshop: Building Modern UIs",
//     description:
//       "Hands-on workshop covering advanced React patterns and best practices.",
//     date: "2024-01-18",
//     time: "10:00",
//     location: "Online",
//     attendees: 78,
//     maxAttendees: 150,
//     category: "Workshop",
//     isOnline: true,
//     price: "$49",
//     organizer: "React Academy",
//     tags: ["React", "Workshop", "UI/UX"],
//   },
//   {
//     id: "3",
//     title: "Design Systems Conference",
//     description:
//       "A full-day conference about building and maintaining design systems at scale.",
//     date: "2024-01-22",
//     time: "09:00",
//     location: "Convention Center",
//     attendees: 234,
//     maxAttendees: 500,
//     category: "Conference",
//     isOnline: false,
//     price: "$199",
//     organizer: "Design Collective",
//     tags: ["Design Systems", "UI/UX", "Conference"],
//   },
//   {
//     id: "4",
//     title: "API Development Bootcamp",
//     description:
//       "Intensive 3-day bootcamp on building robust APIs with modern technologies.",
//     date: "2024-01-25",
//     time: "09:00",
//     location: "Learning Center",
//     attendees: 28,
//     maxAttendees: 50,
//     category: "Bootcamp",
//     isOnline: false,
//     price: "$299",
//     organizer: "Code Academy",
//     tags: ["API", "Backend", "Bootcamp"],
//   },
// ];

// export default function EventsPage() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   const filteredEvents = events.filter(
//     (event) =>
//       event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.tags.some((tag) =>
//         tag.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-black">
//       <div className="flex">
//         <main className="flex-1">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//             <div className="mb-8">
//               <div className="flex items-center space-x-3 mb-4">
//                 <Calendar className="h-8 w-8 text-blue-600" />
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                   Events
//                 </h1>
//               </div>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Discover upcoming events, workshops, and conferences in your
//                 area
//               </p>
//             </div>

//             <div className="mb-6 flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   type="text"
//                   placeholder="Search events..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Button variant="outline" className="flex items-center space-x-2">
//                 <Filter className="h-4 w-4" />
//                 <span>Filter</span>
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {filteredEvents.map((event) => (
//                 <Card
//                   key={event.id}
//                   className="hover:shadow-lg transition-shadow"
//                 >
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">
//                           {event.title}
//                         </CardTitle>
//                         <div className="flex items-center space-x-2 mb-2">
//                           <Badge variant="secondary">{event.category}</Badge>
//                           {event.isOnline && (
//                             <Badge variant="outline">Online</Badge>
//                           )}
//                           <Badge variant="outline">{event.price}</Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-600 dark:text-gray-400 mb-4">
//                       {event.description}
//                     </p>

//                     <div className="space-y-2 mb-4">
//                       <div className="flex items-center space-x-2 text-sm text-gray-500">
//                         <Calendar className="h-4 w-4" />
//                         <span>{new Date(event.date).toLocaleDateString()}</span>
//                         <Clock className="h-4 w-4 ml-2" />
//                         <span>{event.time}</span>
//                       </div>
//                       <div className="flex items-center space-x-2 text-sm text-gray-500">
//                         <MapPin className="h-4 w-4" />
//                         <span>{event.location}</span>
//                       </div>
//                       <div className="flex items-center space-x-2 text-sm text-gray-500">
//                         <Users className="h-4 w-4" />
//                         <span>
//                           {event.attendees}/{event.maxAttendees} attendees
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-1 mb-4">
//                       {event.tags.map((tag) => (
//                         <Badge key={tag} variant="outline" className="text-xs">
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-500">
//                         by {event.organizer}
//                       </span>
//                       <div className="flex space-x-2">
//                         <Button size="sm" variant="outline">
//                           Learn More
//                         </Button>
//                         <Button size="sm">Register</Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock, Users, Search, Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface User {
  name: string;
  // add more user fields as needed later
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  time: string; // e.g. "18:00"
  location: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  isOnline: boolean;
  price: string;
  createdBy: User;
  createdAt: string; // ISO datetime string
  posterUrl?: string;
  tags: string[];
}

const events: Event[] = [
  {
    id: "1",
    title: "Frontend Developer Meetup",
    description:
      "Join us for an evening of discussions about the latest frontend technologies and trends.",
    date: "2024-01-15",
    time: "18:00",
    location: "Tech Hub, Downtown",
    attendees: 45,
    maxAttendees: 100,
    category: "Meetup",
    isOnline: false,
    price: "Free",
    createdBy: { name: "Frontend Community" },
    createdAt: "2023-12-01T12:00:00Z",
    posterUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "JavaScript", "Networking"],
  },
  {
    id: "2",
    title: "React Workshop: Building Modern UIs",
    description:
      "Hands-on workshop covering advanced React patterns and best practices.",
    date: "2024-01-18",
    time: "10:00",
    location: "Online",
    attendees: 78,
    maxAttendees: 150,
    category: "Workshop",
    isOnline: true,
    price: "$49",
    createdBy: { name: "React Academy" },
    createdAt: "2023-12-05T09:30:00Z",
    posterUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Workshop", "UI/UX"],
  },
  {
    id: "3",
    title: "Design Systems Conference",
    description:
      "A full-day conference about building and maintaining design systems at scale.",
    date: "2024-01-22",
    time: "09:00",
    location: "Convention Center",
    attendees: 234,
    maxAttendees: 500,
    category: "Conference",
    isOnline: false,
    price: "$199",
    createdBy: { name: "Design Collective" },
    createdAt: "2023-12-10T15:00:00Z",
    posterUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Design Systems", "UI/UX", "Conference"],
  },
  {
    id: "4",
    title: "API Development Bootcamp",
    description:
      "Intensive 3-day bootcamp on building robust APIs with modern technologies.",
    date: "2024-01-25",
    time: "09:00",
    location: "Learning Center",
    attendees: 28,
    maxAttendees: 50,
    category: "Bootcamp",
    isOnline: false,
    price: "$299",
    createdBy: { name: "Code Academy" },
    createdAt: "2023-12-15T10:00:00Z",
    posterUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    tags: ["API", "Backend", "Bootcamp"],
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sort events by date ascending
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter events by search query
  const filteredEvents = sortedEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Events
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Discover upcoming events, workshops, and conferences in your area
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              {/* Poster image if exists */}
              {event.posterUrl && (
                <img
                  src={event.posterUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{event.category}</Badge>
                      {event.isOnline && (
                        <Badge variant="outline">Online</Badge>
                      )}
                      <Badge variant="outline">{event.price}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendees}/{event.maxAttendees} attendees
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    by {event.createdBy.name}
                  </span>
                  <span className="text-xs text-gray-400 italic">
                    Created: {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                    <Button size="sm">Register</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
