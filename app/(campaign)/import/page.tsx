"use client";

import { Badge } from "@/components/ui/badge";
import { DragDropUpload } from "@/components/shared/drag-drop-upload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseFile } from "@/lib/parser/parseFile";
import { useKampaignStore } from "@/lib/store/kampaign-store";

const ImportPage = () => {
  const {contacts, setContacts, headers, setHeaders} = useKampaignStore();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0];
    console.log(file);
    if (!file) {
      return;
    }

    setContacts([]);
    setHeaders([]);

    const rows = await parseFile(file);
    const headers = Object.keys(rows[0]);
    setContacts(rows);
    setHeaders(headers);
    console.log(rows);
    console.log(headers);
    return;
  };

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
        <DragDropUpload
          onFileSelect={handleFileSelect}
          accept=".csv,.xls,.xlsx"
          multiple={false}
          title="DRAG FILE HERE OR CLICK TO BROWSE"
          description="Supports CSV and Excel formats. Columns will be mapped automatically."
          dragHighlightClass="bg-primary/10"
        />
      </div>

      {/* Only visible after data is imported!!! */}
      {contacts.length > 0 && (
        // Column Info
        // Imported Data
        <div className="space-y-6">
          <div className="border border-border">
            <div className="bg-secondary px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-black tracking-wide">
                COLUMNS DETECTED ({headers.length})
              </h3>
              <div className="text-xs font-mono px-2 py-1 bg-background border border-border">
                {contacts.length} rows
              </div>
            </div>
            <div className="px-6 py-4 flex flex-wrap gap-2">
              {headers.map((header) => (
                <Badge key={header}>{header}</Badge>
              ))}
            </div>
          </div>

          <div className="border border-border">
            <div className="bg-secondary px-6 py-4 border-b border-border">
              <h3 className="text-sm font-black tracking-wide">PREVIEW</h3>
            </div>
            <div className="overflow-x-auto w-full">
              <Table className="w-full table-auto">
                <TableHeader className="border-b border-border bg-muted">
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead
                        key={header}
                        className="px-6 py-3 text-left font-semibold tracking-wide text-xs uppercase"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.slice(0, 10).map((contact, idx) => (
                    <TableRow
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                      key={idx}
                    >
                      {headers.map((header) => (
                        <TableCell
                          key={header}
                          className="px-6 py-3 text-sm font-mono text-foreground"
                        >
                          {contact[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {contacts.length > 10 && (
                <div className="px-6 py-3 text-xs text-muted-foreground bg-muted border-t border-border">
                  ... and {contacts.length - 10} more rows)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
