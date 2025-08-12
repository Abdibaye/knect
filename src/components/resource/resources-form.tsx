
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

const resourceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  // Free-text inputs; always required as string (default to empty)
  categoriesText: z.string().default("").catch(""),
  tagsText: z.string().default("").catch(""),
  author: z.string().min(2, "Author is required"),
  downloadUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ResourceFormInput = z.input<typeof resourceSchema>;
type ResourceFormValues = z.output<typeof resourceSchema>;

type ResourceFormProps = {
  onSubmit?: (created: any) => void;
  onCancel?: () => void;
  className?: string;
};

export function ResourceForm({ onSubmit, onCancel, className }: ResourceFormProps) {
  const form = useForm<ResourceFormInput, any, ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      categoriesText: "",
      tagsText: "",
      author: "",
      downloadUrl: "",
      externalUrl: "",
    },
  });

  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>("");

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
      toast.success("File uploaded");
      return url;
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
      setFileName("");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const submitToApi = async (values: ResourceFormValues) => {
    setSubmitting(true);
    try {
      // Model requires downloadUrl
      if (!values.downloadUrl) {
        throw new Error("Please upload a file or provide a Download URL");
      }

      const categories = values.categoriesText
        ? values.categoriesText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const tags = values.tagsText
        ? values.tagsText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        title: values.title,
        description: values.description,
        categories,
        tags,
        author: values.author,
        downloadUrl: values.downloadUrl,
        externalUrl: values.externalUrl || undefined,
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
        title: "",
        description: "",
        categoriesText: "",
        tagsText: "",
        author: "",
        downloadUrl: "",
        externalUrl: "",
      });
      setFileName("");
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
        className={cn("space-y-6 max-w-md mx-auto bg-muted/30 p-6 rounded-lg", className)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create Resource</h3>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="React Hooks Guide" {...field} />
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
                  placeholder="A comprehensive guide with practical examples and best practices."
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

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Tech Academy" {...field} />
              </FormControl>
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
            disabled={uploading || submitting}
          />
          {fileName ? <p className="text-sm text-muted-foreground">Uploaded: {fileName}</p> : null}
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

        <Button type="submit" className="w-full" disabled={submitting || uploading}>
          {submitting ? "Creating..." : uploading ? "Uploading..." : "Create Resource"}
        </Button>
      </form>
    </Form>
  );
}