"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Campaign {
  id: string
  name: string
  subject: string
  recipientCount: number
  sentDate: string
  status: "completed" | "draft"
}

export default function CampaignList() {
  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Q1 Product Launch",
      subject: "Introducing our new features",
      recipientCount: 1250,
      sentDate: "2024-03-15",
      status: "completed",
    },
    {
      id: "2",
      name: "Summer Sale Announcement",
      subject: "Limited time offer inside",
      recipientCount: 2840,
      sentDate: "2024-03-10",
      status: "completed",
    },
    {
      id: "3",
      name: "Feedback Survey",
      subject: "We want to hear from you",
      recipientCount: 950,
      sentDate: "2024-03-05",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="border border-border p-6 bg-card">
          <Button asChild>
            <Link href="/import">
              CREATE NEW CAMPAIGN
            </Link>
          </Button>
      </div>

      <div className="border border-border bg-card">
        <div className="border-b border-border p-6 bg-secondary">
          <h2 className="text-lg font-black tracking-wide">CAMPAIGN HISTORY</h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-border bg-muted">
              <TableRow>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">NAME</TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">SUBJECT</TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">RECIPIENTS</TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">SENT</TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">STATUS</TableHead>
                <TableHead className="text-left p-4 font-black text-xs tracking-widest">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => (
                <TableRow
                  key={campaign.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-secondary"
                  }`}
                >
                  <TableCell className="p-4 font-semibold text-sm">{campaign.name}</TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground font-mono">{campaign.subject}</TableCell>
                  <TableCell className="p-4 text-sm font-mono">{campaign.recipientCount.toLocaleString()}</TableCell>
                  <TableCell className="p-4 text-sm font-mono text-muted-foreground">{campaign.sentDate}</TableCell>
                  <TableCell className="p-4">
                    <span className="inline-block px-3 py-1 border border-border text-xs font-semibold tracking-wide uppercase">
                      {campaign.status}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <Button className="text-xs px-3 py-1 bg-muted text-foreground hover:bg-muted/80 border border-border font-semibold tracking-wide">
                      VIEW
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-border p-6 bg-muted text-center text-xs text-muted-foreground">
          Showing {campaigns.length} campaigns
        </div>
      </div>
    </div>
  )
}
