
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { BookOpen, Search, Download, ExternalLink, Plus, Star, Star as StarFilled } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResourceForm } from "./resources-form";
import Component from "./dropDown";

type UploadedBy = {
  id: string;
  name?: string | null;
  image?: string | null;
};

export type Resource = {
  id: string;
  title: string;
  rating: number;
  downloads: number;
  categories: string[];
  description: string;
  tags: string[];
  author: string;
  downloadUrl: string;
  externalUrl?: string | null;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: UploadedBy | null;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Local UI-only star/ratings
  const [starred, setStarred] = useState<{ [id: string]: boolean }>({});
  const [ratings, setRatings] = useState<{ [id: string]: number }>({});

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/resources", { method: "GET", cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch resources");
      }
      const data = (await res.json()) as Resource[];
      setResources(data);
      setRatings(Object.fromEntries(data.map((r) => [r.id, r.rating])));
    } catch (e: any) {
      setError(e?.message || "Error loading resources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await loadResources();
    })();
    return () => {
      active = false; // for future async guards if needed
    };
  }, [loadResources]);

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((r) => {
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.categories.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [resources, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 relative">
      {showResourceForm && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />}

      <div className={showResourceForm ? "blur-sm pointer-events-none select-none" : ""}>
        <div className="flex">
          <main className="flex-1">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Resources</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover curated resources, guides, and tools to enhance your skills
                </p>
              </div>

              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Component />
                <Button
                  variant="default"
                  className="flex items-center space-x-2"
                  onClick={() => setShowResourceForm(true)}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Resource</span>
                </Button>
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 mb-4 text-sm">{error}</div>
              )}

              {loading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading resources...</div>
              ) : filteredResources.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">No resources found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredResources.map((resource) => {
                    const primaryCategory = resource.categories[0] || "General";
                    return (
                      <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                              <div className="flex items-center flex-wrap gap-2 mb-2">
                                <Badge variant="secondary">{primaryCategory}</Badge>
                                {resource.categories.slice(1, 2).map((c) => (
                                  <Badge key={c} variant="outline">
                                    {c}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex justify-end text-sm text-gray-500 items-center">
                                <button
                                  className="focus:outline-none cursor-pointer flex"
                                  onClick={() => {
                                    setRatings((prev) => ({
                                      ...prev,
                                      [resource.id]: starred[resource.id]
                                        ? (prev[resource.id] ?? resource.rating) - 1
                                        : (prev[resource.id] ?? resource.rating) + 1,
                                    }));
                                    setStarred((prev) => ({
                                      ...prev,
                                      [resource.id]: !prev[resource.id],
                                    }));
                                  }}
                                  aria-label="Rate"
                                >
                                  {starred[resource.id] ? (
                                    <StarFilled
                                      className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400"
                                      fill="currentColor"
                                    />
                                  ) : (
                                    <Star className="h-4 w-4 mr-1" />
                                  )}
                                </button>
                                {ratings[resource.id] ?? resource.rating}
                              </div>
                              <div className="text-xs text-gray-400">{resource.downloads} downloads</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-4">
                            {resource.description}
                          </p>
                          {resource.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {resource.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">by {resource.author}</span>
                            <div className="flex space-x-2">
                              {resource.downloadUrl && (
                                <Button asChild size="sm" variant="outline">
                                  <a href={resource.downloadUrl} target="_blank" rel="noreferrer" download>
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </a>
                                </Button>
                              )}
                              {resource.externalUrl && (
                                <Button asChild size="sm" variant="ghost">
                                  <a href={resource.externalUrl} target="_blank" rel="noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {showResourceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background rounded-xl shadow-2xl p-0 max-w-lg w-full relative max-h-[90vh] flex flex-col">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 z-10"
              onClick={() => setShowResourceForm(false)}
              aria-label="Close"
            >
              ×
            </Button>
            <div className="overflow-y-auto p-4 pt-10 flex-1">
              <ResourceForm
                onSubmit={(created: any) => {
                  // Optimistic update
                  setResources((prev) => [created as Resource, ...prev]);
                  setShowResourceForm(false);
                  // Sync with server to reflect server-calculated fields
                  void loadResources();
                }}
                onCancel={() => setShowResourceForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );


};