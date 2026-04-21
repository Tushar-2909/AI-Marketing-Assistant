import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

interface GoalInputProps {
  onSubmit: (data: { goal: string }) => void;
  loading: boolean;
}

export const GoalInput = ({ onSubmit, loading }: GoalInputProps) => {
  const [goal, setGoal] = useState("");

  const handleSubmit = () => {
    if (!goal.trim()) return;
    onSubmit({ goal });
  };

  return (
    <Card className="relative overflow-hidden border-border/60 bg-gradient-card p-6 shadow-elegant md:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Define your marketing goal
          </h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal" className="text-sm font-medium">
            What do you want to achieve?
          </Label>
          <Textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter your marketing goal (e.g., launch a new product, increase Instagram engagement)"
            className="min-h-[120px] resize-none border-border/80 bg-background/60 text-base leading-relaxed transition-smooth focus-visible:ring-primary/30"
          />
        </div>

        <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-2 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            Our agents plan, research and execute your campaign in seconds.
          </p>
          <Button
            variant="hero"
            size="lg"
            onClick={handleSubmit}
            disabled={loading || !goal.trim()}
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Strategy
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
