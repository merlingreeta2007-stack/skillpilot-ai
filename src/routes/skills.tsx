import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLearner } from "@/lib/store";
import { levelOf } from "@/lib/agents";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/skills")({
  head: () => ({ meta: [{ title: "Skill Analysis — SkillPilot AI" }, { name: "description", content: "See your strong, intermediate, weak and missing skills." }, { property: "og:title", content: "Skill Analysis — SkillPilot AI" }, { property: "og:description", content: "See your strong, intermediate, weak and missing skills." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: SkillsPage,
});

const color = { strong: "var(--success)", intermediate: "var(--primary)", weak: "var(--warning)" };

function SkillsPage() {
  const { profile, result } = useLearner();
  const groups = [
    { t: "Strong", items: result.gap.strong.map((s) => s.name), c: "bg-success/15 text-success" },
    { t: "Intermediate", items: result.gap.intermediate.map((s) => s.name), c: "bg-primary/15 text-primary" },
    { t: "Weak", items: result.gap.weak.map((s) => s.name), c: "bg-warning/20 text-foreground" },
    { t: "Missing", items: result.gap.missing, c: "bg-destructive/15 text-destructive" },
  ];
  return (
    <div>
      <PageHeader title="Skill Analysis" subtitle={`Skill Gap Analysis Agent · compared against ${profile.targetCareer}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g) => (
          <Card key={g.t} className="shadow-card"><CardHeader className="pb-2"><CardTitle className="text-base">{g.t} ({g.items.length})</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">{g.items.length ? g.items.map((i) => <Badge key={i} className={g.c} variant="outline">{i}</Badge>) : <span className="text-sm text-muted-foreground">None</span>}</CardContent></Card>
        ))}
      </div>
      <Card className="mt-6 shadow-card"><CardHeader><CardTitle>Proficiency levels</CardTitle></CardHeader><CardContent className="h-72">
        <ResponsiveContainer><BarChart data={profile.skills}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" /><YAxis domain={[0, 100]} /><Tooltip />
          <Bar dataKey="level" radius={[6, 6, 0, 0]}>{profile.skills.map((s) => <Cell key={s.name} fill={color[levelOf(s.level)]} />)}</Bar>
        </BarChart></ResponsiveContainer>
      </CardContent></Card>
    </div>
  );
}
