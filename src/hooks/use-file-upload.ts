import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type React from "react"

// Types for files managed by the hook
export type UploadedFile = {
  id: string
  file: File
  preview: string // object URL or remote URL
}

type InitialFile = {
  id: string
  url: string
  name: string
  type: string
  size?: number
}

type UseFileUploadOptions = {
  accept?: string // comma-separated mime types or extensions
  maxSize?: number // in bytes
  multiple?: boolean
  maxFiles?: number
  initialFiles?: InitialFile[]
}

type UseFileUploadState = {
  files: UploadedFile[]
  isDragging: boolean
  errors: string[]
}

type InputProps = {
  type: "file"
  accept?: string
  multiple?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ref: (el: HTMLInputElement | null) => void
}

type UseFileUploadActions = {
  handleDragEnter: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  openFileDialog: () => void
  removeFile: (id: string) => void
  getInputProps: () => InputProps
}

// Utility to create an ID for new files
const createId = (file: File) => `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`

// Validate file against accept and max size
function validateFile(file: File, opts: { acceptList: string[]; maxSize?: number }) {
  const { acceptList, maxSize } = opts

  if (acceptList.length) {
    const mime = file.type.toLowerCase()
    const name = file.name.toLowerCase()
    const ok = acceptList.some((rule) => {
      const r = rule.trim().toLowerCase()
      if (!r) return false
      if (r === "*/*") return true
      // extension like .png, .jpg
      if (r.startsWith(".")) return name.endsWith(r)
      // wildcard mime like image/*
      if (r.endsWith("/*")) return mime.startsWith(r.slice(0, -1))
      // exact mime match
      return mime === r
    })
    if (!ok) {
      return `File type not allowed: ${file.type || file.name}`
    }
  }

  if (typeof maxSize === "number" && file.size > maxSize) {
    return `File is too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
  }

  return null
}

export function useFileUpload(options: UseFileUploadOptions = {}): [
  UseFileUploadState,
  UseFileUploadActions,
] {
  const { accept, maxSize, multiple = false, maxFiles, initialFiles = [] } = options

  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const createdObjectUrls = useRef(new Set<string>())

  // Prepare accept list
  const acceptList = useMemo(
    () => (accept ? accept.split(",").map((s) => s.trim()).filter(Boolean) : []),
    [accept],
  )

  // Seed initial files (from URLs) once
  useEffect(() => {
    if (!initialFiles?.length) return

    setFiles((prev) => {
      const seeded: UploadedFile[] = initialFiles.map((f) => {
        // Create a lightweight File to provide name/type in the UI
        const pseudo = new File([""], f.name, { type: f.type })
        return {
          id: f.id || createId(pseudo),
          file: pseudo,
          preview: f.url,
        }
      })
      return [...prev, ...seeded]
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      for (const url of createdObjectUrls.current) {
        URL.revokeObjectURL(url)
      }
      createdObjectUrls.current.clear()
    }
  }, [])

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const arr = Array.from(list)
      const newErrors: string[] = []

      // Enforce maxFiles relative to current state
      let availableSlots = typeof maxFiles === "number" ? Math.max(maxFiles - files.length, 0) : arr.length
      const toAdd: UploadedFile[] = []

      for (const file of arr) {
        if (!multiple && (files.length > 0 || toAdd.length > 0)) {
          break
        }
        if (typeof maxFiles === "number" && availableSlots <= 0) {
          newErrors.push(`You can upload up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`)
          break
        }

        const err = validateFile(file, { acceptList, maxSize })
        if (err) {
          newErrors.push(err)
          continue
        }

        const preview = URL.createObjectURL(file)
        createdObjectUrls.current.add(preview)
        toAdd.push({ id: createId(file), file, preview })
        availableSlots -= 1
      }

      if (toAdd.length) setFiles((prev) => [...prev, ...toAdd])
      if (newErrors.length) setErrors(newErrors)
      else setErrors([])
    },
    [acceptList, files.length, maxFiles, maxSize, multiple],
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Explicitly show as copy to indicate drop allowed
    e.dataTransfer.dropEffect = "copy"
    setIsDragging(true)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const list = e.dataTransfer?.files
      if (list && list.length) {
        addFiles(list)
      }
    },
    [addFiles],
  )

  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target && target.preview.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview)
        createdObjectUrls.current.delete(target.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files
      if (list && list.length) addFiles(list)
      // reset the input value so same file can be selected again
      e.currentTarget.value = ""
    },
    [addFiles],
  )

  const getInputProps = useCallback((): InputProps => ({
    type: "file",
    accept,
    multiple: !!multiple,
    onChange,
    ref: (el: HTMLInputElement | null) => {
      inputRef.current = el
    },
  }), [accept, multiple, onChange])

  return [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ]
}
