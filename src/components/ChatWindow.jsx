import { useEffect, useRef } from "react";
import { AgentMessage } from "./AgentMessage";
import { MessageSquare } from "lucide-react";

export function ChatWindow({ messages, isLoading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-background"
    >
      {messages.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="p-6 bg-card rounded-full shadow-card">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold text-foreground">
              Welcome to Your AI Advisory Board
            </h3>
            <p className="text-muted-foreground">
              Ask a business question and watch your Sales, Support, and Research agents
              collaborate to provide comprehensive insights.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <AgentMessage key={index} message={message} />
          ))}
          {isLoading && (
            <AgentMessage
              message={{
                agent: "System",
                text: "Agents are analyzing your question...",
                isThinking: true,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
