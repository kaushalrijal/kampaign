"use client";

import { DragDropUpload } from "@/components/shared/drag-drop-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKampaignStore } from "@/lib/store/kampaign-store";
import { FileItem } from "@/lib/types";
import { Trash2 } from "lucide-react";
import Link from "next/link";

const AttachmentsPage = () => {
  const {
    attachments,
    setAttachments,
    customEnabled,
    setCustomEnabled,
    rules,
    setRules,
    headers,
  } = useKampaignStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles: FileItem[] = selectedFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      mode: "broadcast",
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const toggleBroadcast = (id: string) => {
    setAttachments((prev) =>
      prev.map((att) =>
        att.id === id
          ? {
              ...att,
              mode: att.mode === "broadcast" ? "personalized" : "broadcast",
            }
          : att
      )
    );
  };

  const removeFile = (id: string) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
  };

  const addRule = () => {
    setRules([...rules, { id: `rule-${Date.now()}`, pattern: "" }]);
  };

  const updateRule = (id: string, pattern: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, pattern } : r)));
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleCustomToggle = (enabled: boolean) => {
    setCustomEnabled(enabled);

    setAttachments((prev) =>
      prev.map((att) => ({
        ...att,
        mode: enabled ? "personalized" : "broadcast",
      }))
    );
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
          <div className="border border-border p-4 md:p-6 space-y-2">
            <div className="flex items-center gap-3">
              <Checkbox
                id="customEnabled"
                checked={customEnabled}
                onCheckedChange={(checked) =>
                  handleCustomToggle(Boolean(checked))
                }
              />
              <label
                htmlFor="customEnabled"
                className="text-sm font-semibold tracking-wide cursor-pointer flex-1"
              >
                ENABLE CUSTOM ATTACHMENT RULES
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-7">
              {customEnabled
                ? "Select which files go to all recipients, then create rules for personalized files"
                : "All files will be sent to every recipient"}
            </p>
          </div>
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
                      {customEnabled && (
                        <Button
                          onClick={() => toggleBroadcast(item.id)}
                          className={`px-3 py-2 text-xs font-semibold border transition-colors whitespace-nowrap ${
                            item.mode === "broadcast"
                              ? "bg-primary text-primary-foreground border-foreground"
                              : "border-border"
                          }`}
                        >
                          {item.mode === "broadcast"
                            ? "BROADCAST"
                            : "PERSONALIZE"}
                        </Button>
                      )}
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
          {customEnabled && (
            <div className="border border-border space-y-4">
              <div className="bg-secondary px-4 md:px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-black tracking-wide">
                  PERSONALIZATION RULES ({rules.length})
                </h3>
                <Button
                  onClick={addRule}
                  className="px-3 py-1 text-xs font-semibold border border-border transition-colors"
                >
                  ADD RULE
                </Button>
              </div>

              <div className="px-4 md:px-6 pb-4 space-y-4">
                <section
                  aria-labelledby="available-headers-title"
                  className="pt-2"
                >
                  <div className="flex items-center justify-between">
                    <Label>AVAILABLE HEADERS</Label>
                    <span className="text-xs text-muted-foreground">
                      Use these in your patterns
                    </span>
                  </div>
                  <div
                    className="flex flex-wrap gap-2 mt-2"
                    role="list"
                    aria-label="Available headers for personalization patterns"
                  >
                    {headers.length > 0 ? (
                      headers.map((header) => (
                        <Button
                          key={header}
                          type="button"
                          disabled
                          className="px-2 font-mono text-xs"
                          variant={"secondary"}
                          aria-label={`Available header ${header}`}
                        >
                          {"{" + header + "}"}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        <Link href={"/import"} className="underline">
                          Import
                        </Link>{" "}
                        contacts to see available headers.
                      </p>
                    )}
                  </div>
                </section>

                {rules.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">
                    No rules yet. Click "ADD RULE" to create a pattern for
                    personalized files.
                  </p>
                ) : (
                  rules.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className="p-4 border border-dashed border-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">
                          RULE {idx + 1}
                        </span>
                        <button
                          onClick={() => removeRule(rule.id)}
                          className="text-xs font-semibold text-destructive hover:underline"
                        >
                          REMOVE
                        </button>
                      </div>
                      <Input
                        type="text"
                        placeholder="e.g., {name}_invitation.pdf or {id}_report.pdf"
                        value={rule.pattern}
                        onChange={(e) => updateRule(rule.id, e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Use CSV column names in curly braces. Example: if a
                        recipient has name="alice", the system looks for
                        "alice_invitation.pdf"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
