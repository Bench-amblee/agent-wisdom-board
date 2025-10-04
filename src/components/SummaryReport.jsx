import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SummaryReport({ summary }) {
  if (!summary) return null;

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `advisory-board-summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm animate-fade-in">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Executive Summary
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="p-4 bg-background rounded-lg border border-border">
          <p className="text-foreground/90 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}
