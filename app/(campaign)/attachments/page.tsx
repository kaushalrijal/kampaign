"use client";

import { DragDropUpload } from "@/components/shared/drag-drop-upload";
import { Button } from "@/components/ui/button";
import { useKampaignStore } from "@/lib/store/kampaign-store";
import { Trash2 } from "lucide-react";

const AttachmentsPage = () => {
  const {attachments, setAttachments} = useKampaignStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = selectedFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));
    console.log(newFiles)
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          ATTACHMENTS & FILE ASSIGNMENT
        </h2>
        <p className="text-muted-foreground text-sm">
          Upload files and configure how they're distributed to recipients.
        </p>
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

      {attachments.length > 0 ? (
        <>
          {/* Files List */}
          <div className="border border-border">
            <div className="bg-secondary px-4 md:px-6 py-4 border-b border-border">
              <h3 className="text-sm font-black tracking-wide">
                UPLOADED FILES ({attachments.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {attachments.map((item) => (
                <div key={item.id} className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm font-mono break-all">
                        {item.file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(item.file.size / 1024).toFixed(2)} KB
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => removeFile(item.id)}
                        className="px-2 py-2 text-xs font-semibold border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Upload files to get started</p>
        </div>
      )}
    </div>
  );
};

export default AttachmentsPage;
