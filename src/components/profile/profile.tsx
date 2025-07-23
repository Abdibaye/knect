"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon, PencilIcon } from "lucide-react";

const mockUser = {
  name: "John Doe",
  username: "johndoe",
  bio: "Software engineer. I love TypeScript and building cool stuff.",
  location: "Addis Ababa, Ethiopia",
  image: "https://avatars.githubusercontent.com/u/583231?v=4",
  isFollowing: false,
};

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // 🔁 TODO: Send follow/unfollow to backend
  };

  const handleUpdateProfile = (formData: FormData) => {
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    setUser({ ...user, name, bio, location });
    // 🔁 TODO: Send to backend
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({ ...prev, image: reader.result as string }));
      // 🔁 TODO: Upload to backend or image service
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full lg:mr-170 mx-auto p-4 space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl border shadow-md bg-white dark:bg-zinc-900 p-6 relative">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <img
              src={user.image}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border"
              onClick={handleAvatarClick}
            />
            <div className="absolute bottom-0 right-0 p-1 bg-white dark:bg-zinc-800 rounded-full border group-hover:opacity-100 opacity-70">
              <UploadIcon size={16} />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.location}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{user.bio}</p>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant={isFollowing ? "outline" : "default"}
            onClick={handleFollowToggle}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>

          {/* Edit Profile Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <PencilIcon size={16} className="mr-1" /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form
                action={(formData) => handleUpdateProfile(formData)}
                className="space-y-4"
              >
                <h2 className="text-lg font-medium">Edit Profile</h2>
                <Input name="name" defaultValue={user.name} placeholder="Full name" />
                <Textarea name="bio" defaultValue={user.bio} placeholder="Bio" />
                <Input name="location" defaultValue={user.location} placeholder="Location" />
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
