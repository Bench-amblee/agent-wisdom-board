import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { askAdvisoryBoard, type BoardDiscussion } from "@/api/backendClient";

export function AdvisoryBoardDemo() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [discussion, setDiscussion] = useState<BoardDiscussion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setDiscussion(null);

    try {
      const result = await askAdvisoryBoard(question, true);
      setDiscussion(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Advisory Board</h1>
        <p className="text-muted-foreground">
          Ask a question and get insights from Sales, Customer Success, and Research directors
        </p>
      </div>

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
      {discussion && (
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
              <CardContent className="space-y-4">
                {round.messages.map((message, idx) => (
                  <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{message.agent}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Final Report */}
          {discussion.final_report && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📝 Final Report
                  <Badge variant="default">Executive Summary</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {discussion.final_report.summary}
                  </p>
                </div>

                {/* Key Points */}
                {discussion.final_report.key_points.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Key Points</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {discussion.final_report.key_points.map((point, idx) => (
                        <li key={idx} className="text-sm">{point}</li>
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
                        <li key={idx} className="text-sm">{rec}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
