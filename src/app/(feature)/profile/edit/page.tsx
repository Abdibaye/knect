"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function toList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    about: "",
    image: "",
    university: "",
    department: "",
    yearOfStudy: "",
    researchFocusSkillsText: "",
    location: "",
  });
  const rfsArray = useMemo(() => toList(form.researchFocusSkillsText), [form.researchFocusSkillsText]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        const u = data.user || {};
        setForm((f) => ({
          ...f,
          name: u.name || "",
          username: u.username || "",
          about: u.about || u.bio || "",
          image: u.image || "",
          university: u.university || "",
          department: u.department || "",
          yearOfStudy: u.yearOfStudy || "",
          researchFocusSkillsText: (u.researchFocusSkills as string | undefined) || "",
          location: u.location || "",
        }));
      } catch (e: any) {
        setError(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/s3", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok && data.url) {
      setForm((f) => ({ ...f, image: data.url }));
    } else {
      setError(data.error || "Upload failed");
    }
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          about: form.about,
          image: form.image,
          university: form.university,
          department: form.department,
          yearOfStudy: form.yearOfStudy,
          researchFocusSkills: rfsArray.join(", "),
          location: form.location,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      router.push(`/profile/${encodeURIComponent("me")}`);
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-8 w-36 rounded-md" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Username */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* University */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Department */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Year of Study */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Location */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* About */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-28 w-full" />
            </div>

            {/* Research/Focus/Skill Areas */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={form.image || undefined} />
              <AvatarFallback>{form.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Button asChild size="sm" className="mr-2">
                <label htmlFor="avatar">Upload Avatar</label>
              </Button>
              <input id="avatar" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Username</label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">University</label>
              <Input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Year of Study</label>
              <Input value={form.yearOfStudy} onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">About</label>
            <Textarea rows={4} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium">Research/Focus/Skill Areas (comma or newline separated)</label>
            <Textarea rows={3} value={form.researchFocusSkillsText} onChange={(e) => setForm({ ...form, researchFocusSkillsText: e.target.value })} />
            <div className="mt-2 flex flex-wrap gap-2">
              {rfsArray.map((s, i) => (
                <Badge key={i} variant="outline">{s}</Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button disabled={saving} onClick={onSave}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
