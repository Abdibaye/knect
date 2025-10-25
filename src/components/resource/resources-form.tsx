
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ResourceNode } from "./tree";
import { ResourceMediaType } from "@/generated/prisma";

const resourceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().default("").catch(""),
  categoriesText: z.string().default("").catch(""),
  tagsText: z.string().default("").catch(""),
  downloadUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ResourceFormInput = z.input<typeof resourceSchema>;
type ResourceFormValues = z.output<typeof resourceSchema>;

type ResourceFormProps = {
  parentNode: ResourceNode | null | undefined;
  onSubmit?: (created: any) => void;
  onCancel?: () => void;
  className?: string;
};

type UploadInfo = {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey?: string;
  mediaType?: ResourceMediaType;
};

export function ResourceForm({ parentNode, onSubmit, onCancel, className }: ResourceFormProps) {
  const form = useForm<ResourceFormInput, any, ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      description: "",
      categoriesText: "",
      tagsText: "",
      downloadUrl: "",
      externalUrl: "",
    },
  });

  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>("");
  const [uploadInfo, setUploadInfo] = React.useState<UploadInfo | null>(null);

  const uploadToS3 = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/s3", { method: "POST", body: fd });
    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Upload failed");
    }
    if (!contentType?.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Unexpected response: ${text}`);
    }
    const data = await res.json();
    if (!data?.url) throw new Error("Missing URL from upload response");
    return data.url as string;
  };

  const handleFilePick = async (file: File) => {
    setUploading(true);
    try {
      setFileName(file.name);
      const url = await uploadToS3(file);
      form.setValue("downloadUrl", url, { shouldDirty: true, shouldValidate: true });
      const storageKey = extractStorageKey(url);
      const mediaType = detectMediaType(file.type);
      setUploadInfo({
        downloadUrl: url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        storageKey,
        mediaType,
      });
      toast.success("File uploaded");
      return url;
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
      setFileName("");
      setUploadInfo(null);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const submitToApi = async (values: ResourceFormValues) => {
    setSubmitting(true);
    try {
      if (!parentNode || parentNode.nodeType !== "FOLDER") {
        throw new Error("Select a folder to upload into.");
      }

      const downloadUrl = (values.downloadUrl || uploadInfo?.downloadUrl || "").trim();
      if (!downloadUrl) {
        throw new Error("Please upload a file or provide a download URL");
      }

      const categories = values.categoriesText
        ? values.categoriesText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const tags = values.tagsText
        ? values.tagsText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: values.name,
        description: values.description?.trim() || undefined,
        categories,
        tags,
        parentId: parentNode.id,
        universityId: parentNode.universityId ?? undefined,
        nodeType: "FILE",
        downloadUrl,
        externalUrl: values.externalUrl?.trim() || undefined,
        fileName: uploadInfo?.fileName || inferFileName(downloadUrl),
        fileSize: uploadInfo?.fileSize ?? undefined,
        mimeType: uploadInfo?.mimeType ?? undefined,
        mediaType: uploadInfo?.mediaType ?? undefined,
        storageKey: uploadInfo?.storageKey ?? undefined,
      };

      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as any).error || "Failed to create resource");

      toast.success("Resource created");
      onSubmit?.(data);

      form.reset({
        name: "",
        description: "",
        categoriesText: "",
        tagsText: "",
        downloadUrl: "",
        externalUrl: "",
      });
      setFileName("");
      setUploadInfo(null);
    } catch (err: any) {
      toast.error(err?.message || "Error creating resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitToApi)}
        className={cn(
          "space-y-6 max-w-md mx-auto bg-muted/30 p-6 rounded-lg max-h-[70vh] overflow-y-auto",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create Resource</h3>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        {parentNode ? (
          <div className="rounded-md border border-dashed border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            Uploading into <span className="font-medium text-foreground">{parentNode.name}</span>
            {parentNode.canonicalPath ? (
              <span className="ml-2 text-[11px] text-muted-foreground/80">{parentNode.canonicalPath}</span>
            ) : null}
          </div>
        ) : (
          <div className="rounded-md border border-amber-400/60 bg-amber-50 px-3 py-2 text-xs text-amber-600">
            Select a folder first to enable uploads.
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Circuit Theory Lab Manual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide context for reviewers and learners"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Free text categories */}
        <FormField
          control={form.control}
          name="categoriesText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="React, Guide, Frontend" {...field} />
              </FormControl>
              <FormDescription>Type any categories you want.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Free text tags */}
        <FormField
          control={form.control}
          name="tagsText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="React, Hooks, JavaScript" {...field} />
              </FormControl>
              <FormDescription>Type any tags you want.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File upload (to S3) */}
        <div className="space-y-2">
          <FormLabel>Upload File (creates Download URL)</FormLabel>
          <Input
            type="file"
            accept="*/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFilePick(file);
            }}
            disabled={uploading || submitting || !parentNode}
          />
          {fileName ? <p className="text-sm text-muted-foreground">Uploaded: {fileName}</p> : null}
          {uploadInfo?.mediaType ? (
            <p className="text-xs text-muted-foreground">
              Detected type: {uploadInfo.mediaType.toLowerCase()}
            </p>
          ) : null}
        </div>

        {/* Manual Download URL (optional if uploaded above) */}
        <FormField
          control={form.control}
          name="downloadUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-bucket/file.pdf" {...field} />
              </FormControl>
              <FormDescription>Filled automatically after upload, or paste a direct URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="externalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://external-page.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={submitting || uploading || !parentNode}>
          {submitting ? "Creating..." : uploading ? "Uploading..." : "Create Resource"}
        </Button>
      </form>
    </Form>
  );
}

function extractStorageKey(url: string) {
  try {
    const { pathname } = new URL(url);
    return pathname.replace(/^\//, "");
  } catch {
    return undefined;
  }
}

function inferFileName(url: string) {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/");
    return parts[parts.length - 1] || undefined;
  } catch {
    return undefined;
  }
}

function detectMediaType(mimeType: string | undefined | null): ResourceMediaType | undefined {
  if (!mimeType) return undefined;
  if (mimeType.startsWith("image/")) return ResourceMediaType.IMAGE;
  if (mimeType.startsWith("video/")) return ResourceMediaType.VIDEO;
  if (
    mimeType === "application/pdf" ||
    mimeType.includes("word") ||
    mimeType.includes("text") ||
    mimeType.includes("presentation") ||
    mimeType.includes("sheet")
  ) {
    return ResourceMediaType.DOCUMENT;
  }
  return ResourceMediaType.OTHER;
}