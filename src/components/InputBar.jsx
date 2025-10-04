import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InputBar({ onStartDiscussion, isLoading }) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onStartDiscussion(topic);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3 items-center p-6 bg-card border-t border-border">
        <div className="relative flex-1">
          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ask your advisory board a business question..."
            disabled={isLoading}
            className="pl-12 h-14 bg-background border-border text-lg focus-visible:ring-primary"
          />
        </div>
        <Button
          type="submit"
          disabled={!topic.trim() || isLoading}
          className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Discussing...</span>
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Start Discussion
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
