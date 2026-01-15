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
import { CampaignPreviewDialog } from "@/components/campaign/campaign-preview-dialog";
import { sendCampaign, testSMTPConnection } from "@/lib/api";
import { useKampaignStore } from "@/lib/store/kampaign-store";
import { validateContent } from "@/lib/validate";
import { renderEmailPreview } from "@/lib/preview";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { saveCampaign } from "@/lib/db/campaign";

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
    customEnabled,
    rules,
    reset,
  } = useKampaignStore();
  const [SMTPStatus, setSMTPStatus] = useState<
    "idle" | "testing" | "success" | "failed"
  >("idle");

  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [randomContactIndex, setRandomContactIndex] = useState(0);

  const validation = useMemo(
    () =>
      validateContent({
        campaignName,
        subject,
        htmlOutput,
        contacts,
        recipientHeader,
        attachments,
      }),
    [campaignName, subject, htmlOutput, contacts, recipientHeader, attachments]
  );

  const campaignStatus = useMemo(() => {
    if (!validation.ok) {
      return {
        label: "NOT READY",
        toneClassName: "text-destructive",
        detail:
          validation.errors.length === 1
            ? validation.errors[0]
            : `${validation.errors.length} required items missing`,
      };
    }

    if (validation.warnings.length > 0) {
      return {
        label: "READY",
        toneClassName: "text-primary",
        detail: `${validation.warnings.length} warning${
          validation.warnings.length === 1 ? "" : "s"
        }`,
      };
    }

    return {
      label: "READY",
      toneClassName: "text-primary",
      detail: "all systems go",
    };
  }, [validation]);

  // Get a random contact for preview
  const randomContact = useMemo(() => {
    if (contacts.length === 0) return null;
    return contacts[randomContactIndex];
  }, [randomContactIndex, contacts]);

  // Memoize rendered values to avoid unnecessary recalculations
  const renderedPreview = useMemo(() => {
    return renderEmailPreview(subject, htmlOutput, randomContact);
  }, [randomContact, subject, htmlOutput]);

  const handleRandomizeContact = () => {
    const newIndex = Math.floor(Math.random() * contacts.length);
    setRandomContactIndex(newIndex);
  };

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

      const attachmentMeta = attachments.map((att) => ({
        id: att.id,
        name: att.file.name,
        mode: att.mode,
      }));

      formData.append(
        "payload",
        JSON.stringify({
          campaignName,
          contacts,
          headers,
          subject,
          htmlOutput,
          recipientHeader,
          customEnabled,
          attachments: attachmentMeta,
          rules,
        })
      );

      attachments.forEach((att) => {
        formData.append("attachments", att.file);
      });
      const createdAt = Date.now()
      const response = await sendCampaign(formData);

      // save to database if campaign is succesful
      if (response.success) {
        const attachmentRules = rules.map((rule) => ({
          id: rule.id,
          rule: rule.pattern,
        }));
        const attachmentDetails = attachments.map((att) => ({
          id: att.id,
          fileName: att.file.name,
          bytes: att.file.size,
          type: att.mode,
        }));

        await saveCampaign({
          id: response.campaignId as string,
          slug: response.campaignSlug as string,
          name: campaignName,
          subject,
          senderEmail: response.senderEmail as string,
          totalRecipients: contacts.length,
          sentCount: response.sentCount as number,
          failedCount: response.failedCount as number,
          logFile: response.logFile as string,
          createdAt,
          completedAt: response.completedAt as number,
          htmlOutput,
          attachments: attachmentDetails,
          attachmentRules,
        });
      }
      reset();
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
          <div className={`text-xl font-black ${campaignStatus.toneClassName}`}>
            {campaignStatus.label}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {campaignStatus.detail}
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
              Select the header that contains the recipients&apos; email addresses.
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
      <CampaignPreviewDialog
        isOpen={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        renderedPreview={renderedPreview}
        randomContact={randomContact}
        onRandomize={handleRandomizeContact}
        onSend={handleConfirmSend}
        isSending={isSending}
      />
    </div>
  );
};

export default ConfigurePage;
