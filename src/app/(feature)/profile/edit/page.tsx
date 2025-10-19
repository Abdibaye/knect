"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LoaderOne } from "@/components/ui/loader";
import { Loader2 } from "lucide-react";

function toList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
      router.push(`/profile/me`);
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {loading ? (
        <div className="flex w-full min-h-[80vh] items-center justify-center">
          <LoaderOne />
          <span className="sr-only">Loading profile...</span>
        </div>
      ) : (
        <Card className= "w-3xl">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <fieldset disabled={saving} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={form.image || undefined} />
                  <AvatarFallback>{form.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <Button asChild size="sm" className="mr-2" disabled={saving}>
                    <label htmlFor="avatar">Upload Avatar</label>
                  </Button>
                  <input id="avatar" type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={saving} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className="text-sm font-medium">University</label>
                  <Input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className="text-sm font-medium">Year of Study</label>
                  <Input value={form.yearOfStudy} onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} disabled={saving} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">About</label>
                <Textarea rows={4} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} disabled={saving} />
              </div>

              <div>
                <label className="text-sm font-medium">Research/Focus/Skill Areas (comma or newline separated)</label>
                <Textarea rows={3} value={form.researchFocusSkillsText} onChange={(e) => setForm({ ...form, researchFocusSkillsText: e.target.value })} disabled={saving} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {rfsArray.map((s, i) => (
                    <Badge key={i} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
            </fieldset>

            <div className="flex justify-end">
              <Button disabled={saving} onClick={onSave}>
                {saving ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
