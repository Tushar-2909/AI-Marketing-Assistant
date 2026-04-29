import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Activity, CheckCircle2, Target, Sparkles } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { StatCard } from "@/components/marketing/StatCard";
import { GoalInput } from "@/components/marketing/GoalInput";
import {
  AgentProgress,
  type Agent,
  type AgentStatus,
} from "@/components/marketing/AgentProgress";
import {
  ResultsDisplay,
  type StrategyResult,
} from "@/components/marketing/ResultsDisplay";
import { HistoryList, type HistoryItem } from "@/components/marketing/HistoryList";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const initialAgents: Agent[] = [
  {
    id: "planner",
    name: "Planner",
    description: "Maps strategy & milestones",
    status: "pending",
    progress: 0,
  },
  {
    id: "researcher",
    name: "Researcher",
    description: "Analyzes market & competitors",
    status: "pending",
    progress: 0,
  },
  {
    id: "executor",
    name: "Executor",
    description: "Compiles execution-ready plan",
    status: "pending",
    progress: 0,
  },
];

const sampleHistory: HistoryItem[] = [
  {
    id: "h1",
    goal: "Launch eco-friendly water bottle on Instagram",
    platform: "instagram",
    date: "2 days ago",
  },
  {
    id: "h2",
    goal: "Grow LinkedIn thought leadership for B2B SaaS",
    platform: "linkedin",
    date: "5 days ago",
  },
  {
    id: "h3",
    goal: "Drive holiday sales for online jewelry store",
    platform: "multi",
    date: "1 week ago",
  },
];

const buildResult = (goal: string, platform: string): StrategyResult => ({
  planning: [
    `Define the core objective: "${goal}" with measurable KPIs (reach, CTR, conversions).`,
    "Segment the target audience into 2-3 personas with motivations & pain points.",
    `Build a 4-week content calendar tailored to ${platform || "your core channels"}.`,
    "Allocate budget across paid, organic, and influencer touchpoints.",
    "Set up analytics dashboards to track weekly performance.",
  ],
  research: [
    {
      title: "Market Trend",
      insight:
        "Short-form video content drives 2.3x higher engagement than static posts in your category this quarter.",
    },
    {
      title: "Competitor Gap",
      insight:
        "Top 3 competitors under-invest in user-generated content - a clear opportunity to differentiate.",
    },
    {
      title: "Audience Insight",
      insight:
        "Your audience is most active 7-9 PM on weekdays; align posting and ad delivery to this window.",
    },
  ],
  execution: [
    {
      channel: "Content",
      action: "Publish 3 reels/week + 2 carousel posts featuring real customer stories.",
    },
    {
      channel: "Paid Ads",
      action: "Launch a 2-week awareness campaign with lookalike audiences (1-3% similarity).",
    },
    {
      channel: "Partnerships",
      action: "Activate 5 micro-influencers (10-50K followers) for authentic product seeding.",
    },
    {
      channel: "Measurement",
      action: "Weekly review of CTR, CPM and conversion rate; reallocate budget every Friday.",
    },
  ],
});

const Index = () => {
  const [section, setSection] = useState("home");
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(sampleHistory);
  const [tasksCompleted, setTasksCompleted] = useState(24);
  const [currentGoal, setCurrentGoal] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (id: string) => {
    setSection(id);
    if (id === "new") inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (id === "history") historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else if (id === "settings") toast("Settings coming soon?");
  };

  const runAgents = async (goal: string, platform: string) => {
    setLoading(true);
    setResult(null);
    setAgents(initialAgents.map((agent) => ({ ...agent })));

    const sequence: { id: Agent["id"]; status: AgentStatus; progress: number; delay: number }[] = [
      { id: "planner", status: "running", progress: 45, delay: 200 },
      { id: "planner", status: "completed", progress: 100, delay: 1100 },
      { id: "researcher", status: "running", progress: 40, delay: 1300 },
      { id: "researcher", status: "completed", progress: 100, delay: 2400 },
      { id: "executor", status: "running", progress: 50, delay: 2600 },
      { id: "executor", status: "completed", progress: 100, delay: 3700 },
    ];

    sequence.forEach((step) => {
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === step.id ? { ...agent, status: step.status, progress: step.progress } : agent,
          ),
        );
      }, step.delay);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/generate-strategy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `API error: ${response.status}`);
      }

      setTimeout(() => {
        setResult(data);
        setLoading(false);
        setTasksCompleted((count) => count + 3);
        toast.success("Strategy generated", {
          description: "Your AI marketing plan is ready to review.",
        });
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }, 3900);
    } catch (error) {
      console.error("Error generating strategy:", error);
      toast.error("Failed to generate strategy", {
        description: `Please ensure the backend server is running on ${API_BASE_URL}`,
      });
      setLoading(false);
      setAgents(initialAgents.map((agent) => ({ ...agent, status: "failed", progress: 0 })));
    }
  };

  const handleSubmit = (data: { goal: string }) => {
    setCurrentGoal(data.goal);
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      goal: data.goal,
      platform: "multi",
      date: "Just now",
    };
    setHistory((prev) => [item, ...prev]);
    runAgents(data.goal, "");
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(buildResult(item.goal, item.platform));
    setAgents(initialAgents.map((agent) => ({ ...agent, status: "completed", progress: 100 })));
    toast(`Loaded: ${item.goal}`);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-strategy-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: currentGoal }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `API error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const date = new Date().toISOString().split("T")[0];
      anchor.download = `marketing_plan_${date}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF", {
        description: `Please ensure the backend server is running on ${API_BASE_URL}`,
      });
    }
  };

  useEffect(() => {
    document.title = "AI Marketing Assistant - Plan, Research & Execute";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar active={section} onNavigate={handleNavigate} />

      <main className="container space-y-10 py-8 md:py-12">
        <section className="animate-fade-in-up space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by autonomous AI agents
          </div>
          <div className="max-w-3xl space-y-3">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              AI Marketing <span className="text-gradient">Assistant</span>
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Plan, research and execute high-impact marketing campaigns from a single goal.
              Three specialized AI agents collaborate to deliver a strategy you can ship today.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Activity}
            label="Campaign Status"
            value="3 Active"
            trend="+1 this week"
            accent="primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="Tasks Completed"
            value={String(tasksCompleted)}
            trend="+12% vs last week"
            accent="success"
          />
          <StatCard
            icon={Target}
            label="Active Goals"
            value="5"
            trend="2 nearing completion"
            accent="accent"
          />
        </section>

        <section ref={inputRef} className="scroll-mt-24">
          <GoalInput onSubmit={handleSubmit} loading={loading} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <AgentProgress agents={agents} />
          <div ref={resultsRef} className="scroll-mt-24">
            {loading || result ? (
              <ResultsDisplay
                result={result}
                loading={loading}
                goal={currentGoal}
                onDownloadPDF={downloadPDF}
              />
            ) : (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/40 p-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold">Your strategy will appear here</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Enter a marketing goal above and let the agents generate a complete plan.
                </p>
              </div>
            )}
          </div>
        </section>

        <section ref={historyRef} className="scroll-mt-24 pb-12">
          <HistoryList items={history} onSelect={handleSelectHistory} />
        </section>
      </main>

      <footer className="border-t border-border/60 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MarketrAI · Crafted for modern marketing teams
        </div>
      </footer>
    </div>
  );
};

export default Index;
