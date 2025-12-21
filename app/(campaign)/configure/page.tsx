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
import { sendCampaign, testSMTPConnection } from "@/lib/api";
import { useKampaignStore } from "@/lib/store/kampaign-store";
import { validateContent } from "@/lib/validate";
import { useState } from "react";
import { toast } from "sonner";

const ConfigurePage = () => {
  const {
    campaignName,
    setCampaignName,
    contacts,
    attachments,
    headers,
    recipientHeader,
    setRecipientHeader,
  } = useKampaignStore();
  const [SMTPStatus, setSMTPStatus] = useState<
    "idle" | "testing" | "success" | "failed"
  >("idle");

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
    } else {
      try {
        const response = await sendCampaign({
          title: "labalaba",
        });

        console.log(response);
        return;
      } catch (error) {
        console.log("Error: ", error);
        toast.error("Failed to send campaign");
      }
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
    </div>
  );
};

export default ConfigurePage;
