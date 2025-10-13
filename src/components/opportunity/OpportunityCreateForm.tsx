"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

type Attachment = { name: string; url: string; type?: string };

type FormValues = {
  title: string;
  description: string;
  type: string;
  provider: string;
  providerLogo: string;
  bannerImage: string;
  university: string;
  department: string;
  location: string;
  applicationUrl: string;
  tags: string;
  deadline: string;
};

export function OpportunityCreateForm({ onCreated }: { onCreated?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      type: "Internship",
      provider: "",
      providerLogo: "",
      bannerImage: "",
      university: "",
      department: "",
      location: "",
      applicationUrl: "",
      tags: "",
      deadline: "",
    },
  });

  const uploadToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/s3", { method: "POST", body: formData });
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
    if (!data.url) throw new Error("Missing URL from upload response");
    return data.url as string;
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadToS3(file);
      setBannerFile(file);
      form.setValue("bannerImage", url, { shouldDirty: true, shouldValidate: true });
      // Preload the remote image; only swap away from blob when it loads
      const img = new window.Image();
      img.onload = () => {
        setBannerUrl(url);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return "";
        });
        toast.success("Image uploaded");
      };
      img.onerror = () => {
        // Keep the local preview; URL might not be public yet
        toast.error("Uploaded image not yet accessible; keeping local preview");
      };
      img.src = url;
      return url;
    } catch (err: any) {
      toast.error("Image upload failed: " + (err?.message || ""));
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleAttachmentsUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploads: Attachment[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToS3(file);
        uploads.push({ name: file.name, url, type: file.type });
      }
      setAttachments((prev) => [...prev, ...uploads]);
      toast.success("Attachment(s) uploaded");
    } catch (err: any) {
      toast.error("Attachment upload failed: " + (err?.message || ""));
    } finally {
      setUploading(false);
    }
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (bannerUrl && bannerUrl.startsWith('blob:')) URL.revokeObjectURL(bannerUrl);
    };
  }, [previewUrl, bannerUrl]);

  const onSubmit = async (values: FormValues) => {

    try {
      let imageUrl = bannerUrl;
      if (bannerFile && !bannerUrl) {
        imageUrl = await handleImageUpload(bannerFile);
      }

      setSubmitting(true);
      // basic client-side checks
      if (!values.title || values.title.trim().length < 3) {
        form.setError('title', { message: 'Title is too short' });
        return;
      }
      if (!values.description || values.description.trim().length < 10) {
        form.setError('description', { message: 'Description is too short' });
        return;
      }
      if (!values.type) {
        form.setError('type', { message: 'Type is required' });
        return;
      }
      if (!values.provider) {
        form.setError('provider', { message: 'Provider is required' });
        return;
      }
      if (!values.deadline) {
        form.setError('deadline', { message: 'Deadline is required' });
        return;
      }

            const payload: any = {
        title: values.title,
        description: values.description,
        type: values.type,
        provider: values.provider,
        providerLogo: values.providerLogo || undefined,
        bannerImage: values.bannerImage ? values.bannerImage : undefined,
        university: values.university || undefined,
        department: values.department || undefined,
        location: values.location || undefined,
        applicationUrl: values.applicationUrl || undefined,
        deadline: values.deadline,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        attachments: attachments.length ? attachments : undefined,
      };
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Create failed (${res.status})`);
      }
      onCreated?.();
      form.reset();
      setBannerFile(null);
      setBannerUrl("");
    } catch (e: any) {
      form.setError('title', { message: e?.message || 'Failed to create' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="title" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="e.g., AI Research Internship" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="type" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl><Input placeholder="Internship / Scholarship / Job" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="provider" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl><Input placeholder="Organization / Lab" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="deadline" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl><Input type="datetime-local" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="providerLogo" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Provider Logo URL</FormLabel>
              <FormControl><Input placeholder="https://..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="bannerImage" control={form.control} render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Banner Image</FormLabel>
              {/* Keep hidden field bound to RHF value while using a file input for upload */}
              <input type="hidden" {...field} value={form.watch("bannerImage") || ""} />
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBannerFile(file);
                      // Create blob URL for immediate preview
                      const blobUrl = URL.createObjectURL(file);
                      setPreviewUrl(blobUrl);
                      // Upload in background
                      handleImageUpload(file);
                    }
                  }}
                  disabled={uploading || submitting}
                />
              </FormControl>
              {bannerFile && (
                <p className="text-sm text-muted-foreground mt-1">Selected: {bannerFile.name}</p>
              )}
              {(previewUrl || bannerUrl) && (
              console.log(previewUrl || bannerUrl),
              <img src={previewUrl || bannerUrl} alt="Uploaded" className="mt-3 max-h-48 rounded-xl border shadow-sm" />
            )}
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="university" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <FormControl><Input placeholder="Optional" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="department" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl><Input placeholder="Optional" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="location" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input placeholder="Optional" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="applicationUrl" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Application URL</FormLabel>
              <FormControl><Input placeholder="https://apply..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="tags" control={form.control} render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Tags</FormLabel>
              <FormControl><Input placeholder="Comma separated e.g. AI, Research, ML" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea rows={6} placeholder="Describe the opportunity, requirements, benefits…" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={submitting || uploading}>{submitting ? 'Posting…' : (uploading ? 'Uploading…' : 'Post Opportunity')}</Button>
        </div>
      </form>
    </Form>
  );
}
