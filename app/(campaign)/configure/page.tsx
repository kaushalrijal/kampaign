"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { sendCampaign, testSMTPConnection } from "@/lib/api";
import { useKampaignStore } from "@/lib/store/kampaign-store";
import { validateContent } from "@/lib/validate";
import renderTemplate from "@/lib/template/render";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const ConfigurePage = () => {
  const {
    campaignName,
    setCampaignName,
    contacts,
    attachments,
    headers,
    recipientHeader,
    subject,
    htmlOutput,
    setRecipientHeader,
  } = useKampaignStore();
  const [SMTPStatus, setSMTPStatus] = useState<
    "idle" | "testing" | "success" | "failed"
  >("idle");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [randomContactIndex, setRandomContactIndex] = useState(0);

  // Get a random contact for preview
  const randomContact = useMemo(() => {
    if (contacts.length === 0) return null;
    return contacts[randomContactIndex];
  }, [randomContactIndex, contacts]);

  const handleRandomizeContact = () => {
    const newIndex = Math.floor(Math.random() * contacts.length);
    setRandomContactIndex(newIndex);
  };

  // Memoize rendered values to avoid unnecessary recalculations
  const renderedPreview = useMemo(() => {
    if (!randomContact) return { subject: "", html: "" };
    return {
      subject: renderTemplate(subject, randomContact),
      html: renderTemplate(htmlOutput, randomContact),
    };
  }, [randomContact, subject, htmlOutput]);

  const handleTestConnection = async () => {
    try {
      setSMTPStatus("testing");
      const result = await testSMTPConnection();

      console.log(result);

      if (!result.success) {
        setSMTPStatus("failed");
        return;
      }

      setSMTPStatus("success");
    } catch (error) {
      console.log("Error: ", error);
      setSMTPStatus("failed");
    }
  };

  const sendEmail = async () => {
    const validation = validateContent();
    console.log(validation);
    if (!validation.ok) {
      validation.warnings.map((warning) => toast.warning(warning));
      validation.errors.map((error) => toast.error(error));
      return;
    }

    // Open preview dialog if validation passes
    setIsPreviewDialogOpen(true);
  };

  const handleConfirmSend = async () => {
    try {
      setIsSending(true);
      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({
          contacts,
          attachments,
          headers,
          subject,
          htmlOutput,
          recipientHeader,
        })
      );

      attachments.forEach((att) => {
        formData.append("attachments", att.file);
      });
      const response = await sendCampaign(formData);

      console.log(response);
      setIsPreviewDialogOpen(false);
      toast.success("Campaign sent successfully!");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to send campaign");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          CAMPAIGN CONFIGURATION
        </h2>
        <p className="text-muted-foreground text-sm">
          Review your campaign settings before sending. Test SMTP connection
          below.
        </p>
      </div>

      {/* Campaign Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border p-6 bg-card">
          <Label>RECIPIENTS</Label>
          <div className="text-4xl font-black">{contacts.length}</div>
          <div className="text-xs text-muted-foreground mt-2">
            emails to be sent
          </div>
        </div>

        <div className="border border-border p-6 bg-card">
          <Label>ATTACHMENTS</Label>
          <div className="text-4xl font-black">{attachments.length}</div>
          <div className="text-xs text-muted-foreground mt-2">
            files included
          </div>
        </div>

        <div className="border border-border p-6 bg-card">
          <Label>STATUS</Label>
          <div className="text-xl font-black text-primary">READY</div>
          <div className="text-xs text-muted-foreground mt-2">
            all systems go
          </div>
        </div>
      </div>

      {/* SMTP Test */}
      <div className="border border-border">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <h3 className="text-sm font-black tracking-wide">
            SMTP CONNECTION TEST
          </h3>
        </div>
        <div className="p-8">
          <p className="text-sm text-muted-foreground mb-6">
            Test your SMTP credentials before sending the campaign. This will
            verify connectivity without sending any emails.
          </p>

          <Button
            onClick={handleTestConnection}
            disabled={SMTPStatus === "testing"}
            className={`px-6 py-3 font-semibold text-sm tracking-wide border transition-all ${
              SMTPStatus === "success"
                ? "bg-primary text-primary-foreground border-foreground"
                : SMTPStatus === "testing"
                ? "bg-muted text-foreground border-border opacity-50 cursor-wait"
                : SMTPStatus === "failed"
                ? "bg-destructive text-white border-destructive"
                : "bg-secondary text-foreground border-border hover:bg-muted"
            }`}
          >
            {SMTPStatus === "testing"
              ? "TESTING..."
              : SMTPStatus === "success"
              ? "CONNECTION OK"
              : SMTPStatus === "failed"
              ? "SMTP Not Configured!"
              : "TEST CONNECTION"}
          </Button>
        </div>
      </div>

      {/* Campaign Name */}
      <div className="border border-border">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <Label>CAMPAIGN NAME</Label>
        </div>
        <div className="p-8">
          {/* Using shadcn Input component */}
          <Input
            type="text"
            placeholder="Q1 2025 Product Launch"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            For your campaign history records
          </p>
        </div>
      </div>

      {/* Email Header Selection */}
      {headers.length > 0 && (
        <div className="border border-border">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <Label>EMAIL HEADER</Label>
          </div>
          <div className="p-8">
            <p className="text-sm text-muted-foreground mb-6">
              Select the header that contains the recipients' email addresses.
            </p>
            <Select value={recipientHeader} onValueChange={setRecipientHeader}>
              <SelectTrigger className="w-full sm:w-96">
                <SelectValue placeholder="Select email column..." />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Send Button */}
      <div className="border border-border">
        <div className="p-8 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              You are about to send{" "}
              <span className="font-black">{contacts.length}</span> personalized
              emails. This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-4 max-w-4xl">
            <Button variant={"destructive"} onClick={sendEmail}>
              SEND NOW ({contacts.length} emails)
            </Button>
            <Button variant={"secondary"}>SCHEDULE</Button>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
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
                Subject Line
              </Label>
              <div className="border-2 border-black rounded-none bg-neutral-100 p-3 font-mono text-sm min-h-12 flex items-center">
                {renderedPreview.subject || "(Empty subject)"}
              </div>
            </div>

            {/* HTML Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">
                Email Body Preview
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
                    onClick={handleRandomizeContact}
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
              onClick={() => setIsPreviewDialogOpen(false)}
              disabled={isSending}
              className="border-2 border-black rounded-none font-bold uppercase tracking-wide hover:bg-neutral-100 bg-transparent"
            >
              Go Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSend}
              disabled={isSending}
              className="bg-black text-white rounded-none font-bold uppercase tracking-wide hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSending ? "SENDING..." : "SEND"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfigurePage;
