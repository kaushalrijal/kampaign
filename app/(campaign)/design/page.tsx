"use client";

import { RichTextEditor } from "@/components/design/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKampaignStore } from "@/lib/store/kampaign-store";
import Link from "next/link";
import { useRef } from "react";

const DesignPage = () => {
  const {headers, subject, setSubject} = useKampaignStore()
  const editorRef = useRef<{ insertHeader: (header: string) => void } | null>(
    null
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          DESIGN EMAIL TEMPLATE
        </h2>
        <p className="text-muted-foreground text-sm">
          Create your subject and email body. Use available columns from your
          Contacts Table for personalization.
        </p>
      </div>

      <div className="gap-8">
        {/* Main Editor */}
        <div className="border border-border">
          <div className="p-8 space-y-8">
            {/* Subject Line */}
            <div>
              <Label>SUBJECT</Label>
              <Input
                type="text"
                placeholder="Requesting Sponsorship for Hackathon"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <Label>BODY</Label>
              <RichTextEditor headers={headers} ref={editorRef} />
              {/* autocomplete for headers */}
              <section
                aria-labelledby="available-headers-title"
                className="mt-4"
              >
                <div className="flex items-center justify-between">
                  <Label>
                    AVAILABLE HEADERS
                  </Label>
                  <span className="text-xs text-neutral-500">
                    Click to insert or type to autocomplete
                  </span>
                </div>
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Available headers for insertion"
                >
                  {headers.length>0 ? headers.map((header) => (
                    <Button
                      key={header}
                      type="button"
                      onClick={() => editorRef.current?.insertHeader(header)}
                      className="px-2 font-mono text-xs cursor-pointer"
                      variant={"secondary"}
                      aria-label={`Insert ${header} header`}
                    >
                      {"{" + header + "}"}
                    </Button>
                  )) : (
                    <p className="text-sm text-neutral-600"><Link href={"/import"} className="underline">Import</Link> contacts to see available headers.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPage;
