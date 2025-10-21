"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImageIcon, Library, FlaskConical } from "lucide-react";

type PostComposerPromptProps = {
  onCompose: () => void;
};

export default function PostComposerPrompt({ onCompose }: PostComposerPromptProps) {
  const { data } = authClient.useSession();
  const user = data?.user;
  const initial = (user?.name?.[0] || user?.email?.[0] || "?").toUpperCase();

  return (
    <div className="w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.image ?? undefined} />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <button
          onClick={onCompose}
          className="flex-1 cursor-pointer text-left text-sm md:text-base px-4 py-2 rounded-full border border-input bg-background/60 hover:border-accent/30 transition-colors text-muted-foreground"
          aria-label="Create a post"
        >
          {`Got a project, question, or idea? Share it with ${user?.name ? user.name.split(" ")[0] + "'s" : "the"} community…`}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs md:text-sm">
        <Action icon={<ImageIcon className="h-4 w-4 text-green-500" />} label="Photo" onClick={onCompose} />
        <Action icon={<Library className="h-4 w-4 text-blue-500" />} label="Resource" onClick={onCompose} />
        <Action icon={<FlaskConical className="h-4 w-4 text-yellow-500" />} label="Research" onClick={onCompose} />
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        You can attach images, videos, and documents.
      </p>
    </div>
  );
}

function Action({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      aria-label={label}
      className="
        gap-2 text-muted-foreground 
        border border-transparent 
        rounded-xl 
        transition-all duration-200
        hover:!bg-transparent
        hover:rounded-2xl
      "
    >
      {icon}
      <span>{label}</span>
</Button>

  );
}
