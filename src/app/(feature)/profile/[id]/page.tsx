import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// Types
interface ProfilePayload {
  id: string;
  name: string;
  profileImage: string | null;
  university: string | null;
  department: string | null;
  yearOfStudy: string | null;
  about: string | null;
  researchFocusSkills: string | null;
  contributions: { posts: number; resources: number; events: number };
  communities: { id: string; name: string }[];
  verified: boolean;
  suggestedCollaborators: { id: string; name: string | null; image: string | null; location: string | null }[];
  recentPublications: { title: string; url?: string }[];
}

async function fetchProfile(userId: string, baseUrl: string): Promise<ProfilePayload | null> {
  const res = await fetch(`${baseUrl}/api/profile/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  const { id } = await params;

  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  const baseUrl = envBase && envBase.length > 0 ? envBase : host ? `${proto}://${host}` : "http://localhost:3000";

  const profile = await fetchProfile(id, baseUrl);
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <p className="text-muted-foreground">Profile not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = session?.session?.userId === profile.id;
  const avatarSrc = profile.profileImage
    ? (profile.profileImage.startsWith("http")
        ? profile.profileImage
        : `/${profile.profileImage.replace(/^\/+/, "")}`)
    : undefined;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-28 h-28 rounded-full border-2 border-border">
                  <AvatarImage src={avatarSrc} alt={profile.name} />
                  <AvatarFallback className="text-xl">
                    {profile.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-semibold">{profile.name}</h1>
                    {profile.verified && (
                      <Badge variant="outline" className="gap-1">
                        <CheckIcon size={14} className="text-emerald-500" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[profile.university, profile.department, profile.yearOfStudy]
                      .filter(Boolean)
                      .join(" • ") || "—"}
                  </p>
                  {profile.about && (
                    <p className="text-sm leading-relaxed text-foreground/90 max-w-3xl">
                      {profile.about}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    <Badge variant="outline">Posts: {profile.contributions.posts}</Badge>
                    <Badge variant="outline">Resources: {profile.contributions.resources}</Badge>
                    <Badge variant="outline">Events: {profile.contributions.events}</Badge>
                  </div>
                </div>
                {isOwner && (
                  <div>
                    <Button asChild>
                      <Link href="/profile/edit">Edit Profile</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="contrib">Contributions</TabsTrigger>
                  <TabsTrigger value="communities">Communities</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  {/* Research/Focus/Skills combined */}
                  <section>
                    <h3 className="text-sm font-medium mb-2">Research / Focus / Skills</h3>
                    {profile.researchFocusSkills && profile.researchFocusSkills.trim().length ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.researchFocusSkills
                          .split(/[,\n]/)
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((s, i) => (
                            <Badge key={`${s}-${i}`} variant="outline">{s}</Badge>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No research/focus/skills added.</p>
                    )}
                  </section>
                </TabsContent>

                <TabsContent value="contrib" className="space-y-4">
                  <p className="text-sm text-muted-foreground">Coming soon: detailed lists of posts, resources, and events.</p>
                </TabsContent>

                <TabsContent value="communities" className="space-y-2">
                  {profile.communities?.length ? (
                    <ul className="space-y-2">
                      {profile.communities.map((c) => (
                        <li key={c.id} className="text-sm">{c.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No communities joined yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Collaborators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.suggestedCollaborators?.length ? (
                profile.suggestedCollaborators.map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.image ?? undefined} />
                      <AvatarFallback>{u.name?.charAt(0) ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{u.name ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.location ?? "—"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No suggestions available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Publications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {profile.recentPublications?.length ? (
                <ul className="space-y-2">
                  {profile.recentPublications.map((p, i) => (
                    <li key={i} className="text-sm">
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          {p.title}
                        </a>
                      ) : (
                        <span>{p.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No recent publications.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}