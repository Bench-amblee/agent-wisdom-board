import { TrendingUp, Headphones, FlaskConical, Bot } from "lucide-react";

const agentConfig = {
  Sales: {
    icon: TrendingUp,
    gradient: "bg-gradient-sales",
    color: "text-agent-sales-light",
    bgColor: "bg-agent-sales/10",
    borderColor: "border-agent-sales/30",
  },
  Support: {
    icon: Headphones,
    gradient: "bg-gradient-support",
    color: "text-agent-support-light",
    bgColor: "bg-agent-support/10",
    borderColor: "border-agent-support/30",
  },
  Research: {
    icon: FlaskConical,
    gradient: "bg-gradient-research",
    color: "text-agent-research-light",
    bgColor: "bg-agent-research/10",
    borderColor: "border-agent-research/30",
  },
  System: {
    icon: Bot,
    gradient: "bg-secondary",
    color: "text-primary",
    bgColor: "bg-secondary/50",
    borderColor: "border-border",
  },
};

export function AgentMessage({ message }) {
  const config = agentConfig[message.agent] || agentConfig.System;
  const Icon = config.icon;

  return (
    <div className="animate-fade-in">
      <div className={`flex gap-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} backdrop-blur-sm`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.gradient} flex items-center justify-center shadow-glow ${config.color.replace('text-', 'shadow-')}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Message Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${config.color}`}>
              {message.agent}
            </span>
            {message.timestamp && (
              <span className="text-xs text-muted-foreground">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>

          <p className="text-foreground/90 leading-relaxed">
            {message.isThinking ? (
              <span className="flex items-center gap-2">
                <span>{message.text}</span>
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                </span>
              </span>
            ) : (
              message.text
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
