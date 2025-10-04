import { AnalysisOutput } from "@/api/backendClient";

type Priority = "Now" | "Next" | "Later";

const badgeStyles: Record<Priority, string> = {
  Now: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Next: "bg-sky-100 text-sky-800 border-sky-200",
  Later: "bg-slate-100 text-slate-600 border-slate-200",
};

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeStyles[priority]}`}>
      {priority}
    </span>
  );
}

interface ActionPlanDashboardProps {
  data: AnalysisOutput;
}

export function ActionPlanDashboard({ data }: ActionPlanDashboardProps) {
  const tasksByPriority = {
    Now: data.action_plan.filter((task) => task.priority === "Now"),
    Next: data.action_plan.filter((task) => task.priority === "Next"),
    Later: data.action_plan.filter((task) => task.priority === "Later"),
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-gray-900">Strategic Consensus</h3>
        <p className="mt-2 text-sm text-gray-600">{data.consensus}</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900">Prioritized Action Plan</h3>
        <div className="mt-4 space-y-6">
          {(["Now", "Next", "Later"] as Priority[]).map((priority) => (
            <div key={priority}>
              <h4 className="font-semibold text-gray-800 mb-2">
                {priority === "Now" && "Focus Now"}
                {priority === "Next" && "Plan for Next"}
                {priority === "Later" && "Consider Later"}
              </h4>
              <div className="space-y-3">
                {tasksByPriority[priority].length === 0 ? (
                  <p className="text-sm text-gray-500">No tasks tagged for this bucket.</p>
                ) : (
                  tasksByPriority[priority].map((task, index) => (
                    <div
                      key={`${priority}-${index}`}
                      className={`rounded-lg border p-4 ${priority === "Later" ? "bg-gray-50" : "bg-white"}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{task.reasoning}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
