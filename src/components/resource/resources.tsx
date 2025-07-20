
"use client";

import { useState } from "react";
import { BookOpen, Search, Filter, Download, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const universities = [
  "Adama Science and Technology University",
  "Addis Ababa University",
  "Addis Ababa Science and Technology University",
];

const resources = [
  {
    id: "1",
    title: "React Hooks Guide",
    description:
      "A comprehensive guide covering all React hooks with practical examples and best practices.",
    university: "Adama Science and Technology University",
    category: "React",
    type: "Guide",
    author: "Tech Academy",
    downloadCount: 1250,
    rating: 4.8,
    tags: ["React", "Hooks", "JavaScript", "Frontend"],
    url: "https://example.com/react-hooks-guide",
  },
  {
    id: "2",
    title: "Design System Template",
    description:
      "A ready-to-use design system template with components, tokens, and guidelines.",
    university: "Addis Ababa University",
    category: "Design",
    type: "Template",
    author: "Design Studio",
    downloadCount: 890,
    rating: 4.9,
    tags: ["Design System", "Figma", "UI/UX", "Components"],
    url: "https://example.com/design-system-template",
  },
  {
    id: "3",
    title: "API Best Practices",
    description:
      "Essential checklist for building robust and scalable APIs with modern practices.",
    university: "Addis Ababa Science and Technology University",
    category: "Backend",
    type: "Checklist",
    author: "API Experts",
    downloadCount: 2100,
    rating: 4.7,
    tags: ["API", "Backend", "Best Practices", "REST"],
    url: "https://example.com/api-best-practices",
  },
];

export default function ResourcesPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter(
    (resource) =>
      (!selectedUniversity || resource.university === selectedUniversity) &&
      (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="flex">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Resources
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Discover curated resources, guides, and tools to enhance your
                skills
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {universities.map((uni) => (
                <Button
                  key={uni}
                  variant={selectedUniversity === uni ? "default" : "outline"}
                  onClick={() => setSelectedUniversity(uni)}
                >
                  {uni}
                </Button>
              ))}
              {selectedUniversity && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedUniversity(null)}
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resources..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {resource.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{resource.category}</Badge>
                          <Badge variant="outline">{resource.type}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          ★ {resource.rating}
                        </div>
                        <div className="text-xs text-gray-400">
                          {resource.downloadCount} downloads
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        by {resource.author}
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
