import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Rocket, Check, Loader2, Clock } from "lucide-react";

export type AgentStatus = "pending" | "running" | "completed" | "failed";

export interface Agent {
  id: "planner" | "researcher" | "executor";
  name: string;
  description: string;
  status: AgentStatus;
  progress: number;
}

const iconMap = {
  planner: Brain,
  researcher: Search,
  executor: Rocket,
};

const statusConfig: Record<AgentStatus, { label: string; className: string; icon: typeof Check }> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-transparent",
    icon: Clock,
  },
  running: {
    label: "Running",
    className: "bg-accent/15 text-accent border-accent/20",
    icon: Loader2,
  },
  completed: {
    label: "Completed",
    className: "bg-success/15 text-success border-success/20",
    icon: Check,
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    icon: Clock,
  },
};

export const AgentProgress = ({ agents }: { agents: Agent[] }) => {
  return (
    <Card className="border-border/60 bg-gradient-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight">Agent Progress</h3>
          <p className="text-sm text-muted-foreground">Live status of your AI marketing team</p>
        </div>
      </div>

      <div className="space-y-5">
        {agents.map((agent) => {
          const Icon = iconMap[agent.id];
          const status = statusConfig[agent.status];
          const StatusIcon = status.icon;

          return (
            <div key={agent.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-smooth ${
                      agent.status === "running"
                        ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                        : agent.status === "completed"
                          ? "bg-success/15 text-success"
                          : agent.status === "failed"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`gap-1 ${status.className}`}>
                  <StatusIcon
                    className={`h-3 w-3 ${agent.status === "running" ? "animate-spin" : ""}`}
                  />
                  {status.label}
                </Badge>
              </div>
              <Progress value={agent.progress} className="h-1.5" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
