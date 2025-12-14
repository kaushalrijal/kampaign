"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DragDropUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  title?: string;
  description?: string;
  dragHighlightClass?: string;
}

export const DragDropUpload = ({
  onFileSelect,
  accept,
  multiple = false,
  title = "DRAG FILE HERE OR CLICK TO BROWSE",
  description = "PDF, DOC, Images and More",
  dragHighlightClass = "border-foreground",
}: DragDropUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      // Create a synthetic event to match the onChange signature
      const syntheticEvent = {
        target: { files: droppedFiles },
      } as React.ChangeEvent<HTMLInputElement>;
      
      await onFileSelect(syntheticEvent);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed border-border p-12 text-center bg-muted/20 transition-colors cursor-pointer hover:border-foreground w-full ${
        isDragging ? dragHighlightClass : ""
      }`}
    >
      <label className="block cursor-pointer">
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onFileSelect}
          className="hidden w-full"
        />
        <div className="space-y-2">
          <div className="text-sm font-black tracking-wide">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </label>
    </div>
  );
};
