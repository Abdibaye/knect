"use client";

import { useState } from "react";
import { EventSkeleton } from "./event-skeleton";
import { Calendar, MapPin, Clock, Users, Search, Filter, Plus } from "lucide-react";
import { EventForm } from "./event-form";
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


import { useEffect } from "react";

type EventPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  eventDetails?: {
    date?: string;
    location?: string;
    posterUrl?: string;
    time?: string;
    category?: string;
    isOnline?: boolean;
    price?: string;
    attendees?: number;
    maxAttendees?: number;
    tags?: string[];
  };
  author?: { name?: string };
};


export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<EventPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error(data.error || "Failed to fetch events");
        setEvents(data.filter((post: any) => post.resourceType === "Event"));
      } catch (err: any) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Sort and filter events
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.eventDetails?.date ? new Date(a.eventDetails.date).getTime() : 0;
    const dateB = b.eventDetails?.date ? new Date(b.eventDetails.date).getTime() : 0;
    return dateA - dateB;
  });
  const filteredEvents = sortedEvents.filter((event) => {
    const title = event.title?.toLowerCase() || "";
    const content = event.content?.toLowerCase() || "";
    const tags = event.eventDetails?.tags || [];
    return (
      title.includes(searchQuery.toLowerCase()) ||
      content.includes(searchQuery.toLowerCase()) ||
      tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen dark:bg-red relative">
      {/* Overlay when modal open */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>
      )}

      {/* Wrap main content for blur when modal open */}
      <div className={showEventForm ? "blur-sm pointer-events-none select-none" : ""}>
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
            <Button
              variant="default"
              className="flex items-center space-x-2"
              onClick={() => setShowEventForm(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </div>

          {/* Event cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading && Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && filteredEvents.length === 0 && <div>No events found.</div>}
            {filteredEvents.map((event) => {
              // Fallback to imageUrl if eventDetails.posterUrl is missing
              const posterUrl = event.eventDetails?.posterUrl || (event as any).imageUrl;
              return (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow flex flex-col h-[500px]"
                  style={{ minHeight: 500 }}
                >
                  {/* Poster image or placeholder */}
                  <div className="w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt="Post image"
                        className="w-full object-contain max-h-60"
                        style={{ maxHeight: 240 }}
                        sizes="(max-width: 768px)100vw, 800px"
                      />
                    ) : (
                      <span className="text-gray-400 text-lg py-8">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {event.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mb-2">
                            {event.eventDetails?.category && <Badge variant="secondary">{event.eventDetails.category}</Badge>}
                            {event.eventDetails?.isOnline && <Badge variant="outline">Online</Badge>}
                            {event.eventDetails?.price && <Badge variant="outline">{event.eventDetails.price}</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {event.content}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{event.eventDetails?.date ? new Date(event.eventDetails.date).toLocaleDateString() : ""}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{event.eventDetails?.time || ""}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{event.eventDetails?.location || ""}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.eventDetails?.attendees || 0}/{event.eventDetails?.maxAttendees || 0} attendees
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {(event.eventDetails?.tags || []).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-gray-500">
                          by {event.author?.name || "Unknown"}
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
                  </div>
                </Card>
              );
            })}
          </div>
        </main>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background rounded-xl shadow-2xl p-0 max-w-lg w-full relative max-h-[90vh] flex flex-col">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 z-10"
              onClick={() => setShowEventForm(false)}
              aria-label="Close"
            >
              ×
            </Button>
            <div className="overflow-y-auto p-4 pt-10 flex-1">
              <EventForm
                onSuccess={() => {
                  setShowEventForm(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
