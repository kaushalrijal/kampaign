"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKampaignStore } from "@/lib/store/kampaign-store";

const ConfigurePage = () => {
  const {campaignName, setCampaignName} = useKampaignStore()
  
  const handleTestConnection = () => {
    return;
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
          <div className="text-4xl font-black">69</div>
          <div className="text-xs text-muted-foreground mt-2">
            emails to be sent
          </div>
        </div>

        <div className="border border-border p-6 bg-card">
          <Label>ATTACHMENTS</Label>
          <div className="text-4xl font-black">3</div>
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

          <Button variant={"outline"} onClick={handleTestConnection}>TEST CONNECTION</Button>
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
          <p className="text-xs text-muted-foreground mt-2">For your campaign history records</p>
        </div>
      </div>

      {/* Send Button */}
      <div className="border border-border">
        <div className="p-8 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              You are about to send <span className="font-black">69</span> personalized emails.
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-4 max-w-4xl">
            <Button variant={"destructive"}>
              SEND NOW (69 emails)
            </Button>
            <Button variant={"secondary"}>
              SCHEDULE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurePage;
