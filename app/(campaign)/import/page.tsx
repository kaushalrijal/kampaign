"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseFile } from "@/lib/parser/parseFile";
import { ChevronRight } from "lucide-react";

const ImportPage = () => {

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("file select triggered")
    const file = event.target.files![0];
    console.log(file)
    if(!file) {
      console.log("no file")
      return;
    };

    const rows = await parseFile(file);
    const headers = Object.keys(rows[0])
    console.log(rows)
    console.log(headers)
    return;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-primary/10")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-primary/10")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-primary/10")
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect({ target: { files: e.dataTransfer.files } } as any)
    }
  }
  return (
    <div className="space-y-8 mb-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          IMPORT RECIPIENTS
        </h2>
        <p className="text-muted-foreground text-sm">
          Upload any CSV or Excel files. All columns will be available for
          personalization in your email template.
        </p>
      </div>

      {/* Drag n drop area */}
      <div>
        <div
          // onDragOver={handleDragOver}
          // onDragLeave={handleDragLeave}
          // onDrop={handleDrop}
          className="border-2 border-dashed border-border p-12 text-center bg-muted/20 transition-colors cursor-pointer hover:border-foreground w-full"
        >
          <label className="block cursor-pointer">
            <Input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileSelect}
              className="hidden w-full"
            />
            <div className="space-y-2">
              <div className="text-sm font-black tracking-wide">
                DRAG FILE HERE OR CLICK TO BROWSE
              </div>
              <div className="text-xs text-muted-foreground">
                Supports CSV and Excel formats. Columns will be mapped
                automatically.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Only visible after data is imported!!! */}
      {/* Imported Data */}
      <div className="space-y-6">
        {/* Column Info */}
        <div className="border border-border">
          <div className="bg-secondary px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-black tracking-wide">
              COLUMNS DETECTED (x)
            </h3>
            <div className="text-xs font-mono px-2 py-1 bg-background border border-border">
              y rows
            </div>
          </div>
          <div className="px-6 py-4 flex flex-wrap gap-2">
            <Badge>
              {"{"}
              {"Header 1"}
              {"}"}
            </Badge>
            <Badge>
              {"{"}
              {"Header 2"}
              {"}"}
            </Badge>
            <Badge>
              {"{"}
              {"Header 3"}
              {"}"}
            </Badge>
          </div>
        </div>

        {/* Preview imported file */}
        <div className="border border-border">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <h3 className="text-sm font-black tracking-wide">PREVIEW</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-border bg-muted">
                <TableRow>
                  {/* TODO: MAP WITH TABLE HEADERS */}
                  <TableHead className="px-6 py-3 text-left font-semibold tracking-wide text-xs uppercase">
                    {"header1"}
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold tracking-wide text-xs uppercase">
                    {"header2"}
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold tracking-wide text-xs uppercase">
                    {"header3"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border hover:bg-muted/50 transition-colors">
                  {/* TODO: MAP WITH REAL DATA */}
                  <TableCell className="px-6 py-3 text-sm font-mono text-foreground">
                    Some Data
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm font-mono text-foreground">
                    Some More data
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm font-mono text-foreground">
                    Some more more data
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-border hover:bg-muted/50 transition-colors">
                  {/* TODO: MAP WITH REAL DATA */}
                  <TableCell className="px-6 py-3 text-sm font-mono text-foreground">
                    Some Data
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm font-mono text-foreground">
                    Some More data
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm font-mono text-foreground">
                    Some more more data
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="px-6 py-3 text-xs text-muted-foreground bg-muted border-t border-border">
              ... and some more rows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
