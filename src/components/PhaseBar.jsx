import { Loader2 } from "lucide-react";

export function PhaseBar({ phase }) {
  if (!phase) return null;

  return (
    <div className="w-full bg-background/60 border-b border-border px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">{phase.phase}</div>
            <div className="text-sm font-medium">{phase.label}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Agents are working — this may take a moment</div>
      </div>
    </div>
  );
}

export default PhaseBar;
