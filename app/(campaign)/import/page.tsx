"use client"

const ImportPage = () => {
  const handleFileSelect = () => {
    return;
  }
  return (
    <div className="space-y-8 mb-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">IMPORT RECIPIENTS</h2>
        <p className="text-muted-foreground text-sm">
          Upload any CSV or Excel files. All columns will be available for personalization in your email template.
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
          <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
          <div className="space-y-2">
            <div className="text-sm font-black tracking-wide">DRAG FILE HERE OR CLICK TO BROWSE</div>
            <div className="text-xs text-muted-foreground">
              Supports CSV and Excel formats. Columns will be mapped automatically.
            </div>
          </div>
        </label>
      </div>
      </div>
    </div>
  )
}

export default ImportPage