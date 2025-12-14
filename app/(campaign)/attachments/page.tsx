"use client";

import { DragDropUpload } from "@/components/shared/drag-drop-upload"
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
          <div key={file.id as string}>{file.file.name}</div>
        ))}
      </div>

      {/* Drag n drop area */}
      <div>
        <DragDropUpload
          onFileSelect={handleFileSelect}
          multiple={true}
          title="DRAG FILE HERE OR CLICK TO BROWSE"
          description="PDF, DOC, Images and More"
          dragHighlightClass="border-foreground"
        />
      </div>
    </div>
  )
}

export default AttachmentsPage