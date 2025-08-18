"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"

// Shared schemas and types
const labSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  instructor: z.string().min(1, "Instructor is required"),
  duration: z.string().min(1, "Duration is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  category: z.string().min(1, "Category is required"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  resourceLinks: z.string().optional(),
  requirements: z.string().optional(),
  tags: z.string().optional(),
})

const materialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["Document", "Image", "Video", "Link", "Other"]),
  downloadUrl: z.string().url().optional().or(z.literal("")),
  externalUrl: z.string().url().optional().or(z.literal("")),
  specifications: z.string().optional(),
  tags: z.string().optional(),
})

type LabFormData = z.infer<typeof labSchema>
type MaterialFormData = z.infer<typeof materialSchema>

// Shared file upload hook
const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null)

  const handleFilePick = async (file: File) => {
    setUploading(true)
    try {
      // Simulate file upload - replace with actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const mockUrl = `https://example.com/uploads/${file.name}`
      setUploadedFile({ name: file.name, url: mockUrl })
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  return { uploading, uploadedFile, handleFilePick, removeFile }
}

// Lab Form Component
export function AddLabForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: LabFormData & { fileUrl?: string }) => void
  onCancel: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const { uploading, uploadedFile, handleFilePick, removeFile } = useFileUpload()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LabFormData>({
    resolver: zodResolver(labSchema),
  })

  const difficulty = watch("difficulty")

  const onFormSubmit = async (data: LabFormData) => {
    setSubmitting(true)
    try {
      await onSubmit({ ...data, fileUrl: uploadedFile?.url })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Lab</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lab Title *</Label>
              <Input id="title" {...register("title")} placeholder="Enter lab title" />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Input id="instructor" {...register("instructor")} placeholder="Enter instructor name" />
              {errors.instructor && <p className="text-sm text-red-600">{errors.instructor.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} placeholder="Enter lab description" rows={3} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input id="duration" {...register("duration")} placeholder="e.g., 2 hours" />
              {errors.duration && <p className="text-sm text-red-600">{errors.duration.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select onValueChange={(value) => setValue("difficulty", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && <p className="text-sm text-red-600">{errors.difficulty.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input id="category" {...register("category")} placeholder="e.g., Physics, Chemistry" />
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input id="videoUrl" {...register("videoUrl")} placeholder="https://youtube.com/watch?v=..." type="url" />
            {errors.videoUrl && <p className="text-sm text-red-600">{errors.videoUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourceLinks">Resource Links</Label>
            <Textarea
              id="resourceLinks"
              {...register("resourceLinks")}
              placeholder="Enter resource links (one per line)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              {...register("requirements")}
              placeholder="Enter lab requirements and materials needed"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" {...register("tags")} placeholder="Enter tags separated by commas" />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>Lab Materials (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {!uploadedFile ? (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {uploading ? "Uploading..." : "Upload lab materials"}
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept="*/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) await handleFilePick(file)
                        }}
                        disabled={uploading || submitting}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC, images, videos up to 10MB</p>
                  </div>
                  {uploading && (
                    <div className="mt-4">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-600" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile} disabled={submitting}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={submitting || uploading} className="flex-1">
              {submitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Adding Lab...
                </>
              ) : (
                "Add Lab"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Material Form Component
export function AddMaterialForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: MaterialFormData & { fileUrl?: string }) => void
  onCancel: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const { uploading, uploadedFile, handleFilePick, removeFile } = useFileUpload()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  })

  const materialType = watch("type")

  const onFormSubmit = async (data: MaterialFormData) => {
    setSubmitting(true)
    try {
      await onSubmit({ ...data, fileUrl: uploadedFile?.url })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Material</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Material Title *</Label>
              <Input id="title" {...register("title")} placeholder="Enter material title" />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input id="author" {...register("author")} placeholder="Enter author name" />
              {errors.author && <p className="text-sm text-red-600">{errors.author.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} placeholder="Enter material description" rows={3} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input id="category" {...register("category")} placeholder="e.g., Textbook, Reference, Guide" />
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Material Type *</Label>
              <Select onValueChange={(value) => setValue("type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Image">Image</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Link">Link</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="downloadUrl">Download URL</Label>
              <Input
                id="downloadUrl"
                {...register("downloadUrl")}
                placeholder="https://example.com/file.pdf"
                type="url"
              />
              {errors.downloadUrl && <p className="text-sm text-red-600">{errors.downloadUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalUrl">External URL</Label>
              <Input
                id="externalUrl"
                {...register("externalUrl")}
                placeholder="https://example.com/resource"
                type="url"
              />
              {errors.externalUrl && <p className="text-sm text-red-600">{errors.externalUrl.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications</Label>
            <Textarea
              id="specifications"
              {...register("specifications")}
              placeholder="Enter technical specifications or additional details"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" {...register("tags")} placeholder="Enter tags separated by commas" />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>Upload Material (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {!uploadedFile ? (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="material-file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {uploading ? "Uploading..." : "Upload material file"}
                      </span>
                      <input
                        id="material-file-upload"
                        type="file"
                        className="sr-only"
                        accept="*/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) await handleFilePick(file)
                        }}
                        disabled={uploading || submitting}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">Images, videos, documents up to 10MB</p>
                  </div>
                  {uploading && (
                    <div className="mt-4">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-600" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile} disabled={submitting}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={submitting || uploading} className="flex-1">
              {submitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Adding Material...
                </>
              ) : (
                "Add Material"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
