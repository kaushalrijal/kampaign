"use client";

import { Input } from "@/components/ui/input"
import { useState } from "react"

interface FileItem {
  file: File;
  id: String;
}

const AttachmentsPage = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const newFiles = selectedFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-foreground")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-foreground")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-foreground")
    const droppedFiles = Array.from(e.dataTransfer.files || [])
    const newFiles = droppedFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">ATTACHMENTS & FILE ASSIGNMENT</h2>
        <p className="text-muted-foreground text-sm">
          Upload files and configure how they're distributed to recipients.
        </p>
      </div>

      <div>
        {files.map((file) => (
          <div>{file.file.name}</div>
        ))}
      </div>

      {/* Drag n drop area */}
      <div>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border p-12 text-center bg-muted/20 transition-colors cursor-pointer hover:border-foreground w-full"
        >
          <label className="block cursor-pointer">
            <Input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden w-full"
            />
            <div className="space-y-2">
              <div className="text-sm font-black tracking-wide">
                DRAG FILE HERE OR CLICK TO BROWSE
              </div>
              <div className="text-xs text-muted-foreground">
                PDF, DOC, Images and More
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default AttachmentsPage