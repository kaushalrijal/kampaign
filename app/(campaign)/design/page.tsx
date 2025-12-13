"use client";

import { RichTextEditor } from "@/components/design/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

// Example headers array for autocomplete
const headers = [
  "first_name",
  "last_name",
  "email",
  "company",
  "phone",
  "address",
  "city",
  "state",
  "zip_code",
  "country",
  "job_title",
  "department",
];

const DesignPage = () => {
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
              />
            </div>
            <div>
              <Label>BODY</Label>
              <RichTextEditor headers={headers} ref={editorRef} />
              {/* autocomplete for headers */}
              <section
                aria-labelledby="available-headers-title"
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
                  {headers.map((header) => (
                    <Button
                      key={header}
                      type="button"
                      onClick={() => editorRef.current?.insertHeader(header)}
                      className="px-2 py-1 bg-black text-white font-mono text-xs hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                      aria-label={`Insert ${header} header`}
                    >
                      {"{" + header + "}"}
                    </Button>
                  ))}
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
