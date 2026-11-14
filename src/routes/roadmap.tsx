import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLearner } from "@/lib/store";
import type { Level } from "@/lib/agents";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "Learning Roadmap — SkillPilot AI" }, { name: "description", content: "Your step-by-step personalised plan from beginner to advanced." }, { property: "og:title", content: "Learning Roadmap — SkillPilot AI" }, { property: "og:description", content: "Your step-by-step personalised plan from beginner to advanced." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: RoadmapPage,
});

const levels: Level[] = ["beginner", "intermediate", "advanced"];

function RoadmapPage() {
  const { profile, result, done, toggleDone } = useLearner();
  return (
    <div>
      <PageHeader title="Personalized Learning Roadmap" subtitle={`Learning Recommendation Agent · path to ${profile.targetCareer}`} />
      <Card className="mb-6 shadow-card"><CardContent className="p-5"><div className="mb-2 flex justify-between text-sm"><span>Overall progress</span><span>{result.progress.completed}/{result.progress.total}</span></div><Progress value={result.progress.pct} /></CardContent></Card>
      <div className="grid gap-4 lg:grid-cols-3">
        {levels.map((lvl, idx) => (
          <Card key={lvl} className="shadow-card"><CardHeader><CardTitle className="capitalize">Step {idx + 1} · {lvl}</CardTitle></CardHeader><CardContent className="space-y-2">
            {result.roadmap.filter((r) => r.level === lvl).map((r) => (
              <label key={r.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${r.remedial ? "border-warning bg-warning/10" : ""}`}>
                <Checkbox checked={done.includes(r.id)} onCheckedChange={() => toggleDone(r.id)} className="mt-0.5" />
                <div className={done.includes(r.id) ? "line-through opacity-60" : ""}>
                  <p className="text-sm font-medium">{r.title}</p>
                  <div className="mt-1 flex gap-1"><Badge variant="secondary">{r.type}</Badge><Badge variant="outline">{r.skill}</Badge>{r.remedial && <Badge className="bg-warning text-foreground">Adapted</Badge>}</div>
                </div>
              </label>
            ))}
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
