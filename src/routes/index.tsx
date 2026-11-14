import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, Target, BookCheck, Layers, AlertTriangle } from "lucide-react";
import { useLearner } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — SkillPilot AI" }, { name: "description", content: "Your skills, career readiness and next learning steps at a glance." }, { property: "og:title", content: "Dashboard — SkillPilot AI" }, { property: "og:description", content: "Your skills, career readiness and next learning steps at a glance." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, result, done } = useLearner();
  const next = result.roadmap.filter((r) => !done.includes(r.id)).slice(0, 4);
  const stats = [
    { label: "Skills identified", value: result.profile.total, icon: Layers },
    { label: "Career readiness", value: result.match.score + "%", icon: Target },
    { label: "Learning progress", value: result.progress.pct + "%", icon: Brain },
    { label: "Completed activities", value: result.progress.completed, icon: BookCheck },
  ];
  return (
    <div>
      <div className="mb-8 rounded-2xl bg-gradient-brand p-6 text-primary-foreground shadow-card md:p-8">
        <p className="text-sm opacity-80">Welcome back</p>
        <h1 className="font-display text-3xl font-bold">Hi {profile.name} 👋</h1>
        <p className="mt-2 max-w-xl opacity-90">Target career: <b>{profile.targetCareer}</b>. You're {result.match.score}% ready — {result.gap.missing.length} skills to go.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card"><CardContent className="flex items-center gap-4 p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground"><s.icon className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>
      {result.adapted && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-warning bg-warning/10 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 text-warning" /> Your roadmap was adapted after a low assessment score — refresher activities were added.
        </div>
      )}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card"><CardHeader><CardTitle>Recommended next activities</CardTitle></CardHeader><CardContent className="space-y-3">
          {next.length === 0 && <p className="text-muted-foreground">All caught up! 🎉</p>}
          {next.map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-lg border p-3">
              <div><p className="font-medium">{n.title}</p><p className="text-xs text-muted-foreground">{n.type} · {n.level}</p></div>
            </div>
          ))}
          <Button asChild className="w-full"><Link to="/roadmap">Open roadmap</Link></Button>
        </CardContent></Card>
        <Card className="shadow-card"><CardHeader><CardTitle>Career readiness</CardTitle></CardHeader><CardContent className="space-y-4">
          <Progress value={result.match.score} />
          <p className="text-sm text-muted-foreground">Missing: {result.gap.missing.join(", ") || "none"}</p>
          <div className="flex gap-2"><Button asChild variant="outline"><Link to="/progress">Take assessment</Link></Button><Button asChild variant="outline"><Link to="/mentor">Ask mentor</Link></Button></div>
        </CardContent></Card>
      </div>
    </div>
  );
}
