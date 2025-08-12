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
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";


const resourceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  author: z.string().min(2, "Author is required"),
  downloadUrl: z.string().url("Must be a valid URL"),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const categoryOptions = [
  "React",
  "Guide",
  "Frontend",
  "JavaScript",
  "Hooks",
];

const tagOptions = [
  "React",
  "Hooks",
  "JavaScript",
  "Frontend",
  "Guide",
];

export function EventForm({
  onSubmit,
  className,
}: {
  onSubmit: (data: ResourceFormValues) => void;
  className?: string;
}) {
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      categories: [],
      tags: [],
      author: "",
      downloadUrl: "",
      externalUrl: "",
    },
  });



  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6 max-w-md mx-auto bg-muted/30 p-6 rounded-lg", className)}
      >
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
                  placeholder="A comprehensive guide covering all React hooks with practical examples and best practices."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <MultiSelect
                  options={categoryOptions.map((cat) => ({
                    label: cat,
                    value: cat,
                  }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select categories"
                />
              </FormControl>
              <FormDescription>
                Pick the main category or categories for this resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tagOptions.map((tag) => ({
                    label: tag,
                    value: tag,
                  }))}
                  selected={field.value}
                  onChange={field.onChange}
                  creatable
                  placeholder="Add tags"
                />
              </FormControl>
              <FormDescription>
                Add relevant tags for better discoverability.
              </FormDescription>
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
        <FormField
          control={form.control}
          name="downloadUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download URL</FormLabel>
              <FormControl>
                <Input placeholder="https://resource.com/download" {...field} />
              </FormControl>
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
        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </Form>
  );
}