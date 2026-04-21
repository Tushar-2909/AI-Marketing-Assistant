import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight, History as HistoryIcon } from "lucide-react";

export interface HistoryItem {
  id: string;
  goal: string;
  platform: string;
  date: string;
}

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryList = ({ items, onSelect }: HistoryListProps) => {
  return (
    <Card className="border-border/60 bg-gradient-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HistoryIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight">Recent Strategies</h3>
          <p className="text-sm text-muted-foreground">Click an item to view results again</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No strategies yet - generate your first one above.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-4 text-left transition-smooth hover:border-primary/30 hover:bg-background hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.goal}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.date}
                    {item.platform && (
                      <>
                        <span>·</span>
                        <Badge
                          variant="secondary"
                          className="rounded-md px-1.5 py-0 text-[10px] font-medium capitalize"
                        >
                          {item.platform}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-smooth group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
