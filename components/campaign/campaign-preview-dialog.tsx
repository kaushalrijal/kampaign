"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ContactRow } from "@/lib/types";
import { RenderedPreview } from "@/lib/preview";

interface CampaignPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  renderedPreview: RenderedPreview;
  randomContact: ContactRow | null;
  onRandomize: () => void;
  onSend: () => void;
  isSending: boolean;
}

export function CampaignPreviewDialog({
  isOpen,
  onOpenChange,
  renderedPreview,
  randomContact,
  onRandomize,
  onSend,
  isSending,
}: CampaignPreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight">
            Preview Campaign
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-600 uppercase tracking-wide">
            Review the rendered email for a sample recipient before sending
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Subject Preview */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">
              Subject
            </Label>
            <div className="border-2 border-black rounded-none bg-neutral-100 p-3 font-mono text-sm min-h-12 flex items-center">
              {renderedPreview.subject || "(Empty subject)"}
            </div>
          </div>

          {/* HTML Preview */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">
              Body Preview
            </Label>
            <div className="border-2 border-black rounded-none bg-white p-4 min-h-64 max-h-96 overflow-y-auto">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedPreview.html }}
              />
            </div>
          </div>

          {/* Sample Contact Info */}
          {randomContact && (
            <div className="border-t-2 border-black pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-neutral-600 uppercase tracking-widest font-bold">
                  Sample Recipient
                </p>
                <Button
                  type="button"
                  onClick={onRandomize}
                  disabled={isSending}
                  variant="outline"
                  className="h-6 px-2 text-xs border border-black rounded-none font-bold uppercase tracking-wide hover:bg-neutral-100 bg-transparent"
                >
                  Randomize
                </Button>
              </div>
              <div className="bg-neutral-50 border border-black rounded-none p-3 text-xs font-mono space-y-1">
                {Object.entries(randomContact).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-bold min-w-fit">{key}:</span>
                    <span className="text-neutral-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
            className="border-2 border-black rounded-none font-bold uppercase tracking-wide hover:bg-neutral-100 bg-transparent"
          >
            Go Back
          </Button>
          <Button
            type="button"
            onClick={onSend}
            disabled={isSending}
            className="bg-black text-white rounded-none font-bold uppercase tracking-wide hover:bg-neutral-800 disabled:opacity-50"
          >
            {isSending ? "SENDING..." : "SEND"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
