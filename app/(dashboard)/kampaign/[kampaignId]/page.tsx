"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

function SummaryField({
  label,
  value,
  monospace,
}: {
  label: string;
  value: React.ReactNode;
  monospace?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={monospace ? "font-mono text-sm" : "text-sm font-medium"}>
        {value}
      </div>
    </div>
  );
}

export default function KampaignDetailPage({
  params,
}: {
  params: { kampaignId: string };
}) {
  const totalRecipients = campaign.logs.length;
  const sentSuccessfully = campaign.logs.filter((l) => l.status === "success").length;
  const failed = campaign.logs.filter((l) => l.status === "failed").length;
  const successRate = totalRecipients === 0 ? 0 : (sentSuccessfully / totalRecipients) * 100;

  const createdAtMs = new Date(campaign.createdAt).getTime();
  const completedAtMs = new Date(campaign.completedAt).getTime();
  const durationMs = completedAtMs - createdAtMs;

  const statusBadgeVariant = campaign.status === "FAILED" ? "destructive" : "default";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {campaign.name}
          </h1>
          <div className="text-sm text-muted-foreground">
            <span className="mr-2">Campaign ID</span>
            <span className="font-mono">{params.kampaignId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusBadgeVariant}>{campaign.status}</Badge>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="border-b border-border bg-secondary">
          <CardTitle className="text-sm font-black tracking-wide">SUMMARY</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryField
              label="Total Recipients"
              value={totalRecipients.toLocaleString()}
              monospace
            />
            <SummaryField
              label="Sent Successfully"
              value={sentSuccessfully.toLocaleString()}
              monospace
            />
            <SummaryField label="Failed" value={failed.toLocaleString()} monospace />
            <SummaryField
              label="Success Rate"
              value={`${successRate.toFixed(1)}%`}
              monospace
            />
            <SummaryField label="Subject" value={campaign.subject} />
            <SummaryField
              label="Created At"
              value={formatTimestamp(campaign.createdAt)}
              monospace
            />
            <SummaryField
              label="Completed At"
              value={formatTimestamp(campaign.completedAt)}
              monospace
            />
            <SummaryField
              label="Duration"
              value={formatDuration(durationMs)}
              monospace
            />
            <SummaryField label="Sender" value={campaign.senderEmail} />
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader className="border-b border-border bg-secondary">
          <CardTitle className="text-sm font-black tracking-wide">DETAILS</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="template">
              <AccordionTrigger>TEMPLATE</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">
                      Subject
                    </Label>
                    <div className="border border-border bg-muted p-3 font-mono text-sm min-h-12 flex items-center">
                      {campaign.template.subjectTemplate || "(Empty subject)"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">
                      Body Preview
                    </Label>
                    <div className="border border-border bg-background p-4 min-h-64 max-h-96 overflow-y-auto overflow-x-hidden w-full">
                      <div
                        className="prose prose-sm max-w-none wrap-break-words"
                        dangerouslySetInnerHTML={{ __html: campaign.template.htmlTemplate }}
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="files">
              <AccordionTrigger>FILES</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Attachment Rules
                    </div>
                    <Table>
                      <TableHeader className="border-b border-border bg-muted">
                        <TableRow>
                          <TableHead className="p-4 font-black text-xs tracking-widest">
                            RULE
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {campaign.attachmentRules.map((rule, index) => (
                          <TableRow
                            key={rule.id}
                            className={`border-b border-border ${
                              index % 2 === 0 ? "bg-background" : "bg-secondary"
                            }`}
                          >
                            <TableCell className="p-4 font-mono text-sm text-muted-foreground">
                              {rule.rule}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Files
                    </div>
                <Table>
                  <TableHeader className="border-b border-border bg-muted">
                    <TableRow>
                      <TableHead className="p-4 font-black text-xs tracking-widest">
                        FILE NAME
                      </TableHead>
                      <TableHead className="p-4 font-black text-xs tracking-widest">
                        SIZE
                      </TableHead>
                      <TableHead className="p-4 font-black text-xs tracking-widest">
                        TYPE
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.attachments.map((file, index) => (
                      <TableRow
                        key={file.id}
                        className={`border-b border-border ${
                          index % 2 === 0 ? "bg-background" : "bg-secondary"
                        }`}
                      >
                        <TableCell className="p-4 font-mono text-sm">
                          {file.fileName}
                        </TableCell>
                        <TableCell className="p-4 font-mono text-sm text-muted-foreground">
                          {formatBytes(file.bytes)}
                        </TableCell>
                        <TableCell className="p-4">
                          <Badge variant="outline">{file.type}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="logs">
              <AccordionTrigger>LOGS</AccordionTrigger>
              <AccordionContent>
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
                        ATTACHMENTS SENT
                      </TableHead>
                      <TableHead className="p-4 font-black text-xs tracking-widest">
                        ERROR
                      </TableHead>
                      <TableHead className="p-4 font-black text-xs tracking-widest">
                        TIMESTAMP
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
                            variant={
                              log.status === "failed" ? "destructive" : "secondary"
                            }
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
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="p-4 text-sm text-muted-foreground">
                          {log.errorMessage ? log.errorMessage : "—"}
                        </TableCell>
                        <TableCell className="p-4 font-mono text-sm text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
