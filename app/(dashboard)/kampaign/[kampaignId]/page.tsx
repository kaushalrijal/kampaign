"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCampaign } from "@/hooks/use-kampaign";
import { CampaignRecord } from "@/lib/db/types";

type CampaignStatus = {
  label: string;
  detail: string;
  variant: "default" | "secondary" | "destructive";
};

type RecipientLogEntry = {
  recipient?: string;
  status?: "sent" | "failed";
  attachments?: string[];
  error?: string;
  timestamp?: number;
};

type DisplayLogEntry = {
  recipientEmail: string;
  status: "success" | "failed";
  attachmentsSent: string[];
  errorMessage?: string;
  timestamp?: number;
};

function getCampaignStatus(campaign: CampaignRecord): CampaignStatus {
  const total = campaign.totalRecipients;
  const sent = campaign.sentCount;
  const failed = campaign.failedCount;

  if (total === 0) {
    return {
      label: "EMPTY",
      detail: "No recipients were queued for this kampaign.",
      variant: "default",
    };
  }

  if (sent === 0 && failed > 0) {
    return {
      label: "FAILED",
      detail: "All deliveries failed.",
      variant: "destructive",
    };
  }

  if (failed > 0) {
    return {
      label: "PARTIAL",
      detail: `${failed} of ${total} recipients failed.`,
      variant: "destructive",
    };
  }

  if (sent >= total) {
    return {
      label: "SENT",
      detail: "Delivered to all recipients.",
      variant: "secondary",
    };
  }

  return {
    label: "SENDING",
    detail: "Delivery is still in progress.",
    variant: "default",
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function formatTimestamp(value?: number) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function formatDuration(ms?: number) {
  if (ms === undefined || ms === null || Number.isNaN(ms)) return "N/A";
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function normalizeLogs(entries: RecipientLogEntry[]): DisplayLogEntry[] {
  return entries.map((entry) => ({
    recipientEmail: entry.recipient ?? "Unknown",
    status: entry.status === "failed" ? "failed" : "success",
    attachmentsSent: Array.isArray(entry.attachments) ? entry.attachments : [],
    errorMessage: entry.error,
    timestamp: entry.timestamp,
  }));
}

export default function KampaignDetailPage({
  params,
}: {
  params: Promise<{ kampaignId: string }>;
}) {
  const { kampaignId } = React.use(params);
  const { campaign, loading } = useCampaign(kampaignId);
  const [logs, setLogs] = React.useState<DisplayLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!campaign?.slug) return;

    let mounted = true;
    setLogsLoading(true);

    fetch(`/api/campaign/logs/${encodeURIComponent(campaign.slug)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (mounted) {
          const entries = Array.isArray(data) ? data : [];
          setLogs(normalizeLogs(entries));
        }
      })
      .catch(() => {
        if (mounted) setLogs([]);
      })
      .finally(() => {
        if (mounted) setLogsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [campaign?.slug]);

  if (loading) {
    return (
      <div className="border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading kampaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="border border-border bg-card p-6">
        <h1 className="text-2xl font-black tracking-tight">
          Kampaign not found
        </h1>
        <p className="text-xs text-muted-foreground font-mono mt-2">
          {kampaignId}
        </p>
      </div>
    );
  }

  const status = getCampaignStatus(campaign);
  const successRate =
    campaign.totalRecipients === 0
      ? 0
      : (campaign.sentCount / campaign.totalRecipients) * 100;
  const durationMs =
    campaign.completedAt && campaign.createdAt
      ? campaign.completedAt - campaign.createdAt
      : undefined;
  const attachments = campaign.attachments ?? [];
  const attachmentRules = campaign.attachmentRules ?? [];

  return (
    <div className="space-y-8">
      <div className="border border-border bg-card">
        <div className="p-6 border-b border-border bg-secondary flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              {campaign.name}
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {campaign.id}
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
          <div className="p-6 text-center">
            <div className="text-3xl font-black">
              {campaign.totalRecipients}
            </div>
            <div className="text-xs text-muted-foreground mt-1">TOTAL</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black text-primary">
              {campaign.sentCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">SENT</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black text-destructive">
              {campaign.failedCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">FAILED</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-black">
              {successRate.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">SUCCESS</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">SENDER</Label>
            <div className="font-mono text-sm mt-1">
              {campaign.senderEmail || "N/A"}
            </div>
          </div>
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">CREATED</Label>
            <div className="font-mono text-sm mt-1">
              {formatTimestamp(campaign.createdAt)}
            </div>
          </div>
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">COMPLETED</Label>
            <div className="font-mono text-sm mt-1">
              {formatTimestamp(campaign.completedAt)}
            </div>
          </div>
          <div className="bg-card p-4">
            <Label className="text-xs text-muted-foreground">DURATION</Label>
            <div className="font-mono text-sm mt-1">
              {formatDuration(durationMs)}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-border bg-card">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <Label className="text-xs font-black tracking-wide">SUBJECT</Label>
        </div>
        <div className="p-6">
          <div className="font-mono text-sm">
            {campaign.subject || "(Empty subject)"}
          </div>
        </div>
      </div>

      <div className="border border-border bg-card">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <Label className="text-xs font-black tracking-wide">BODY PREVIEW</Label>
        </div>
        <div className="p-6">
          {campaign.htmlOutput ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: campaign.htmlOutput }}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              No body preview available.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border bg-card">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <Label className="text-xs font-black tracking-wide">ATTACHMENTS</Label>
          </div>
          <div className="divide-y divide-border">
            {attachments.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No attachments recorded.
              </div>
            ) : (
              attachments.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm">{file.fileName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatBytes(file.bytes)}
                    </div>
                  </div>
                  <Badge variant="outline">{file.type}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-border bg-card">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <Label className="text-xs font-black tracking-wide">
              ATTACHMENT RULES
            </Label>
          </div>
          <div className="divide-y divide-border">
            {attachmentRules.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No attachment rules recorded.
              </div>
            ) : (
              attachmentRules.map((rule) => (
                <div key={rule.id} className="p-4">
                  <div className="font-mono text-sm text-muted-foreground">
                    {rule.rule}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
              {logsLoading && (
                <TableRow className="border-b border-border">
                  <TableCell
                    colSpan={5}
                    className="p-4 text-sm text-muted-foreground"
                  >
                    Loading delivery logs...
                  </TableCell>
                </TableRow>
              )}
              {!logsLoading && logs.length === 0 && (
                <TableRow className="border-b border-border">
                  <TableCell
                    colSpan={5}
                    className="p-4 text-sm text-muted-foreground"
                  >
                    No delivery logs recorded.
                  </TableCell>
                </TableRow>
              )}
              {!logsLoading &&
                logs.map((log, index) => (
                  <TableRow
                    key={`${log.recipientEmail}-${log.timestamp ?? index}`}
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
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="p-4 text-sm text-muted-foreground">
                      {log.errorMessage || "-"}
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
