import { useState } from "react";
import { Brain, RotateCcw } from "lucide-react";
import PhaseBar from "@/components/PhaseBar";
import { Button } from "@/components/ui/button";
import { InputBar } from "@/components/InputBar";
import { ChatWindow } from "@/components/ChatWindow";
import { SummaryReport } from "@/components/SummaryReport";
import { streamDiscussion } from "@/api/mockBackend";
import { toast } from "sonner";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState(null);
  const [tab, setTab] = useState("discussion");
  const [currentTopic, setCurrentTopic] = useState("");

  const handleStartDiscussion = async (topic) => {
    setIsLoading(true);
    setMessages([]);
    setSummary("");
    setCurrentTopic(topic);

    try {
      const stream = streamDiscussion(topic);

      for await (const chunk of stream) {
        if (chunk.type === "phase") {
          setPhase(chunk.data);
          // ensure the discussion tab is visible when agents work
          setTab("discussion");
        } else if (chunk.type === "message") {
          setMessages((prev) => [...prev, chunk.data]);
        } else if (chunk.type === "summary") {
          setSummary(chunk.data);
          // switch tab to summary when complete
          setTab("summary");
          setPhase(null);
        }
      }

      toast.success("Discussion complete!");
    } catch (error) {
      toast.error("Failed to start discussion. Please try again.");
      console.error("Discussion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setSummary("");
    setCurrentTopic("");
    toast.info("Ready for a new discussion");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header border-b border-border shadow-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  AI Agent Advisory Board
                </h1>
                <p className="text-sm text-muted-foreground">
                  Collaborative intelligence for business decisions
                </p>
              </div>
            </div>

            {currentTopic && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                New Topic
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Phase bar */}
        {phase && <div className="sticky top-16 z-20"><PhaseBar phase={phase} /></div>}

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              className={`px-3 py-1 rounded-md ${tab === 'discussion' ? 'bg-primary text-white' : 'bg-muted-foreground/5'}`}
              onClick={() => setTab('discussion')}
            >Discussion</button>
            <button
              className={`px-3 py-1 rounded-md ${tab === 'summary' ? 'bg-primary text-white' : 'bg-muted-foreground/5'}`}
              onClick={() => setTab('summary')}
            >Final Summary</button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {tab === 'discussion' ? (
              <ChatWindow messages={messages} isLoading={isLoading} />
            ) : (
              <div className="py-4">
                <SummaryReport summary={summary} />
              </div>
            )}

            <InputBar onStartDiscussion={handleStartDiscussion} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
