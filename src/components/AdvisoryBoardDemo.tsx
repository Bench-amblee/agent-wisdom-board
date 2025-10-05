import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Headphones, FlaskConical, Upload, Database, Users } from "lucide-react";
import {
  askAdvisoryBoard,
  type BoardDiscussion,
} from "@/api/backendClient";

// Agent configuration with icons
const agentConfig = {
  "Sales Director": {
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  "Customer Success Director": {
    icon: Headphones,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  "Research Director": {
    icon: FlaskConical,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
};

export function AdvisoryBoardDemo() {
  const [step, setStep] = useState<'question' | 'data-info'>('question');
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [discussion, setDiscussion] = useState<BoardDiscussion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discussion' | 'summary'>('discussion');
  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setDiscussion(null);
    setCurrentPhase(null);
    setActiveTab('discussion');

    try {
      setCurrentPhase("[PHASE 1] Research Phase");
      await new Promise(r => setTimeout(r, 2000)); // Simulate research time
      
      setCurrentPhase("[PHASE 2] Initial Presentations");
      await new Promise(r => setTimeout(r, 2000)); // Simulate presentation time
      
      setCurrentPhase("[PHASE 3] Deliberation Rounds\n   Round 1/1");
      await new Promise(r => setTimeout(r, 2000)); // Simulate deliberation
      
      setCurrentPhase("[PHASE 4] Final Synthesis");
      const result = await askAdvisoryBoard(question, true);
      
      setDiscussion(result);
      setCurrentPhase(null);
      setActiveTab('summary'); // Switch to summary tab when complete
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setLoading(false);
      setCurrentPhase(null);
    }
  };


  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">AI Advisory Board</h1>
        </div>
        <p className="text-muted-foreground mb-3">
          Get strategic insights from a panel of AI experts who analyze your data and collaborate to answer your business questions. Each director brings their specialized perspective through multi-round discussions.
        </p>
      </div>

      {/* Data Info Page */}
      {step === 'data-info' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sample Dataset: Athletic Wear Ecommerce</CardTitle>
            <CardDescription>
              Your advisory board will analyze real sales and customer support data from an athletic wear company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sales Data */}
            <div className="border-2 rounded-lg p-5 bg-blue-500/5 border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Sales Pipeline Data</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The Sales Director will analyze opportunity progression, revenue patterns, and conversion metrics
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Stages</Badge>
                      <span className="text-muted-foreground">SQL → Demo → Proposal → Won/Lost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Sources</Badge>
                      <span className="text-muted-foreground">Ads, Referrals, Affiliates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Metrics</Badge>
                      <span className="text-muted-foreground">Deal amounts, win/loss reasons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Timeline</Badge>
                      <span className="text-muted-foreground">Sep-Oct 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Data */}
            <div className="border-2 rounded-lg p-5 bg-cyan-500/5 border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-500/10">
                  <Headphones className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Customer Support Tickets</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The Customer Success Director will examine support trends, resolution patterns, and customer pain points
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Topics</Badge>
                      <span className="text-muted-foreground">Shipping, refunds, defects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Status</Badge>
                      <span className="text-muted-foreground">Open, pending, solved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Events</Badge>
                      <span className="text-muted-foreground">Opened, replies, escalations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Timeline</Badge>
                      <span className="text-muted-foreground">Sep-Oct 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p>💡 <strong>Tip:</strong> Try questions like "How can we improve customer retention?" or "What's causing deal losses?" to see how the directors collaborate using this data.</p>
            </div>

            <Button
              onClick={() => setStep('question')}
              className="w-full"
              size="lg"
            >
              Back to Questions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Question Page */}
      {step === 'question' && (
        <>
          {/* Advisory Board Members Preview */}
          {!loading && !discussion && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Advisory Board</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${agentConfig["Sales Director"].bgColor} ${agentConfig["Sales Director"].borderColor} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`h-5 w-5 ${agentConfig["Sales Director"].color}`} />
                    <span className={`text-sm font-medium ${agentConfig["Sales Director"].color}`}>Sales Director</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Revenue strategy and pipeline optimization</p>
                </div>
                <div className={`p-4 rounded-lg ${agentConfig["Customer Success Director"].bgColor} ${agentConfig["Customer Success Director"].borderColor} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className={`h-5 w-5 ${agentConfig["Customer Success Director"].color}`} />
                    <span className={`text-sm font-medium ${agentConfig["Customer Success Director"].color}`}>CS Director</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Customer experience and support insights</p>
                </div>
                <div className={`p-4 rounded-lg ${agentConfig["Research Director"].bgColor} ${agentConfig["Research Director"].borderColor} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className={`h-5 w-5 ${agentConfig["Research Director"].color}`} />
                    <span className={`text-sm font-medium ${agentConfig["Research Director"].color}`}>Research Director</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Market analysis and data-driven insights</p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setStep('data-info')}
                  className="text-xs"
                >
                  Learn more about the dataset →
                </Button>
              </div>
            </div>
          )}

        {/* Agent Status Animation */}
      {loading && (
        <div className="mb-6 space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Board members are discussing your question...
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${agentConfig["Sales Director"].bgColor} ${agentConfig["Sales Director"].borderColor} border relative`}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className={`h-5 w-5 ${agentConfig["Sales Director"].color}`} />
                <span className={`text-sm font-medium ${agentConfig["Sales Director"].color}`}>Sales Director</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 border ${agentConfig["Sales Director"].borderColor}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Sales Director"].color} opacity-40 animate-bounce [animation-delay:-0.3s]`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Sales Director"].color} opacity-70 animate-bounce [animation-delay:-0.15s]`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Sales Director"].color} animate-bounce`}></div>
                </div>
                <span className="text-xs text-muted-foreground">Analyzing sales data...</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${agentConfig["Customer Success Director"].bgColor} ${agentConfig["Customer Success Director"].borderColor} border`}>
              <div className="flex items-center gap-2 mb-3">
                <Headphones className={`h-5 w-5 ${agentConfig["Customer Success Director"].color}`} />
                <span className={`text-sm font-medium ${agentConfig["Customer Success Director"].color}`}>CS Director</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 border ${agentConfig["Customer Success Director"].borderColor}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Customer Success Director"].color} opacity-40 animate-bounce [animation-delay:-0.3s]`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Customer Success Director"].color} opacity-70 animate-bounce [animation-delay:-0.15s]`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Customer Success Director"].color} animate-bounce`}></div>
                </div>
                <span className="text-xs text-muted-foreground">Reviewing feedback...</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${agentConfig["Research Director"].bgColor} ${agentConfig["Research Director"].borderColor} border`}>
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className={`h-5 w-5 ${agentConfig["Research Director"].color}`} />
                <span className={`text-sm font-medium ${agentConfig["Research Director"].color}`}>Research Director</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 border ${agentConfig["Research Director"].borderColor}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Research Director"].color} opacity-40 animate-bounce [animation-delay:-0.3s]`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Research Director"].color} opacity-70 animate-bounce [animation-delay:-0.15s]`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full bg-current ${agentConfig["Research Director"].color} animate-bounce`}></div>
                </div>
                <span className="text-xs text-muted-foreground">Processing market data...</span>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Phase Indicator */}
      {currentPhase && (
        <div className="mb-6 p-4 bg-muted/50 border rounded-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <div className="font-mono text-sm text-muted-foreground">Current Phase:</div>
              <div className="font-medium whitespace-pre-line">{currentPhase}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs - only show when we have content */}
      {discussion && (
        <div className="mb-6">
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-4 py-2 border-b-2 -mb-px transition-colors ${
                activeTab === 'discussion'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Discussion
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 border-b-2 -mb-px transition-colors ${
                activeTab === 'summary'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Final Summary
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ask Your Question</CardTitle>
          <CardDescription>
            The advisory board will conduct a multi-round discussion with research, presentations, and deliberation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., How can we improve customer retention?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !question.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Advisory Board Discussing... (30-60s)
              </>
            ) : (
              "Start Discussion"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {/* Discussion Tab */}
      {discussion && activeTab === 'discussion' && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Discussion Summary</CardTitle>
              <CardDescription>
                Question: {discussion.question}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">
                  {discussion.total_rounds} Rounds
                </Badge>
                <Badge variant="secondary">
                  {discussion.duration_seconds?.toFixed(1)}s
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Rounds */}
          {discussion.rounds.map((round) => (
            <Card key={round.round_number}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Round {round.round_number}: {round.round_type}
                  <Badge>
                    {round.round_type === "research" ? "📊 Research" :
                     round.round_type === "initial" ? "🎤 Presentations" :
                     "💬 Deliberation"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {round.messages.map((message, idx) => {
                    const config = agentConfig[message.agent as keyof typeof agentConfig];
                    const Icon = config?.icon;
                    return (
                      <div key={idx} className={`border rounded-lg p-4 ${config?.bgColor} ${config?.borderColor}`}>
                        <div className="flex items-center gap-2 mb-3">
                          {Icon && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor}`}>
                              <Icon className={`h-4 w-4 ${config.color}`} />
                            </div>
                          )}
                          <div className="flex-1">
                            <span className={`font-semibold text-sm ${config?.color}`}>{message.agent}</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {message.role}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Final Summary Tab */}
      {discussion && activeTab === 'summary' && discussion.final_report && (
        <div className="space-y-6">
          {/* High Level Overview Card */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Key Insights
                <Badge variant="default">Quick Overview</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sales Director Insight */}
                <div className={`${agentConfig["Sales Director"].bgColor} ${agentConfig["Sales Director"].borderColor} border rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`h-5 w-5 ${agentConfig["Sales Director"].color}`} />
                    <h4 className={`font-medium ${agentConfig["Sales Director"].color}`}>Sales Perspective</h4>
                  </div>
                  <p className="text-sm">
                    {discussion.final_report?.agent_perspectives["Sales Director"] || "Perspective not available."}
                  </p>
                </div>

                {/* Customer Success Insight */}
                <div className={`${agentConfig["Customer Success Director"].bgColor} ${agentConfig["Customer Success Director"].borderColor} border rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className={`h-5 w-5 ${agentConfig["Customer Success Director"].color}`} />
                    <h4 className={`font-medium ${agentConfig["Customer Success Director"].color}`}>Customer Success View</h4>
                  </div>
                  <p className="text-sm">
                    {discussion.final_report?.agent_perspectives["Customer Success Director"] || "Perspective not available."}
                  </p>
                </div>

                {/* Research Director Insight */}
                <div className={`${agentConfig["Research Director"].bgColor} ${agentConfig["Research Director"].borderColor} border rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className={`h-5 w-5 ${agentConfig["Research Director"].color}`} />
                    <h4 className={`font-medium ${agentConfig["Research Director"].color}`}>Research Analysis</h4>
                  </div>
                  <p className="text-sm">
                    {discussion.final_report?.agent_perspectives["Research Director"] || "Perspective not available."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Report Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Detailed Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="font-semibold mb-2">Full Summary</h3>
                <div 
                  className="text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: discussion.final_report.summary
                      .replace(/^# /gm, '<h1>')
                      .replace(/^## /gm, '<h2>')
                      .replace(/^### /gm, '<h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              </div>

              {/* Key Points */}
              {discussion.final_report.key_points.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {discussion.final_report.key_points.map((point, idx) => (
                      <li key={idx} className="text-sm prose prose-sm"
                        dangerouslySetInnerHTML={{
                          __html: point
                            .replace(/^# /gm, '<h1>')
                            .replace(/^## /gm, '<h2>')
                            .replace(/^### /gm, '<h3>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Agent Metrics */}
              {Object.keys(discussion.final_report.agent_metrics).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Agent Contributions</h3>
                  <div className="space-y-2">
                    {Object.entries(discussion.final_report.agent_metrics).map(([agent, metrics]) => (
                      <div key={agent} className="border-l-2 border-muted pl-3">
                        <span className="font-medium text-sm">{agent}:</span>
                        <p className="text-sm text-muted-foreground">{String(metrics)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                {/* Recommendations */}
                {discussion.final_report.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Recommendations</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {discussion.final_report.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm prose prose-sm"
                          dangerouslySetInnerHTML={{
                            __html: rec
                              .replace(/^# /gm, '<h1>')
                              .replace(/^## /gm, '<h2>')
                              .replace(/^### /gm, '<h3>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                      ))}
                    </ol>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}
        </>
      )}
    </div>
  );
}
