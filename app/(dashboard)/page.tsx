"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCampaigns } from "@/hooks/use-kampaign";

export default function CampaignList() {
  const { campaigns, loading } = useCampaigns();

  return (
    <div className="space-y-6">
      <div className="border border-border p-6 bg-card">
        <Button asChild>
          <Link href="/import">CREATE NEW CAMPAIGN</Link>
        </Button>
      </div>

      <div className="border border-border bg-card">
        <div className="border-b border-border p-6 bg-secondary">
          <h2 className="text-lg font-black tracking-wide">CAMPAIGN HISTORY</h2>
        </div>

        <div className="overflow-x-auto">
          {loading && (
            <div className="p-6 text-sm text-muted-foreground">
              Loading campaigns…
            </div>
          )}

          {!loading && campaigns.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">
              No campaigns yet. Create your first one.
            </div>
          )}
          <Table>
            <TableHeader className="border-b border-border bg-muted">
              <TableRow>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">
                  NAME
                </TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">
                  SUBJECT
                </TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">
                  RECIPIENTS
                </TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">
                  SENT
                </TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">
                  STATUS
                </TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">
                  ACTION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => {
                const status =
                  campaign.failedCount > 0 ? "completed" : "completed";

                return (
                  <TableRow
                    key={campaign.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      index % 2 === 0 ? "bg-background" : "bg-secondary"
                    }`}
                  >
                    <TableCell className="p-4 font-semibold text-sm">
                      {campaign.name}
                    </TableCell>

                    <TableCell className="p-4 text-sm text-muted-foreground font-mono">
                      {campaign.subject}
                    </TableCell>

                    <TableCell className="p-4 text-sm font-mono">
                      {campaign.totalRecipients.toLocaleString()}
                    </TableCell>

                    <TableCell className="p-4 text-sm font-mono text-muted-foreground">
                      {new Date(campaign.completedAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="p-4">
                      <Badge>{status}</Badge>
                    </TableCell>

                    <TableCell className="p-4">
                      <Button variant="outline">VIEW</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-border p-6 bg-muted text-center text-xs text-muted-foreground">
          Showing {campaigns.length} campaigns
        </div>
      </div>
    </div>
  );
}
