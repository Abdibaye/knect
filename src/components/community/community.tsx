"use client";

import { useState } from "react";
import {
  Users,
  MessageCircle,
  TrendingUp,
  Search,
  Filter,
  Crown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const communities = [
  {
    id: "1",
    name: "Frontend Developers",
    description:
      "A community for frontend developers to share knowledge, tips, and discuss the latest trends.",
    members: 12450,
    posts: 3240,
    category: "Development",
    isPublic: true,
    isJoined: true,
    avatar:
      "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    moderators: ["Sarah Wilson", "Mike Chen"],
    tags: ["JavaScript", "React", "CSS", "HTML"],
    recentActivity: "2 hours ago",
  },
  {
    id: "2",
    name: "UX/UI Design Hub",
    description:
      "Connect with designers, share your work, get feedback, and discuss design trends.",
    members: 8920,
    posts: 1890,
    category: "Design",
    isPublic: true,
    isJoined: false,
    avatar:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    moderators: ["Emma Davis", "Alex Johnson"],
    tags: ["Figma", "Adobe XD", "Design Systems", "User Research"],
    recentActivity: "1 hour ago",
  },
  {
    id: "3",
    name: "Backend Engineers",
    description:
      "For backend developers working with APIs, databases, and server-side technologies.",
    members: 6780,
    posts: 2140,
    category: "Development",
    isPublic: true,
    isJoined: true,
    avatar:
      "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    moderators: ["David Kim", "Lisa Zhang"],
    tags: ["Node.js", "Python", "Database", "API"],
    recentActivity: "4 hours ago",
  },
  {
    id: "4",
    name: "Startup Founders",
    description:
      "Network with fellow entrepreneurs, share experiences, and discuss startup challenges.",
    members: 4320,
    posts: 890,
    category: "Business",
    isPublic: false,
    isJoined: false,
    avatar:
      "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    moderators: ["John Smith", "Maria Garcia"],
    tags: ["Startup", "Business", "Funding", "Strategy"],
    recentActivity: "6 hours ago",
  },
];

export default function CommunityPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(
    new Set(communities.filter((c) => c.isJoined).map((c) => c.id))
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleJoinCommunity = (communityId: string) => {
    const newJoined = new Set(joinedCommunities);
    if (newJoined.has(communityId)) {
      newJoined.delete(communityId);
    } else {
      newJoined.add(communityId);
    }
    setJoinedCommunities(newJoined);
  };

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="w-full bg-gray-50 dark:bg-black relative">
      {/* <Navbar 
        onMobileMenuToggle={toggleMobileMenu}isMobileMenuOpen={isMobileMenuOpen}
      /> */}

      <div className="flex">
        {/* <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} /> */}

        <main className="flex-1 ">
          <div className="w-full  mx-auto px-2 sm:px-4 py-6">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Community
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Join communities of like-minded people and engage in meaningful
                discussions
              </p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Create Community</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {filteredCommunities.map((community) => (
                <Card
                  key={community.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={community.avatar}
                          alt={community.name}
                        />
                        <AvatarFallback>
                          {community.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-xl">
                            {community.name}
                          </CardTitle>
                          {!community.isPublic && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">
                            {community.category}
                          </Badge>
                          <Badge variant="outline">
                            {community.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {community.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {community.members.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {community.posts.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-500">Active</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {community.recentActivity}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {community.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Moderated by {community.moderators.join(", ")}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            joinedCommunities.has(community.id)
                              ? "secondary"
                              : "default"
                          }
                          onClick={() => handleJoinCommunity(community.id)}
                        >
                          {joinedCommunities.has(community.id)
                            ? "Joined"
                            : "Join"}
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
