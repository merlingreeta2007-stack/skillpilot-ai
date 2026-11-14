import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CAREERS, careerMatchAgent } from "@/lib/agents";
import { useLearner } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/career")({
  head: () => ({ meta: [{ title: "Career Matching — SkillPilot AI" }, { name: "description", content: "Compare your skills with job roles and see your compatibility." }, { property: "og:title", content: "Career Matching — SkillPilot AI" }, { property: "og:description", content: "Compare your skills with job roles and see your compatibility." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: CareerPage,
});

function CareerPage() {
  const { profile, setProfile } = useLearner();
  const [sel, setSel] = useState(profile.targetCareer);
  const m = careerMatchAgent(profile, sel);
  return (
    <div>
      <PageHeader title="Career Matching" subtitle="Career Matching Agent · pick a role to compare" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.keys(CAREERS).map((c) => {
          const s = careerMatchAgent(profile, c).score;
          return (
            <button key={c} onClick={() => setSel(c)} className={`rounded-xl border bg-card p-4 text-left shadow-card transition ${sel === c ? "ring-2 ring-primary" : "hover:border-primary"}`}>
              <p className="font-semibold">{c}</p><p className="mt-1 text-2xl font-bold text-gradient">{s}%</p>
              {profile.targetCareer === c && <Badge className="mt-2" variant="secondary">Current goal</Badge>}
            </button>
          );
        })}
      </div>
      <Card className="mt-6 shadow-card"><CardHeader><CardTitle>{sel} — {m.score}% compatible</CardTitle></CardHeader><CardContent className="space-y-4">
        <Progress value={m.score} />
        <div><p className="mb-2 text-sm font-medium">Skills you have</p><div className="flex flex-wrap gap-2">{m.matched.map((s) => <Badge key={s} className="bg-success/15 text-success" variant="outline">{s}</Badge>)}</div></div>
        <div><p className="mb-2 text-sm font-medium">Missing skills</p><div className="flex flex-wrap gap-2">{m.missing.length ? m.missing.map((s) => <Badge key={s} className="bg-destructive/15 text-destructive" variant="outline">{s}</Badge>) : <span className="text-sm text-muted-foreground">None 🎉</span>}</div></div>
        {sel !== profile.targetCareer && <Button onClick={() => { setProfile({ ...profile, targetCareer: sel }); toast.success(`Goal set to ${sel} — roadmap regenerated`); }}>Set as my career goal</Button>}
      </CardContent></Card>
    </div>
  );
}
