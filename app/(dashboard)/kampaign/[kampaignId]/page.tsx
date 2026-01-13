"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

type KampaignStatus = "COMPLETED" | "FAILED";

type KampaignAttachment = {
  id: string;
  fileName: string;
  bytes: number;
  type: "broadcast" | "personalized";
  rule?: string;
};

type KampaignRecipientLog = {
  recipientEmail: string;
  status: "success" | "failed";
  attachmentsSent: string[];
  errorMessage?: string;
  timestamp: string;
};

type KampaignAttachmentRule = {
  id: string;
  rule: string;
};

type KampaignTemplate = {
  subjectTemplate: string;
  htmlTemplate: string;
};

type Kampaign = {
  id: string;
  name: string;
  status: KampaignStatus;
  senderEmail: string;
  createdAt: string;
  completedAt: string;
  subject: string;
  template: KampaignTemplate;
  attachmentRules: KampaignAttachmentRule[];
  attachments: KampaignAttachment[];
  logs: KampaignRecipientLog[];
};

const campaign: Kampaign = {
  id: "kmp_01JH1T2Z0X9Y8W7V6U5T4S3R2Q",
  name: "Q1 Product Launch – Early Access",
  status: "FAILED",
  senderEmail: "launch@kampaign.local",
  createdAt: "2026-01-03T20:14:22.000Z",
  completedAt: "2026-01-03T20:18:41.000Z",
  subject: "{{firstName}}, your early access is ready → {{planName}}",
  template: {
    subjectTemplate: "{{firstName}}, your early access is ready → {{planName}}",
    htmlTemplate: `<div>
  <p>Hi {{firstName}},</p>
  <p>Your <strong>{{planName}}</strong> early access is ready.</p>
  <p>
    Company: <span>{{company}}</span><br />
    Account ID: <span>{{accountId}}</span>
  </p>
  <p>
    <a href="{{ctaUrl}}">View early access</a>
  </p>
  <hr />
  <p>Sent by {{senderEmail}}</p>
</div>`,
  },
  attachmentRules: [
    {
      id: "rule_001",
      rule: "Always attach: launch-overview.pdf",
    },
    {
      id: "rule_002",
      rule: "If recipient has accountId → attach invoice_{{accountId}}.pdf",
    },
    {
      id: "rule_003",
      rule: "If recipient has company → attach logo_{{company}}.png",
    },
  ],
  attachments: [
    {
      id: "att_001",
      fileName: "launch-overview.pdf",
      bytes: 384_120,
      type: "broadcast",
    },
    {
      id: "att_002",
      fileName: "invoice_{{accountId}}.pdf",
      bytes: 245_880,
      type: "personalized",
      rule: "accountId",
    },
    {
      id: "att_003",
      fileName: "logo_{{company}}.png",
      bytes: 88_042,
      type: "personalized",
      rule: "company",
    },
  ],
  logs: [
    {
      recipientEmail: "ava@acme.com",
      status: "success",
      attachmentsSent: ["launch-overview.pdf", "invoice_{{accountId}}.pdf"],
      timestamp: "2026-01-03T20:14:55.000Z",
    },
    {
      recipientEmail: "liam@acme.com",
      status: "success",
      attachmentsSent: ["launch-overview.pdf"],
      timestamp: "2026-01-03T20:15:08.000Z",
    },
    {
      recipientEmail: "noah@northwind.io",
      status: "success",
      attachmentsSent: ["launch-overview.pdf", "logo_{{company}}.png"],
      timestamp: "2026-01-03T20:15:22.000Z",
    },
    {
      recipientEmail: "mia@northwind.io",
      status: "failed",
      attachmentsSent: ["launch-overview.pdf"],
      errorMessage: "SMTP 550: mailbox unavailable",
      timestamp: "2026-01-03T20:15:33.000Z",
    },
    {
      recipientEmail: "olivia@globex.co",
      status: "success",
      attachmentsSent: [
        "launch-overview.pdf",
        "invoice_{{accountId}}.pdf",
        "logo_{{company}}.png",
      ],
      timestamp: "2026-01-03T20:15:47.000Z",
    },
    {
      recipientEmail: "ethan@globex.co",
      status: "success",
      attachmentsSent: ["launch-overview.pdf"],
      timestamp: "2026-01-03T20:16:03.000Z",
    },
    {
      recipientEmail: "sophia@initech.com",
      status: "success",
      attachmentsSent: ["launch-overview.pdf", "invoice_{{accountId}}.pdf"],
      timestamp: "2026-01-03T20:16:19.000Z",
    },
    {
      recipientEmail: "jack@initech.com",
      status: "success",
      attachmentsSent: ["launch-overview.pdf"],
      timestamp: "2026-01-03T20:16:35.000Z",
    },
    {
      recipientEmail: "amelia@umbrella.dev",
      status: "success",
      attachmentsSent: ["launch-overview.pdf", "logo_{{company}}.png"],
      timestamp: "2026-01-03T20:17:01.000Z",
    },
    {
      recipientEmail: "lucas@umbrella.dev",
      status: "failed",
      attachmentsSent: ["launch-overview.pdf"],
      errorMessage: "Timeout while connecting to SMTP server",
      timestamp: "2026-01-03T20:17:24.000Z",
    },
  ],
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString();
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export default function KampaignDetailPage({
  params,
}: {
  params: Promise<{ kampaignId: string }>;
}) {
  const { kampaignId } = React.use(params);
  
  const totalRecipients = campaign.logs.length;
  const sentSuccessfully = campaign.logs.filter((l) => l.status === "success").length;
  const failed = campaign.logs.filter((l) => l.status === "failed").length;
  const successRate = totalRecipients === 0 ? 0 : (sentSuccessfully / totalRecipients) * 100;

  const createdAtMs = new Date(campaign.createdAt).getTime();
  const completedAtMs = new Date(campaign.completedAt).getTime();
  const durationMs = completedAtMs - createdAtMs;

  const statusBadgeVariant = campaign.status === "FAILED" ? "destructive" : "default";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-border bg-card">
        <div className="p-6 border-b border-border bg-secondary flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              {campaign.name}
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {kampaignId}
            </p>
          </div>
          <Badge variant={statusBadgeVariant}>{campaign.status}</Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
          <div className="p-6 text-center">
            <div className="text-3xl font-black">{totalRecipients}</div>
            <div className="text-xs text-muted-foreground mt-1">TOTAL</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black text-primary">{sentSuccessfully}</div>
            <div className="text-xs text-muted-foreground mt-1">SENT</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black text-destructive">{failed}</div>
            <div className="text-xs text-muted-foreground mt-1">FAILED</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black">{successRate.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground mt-1">SUCCESS</div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">SENDER</Label>
            <div className="font-mono text-sm mt-1">{campaign.senderEmail}</div>
          </div>
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">CREATED</Label>
            <div className="font-mono text-sm mt-1">{formatTimestamp(campaign.createdAt)}</div>
          </div>
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">COMPLETED</Label>
            <div className="font-mono text-sm mt-1">{formatTimestamp(campaign.completedAt)}</div>
          </div>
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">DURATION</Label>
            <div className="font-mono text-sm mt-1">{formatDuration(durationMs)}</div>
          </div>
        </div>
      </div>

      {/* Subject */}
      <div className="border border-border bg-card">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <Label className="text-xs font-black tracking-wide">SUBJECT</Label>
        </div>
        <div className="p-6">
          <div className="font-mono text-sm">
            {campaign.template.subjectTemplate || "(Empty subject)"}
          </div>
        </div>
      </div>

      {/* Body Preview */}
      <div className="border border-border bg-card">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <Label className="text-xs font-black tracking-wide">BODY PREVIEW</Label>
        </div>
        <div className="p-6">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: campaign.template.htmlTemplate }}
          />
        </div>
      </div>

      {/* Two Column: Attachments & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Files */}
        <div className="border border-border bg-card">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <Label className="text-xs font-black tracking-wide">ATTACHMENTS</Label>
          </div>
          <div className="divide-y divide-border">
            {campaign.attachments.map((file) => (
              <div key={file.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm">{file.fileName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatBytes(file.bytes)}
                  </div>
                </div>
                <Badge variant="outline">{file.type}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="border border-border bg-card">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <Label className="text-xs font-black tracking-wide">ATTACHMENT RULES</Label>
          </div>
          <div className="divide-y divide-border">
            {campaign.attachmentRules.map((rule) => (
              <div key={rule.id} className="p-4">
                <div className="font-mono text-sm text-muted-foreground">{rule.rule}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="border border-border bg-card">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <Label className="text-xs font-black tracking-wide">DELIVERY LOGS</Label>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-border bg-muted">
              <TableRow>
                <TableHead className="p-4 font-black text-xs tracking-widest">
                  RECIPIENT
                </TableHead>
                <TableHead className="p-4 font-black text-xs tracking-widest">
                  STATUS
                </TableHead>
                <TableHead className="p-4 font-black text-xs tracking-widest">
                  ATTACHMENTS
                </TableHead>
                <TableHead className="p-4 font-black text-xs tracking-widest">
                  ERROR
                </TableHead>
                <TableHead className="p-4 font-black text-xs tracking-widest">
                  TIME
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.logs.map((log, index) => (
                <TableRow
                  key={`${log.recipientEmail}-${log.timestamp}`}
                  className={`border-b border-border ${
                    index % 2 === 0 ? "bg-background" : "bg-secondary"
                  }`}
                >
                  <TableCell className="p-4 font-mono text-sm">
                    {log.recipientEmail}
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      variant={log.status === "failed" ? "destructive" : "secondary"}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground">
                    {log.attachmentsSent.length > 0 ? (
                      <span className="font-mono">
                        {log.attachmentsSent.join(", ")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground">
                    {log.errorMessage || "—"}
                  </TableCell>
                  <TableCell className="p-4 font-mono text-sm text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
