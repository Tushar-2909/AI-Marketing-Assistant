import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Search, Rocket, ListChecks, Download, Loader2 } from "lucide-react";
import { useState } from "react";

export interface StrategyResult {
  planning: string[];
  research: { title: string; insight: string }[];
  execution: { channel: string; action: string }[];
}

interface ResultsProps {
  result: StrategyResult | null;
  loading: boolean;
  goal?: string;
  onDownloadPDF?: () => Promise<void>;
}

const SkeletonLine = ({ width = "100%" }: { width?: string }) => (
  <div
    className="h-3 animate-pulse-soft rounded-full bg-muted"
    style={{ width }}
  />
);

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  tone,
}: {
  icon: typeof Brain;
  title: string;
  subtitle: string;
  tone: "primary" | "accent" | "success";
}) => {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
  };
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-display text-base font-bold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export const ResultsDisplay = ({ result, loading, goal, onDownloadPDF }: ResultsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!onDownloadPDF) return;
    setIsDownloading(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!loading && !result) return null;

  return (
    <div className="space-y-4">
      {!loading && result && (
        <div className="flex justify-end">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isDownloading ? "Generating PDF..." : "Download as PDF"}
          </Button>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
      {/* Planning */}
      <Card className="animate-fade-in-up border-border/60 bg-gradient-card p-6 shadow-sm">
        <SectionHeader
          icon={Brain}
          title="Planning"
          subtitle="Step-by-step strategy"
          tone="primary"
        />
        {loading || !result ? (
          <div className="space-y-3">
            <SkeletonLine width="90%" />
            <SkeletonLine width="75%" />
            <SkeletonLine width="85%" />
            <SkeletonLine width="60%" />
          </div>
        ) : (
          <ol className="space-y-3">
            {result.planning.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </Card>

      {/* Research */}
      <Card
        className="animate-fade-in-up border-border/60 bg-gradient-card p-6 shadow-sm"
        style={{ animationDelay: "100ms" }}
      >
        <SectionHeader
          icon={Search}
          title="Research"
          subtitle="Market & competitor insights"
          tone="accent"
        />
        {loading || !result ? (
          <div className="space-y-3">
            <SkeletonLine width="80%" />
            <SkeletonLine width="95%" />
            <SkeletonLine width="70%" />
            <SkeletonLine width="88%" />
          </div>
        ) : (
          <ul className="space-y-3">
            {result.research.map((item, i) => (
              <li key={i} className="rounded-lg border border-border/60 bg-background/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-foreground/90">{item.insight}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Execution */}
      <Card
        className="animate-fade-in-up border-border/60 bg-gradient-card p-6 shadow-sm"
        style={{ animationDelay: "200ms" }}
      >
        <SectionHeader
          icon={Rocket}
          title="Execution"
          subtitle="Final marketing plan"
          tone="success"
        />
        {loading || !result ? (
          <div className="space-y-3">
            <SkeletonLine width="92%" />
            <SkeletonLine width="78%" />
            <SkeletonLine width="85%" />
            <SkeletonLine width="65%" />
          </div>
        ) : (
          <ul className="space-y-3">
            {result.execution.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 p-3"
              >
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-success">
                    {item.channel}
                  </p>
                  <p className="text-sm text-foreground/90">{item.action}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      </div>
    </div>
  );
};
