import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QUIZ } from "@/lib/agents";
import { useLearner } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Progress Tracking — SkillPilot AI" }, { name: "description", content: "Take assessments and track your performance over time." }, { property: "og:title", content: "Progress Tracking — SkillPilot AI" }, { property: "og:description", content: "Take assessments and track your performance over time." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const { assessments, addAssessment, result } = useLearner();
  const [ans, setAns] = useState<Record<number, number>>({});
  const submit = () => {
    const correct = QUIZ.questions.filter((q, i) => ans[i] === q.a).length;
    const score = Math.round((correct / QUIZ.questions.length) * 100);
    addAssessment({ id: crypto.randomUUID(), skill: QUIZ.skill, score, date: new Date().toLocaleDateString() });
    setAns({});
    if (score < 60) toast.warning(`Score ${score}% — roadmap adapted with refresher activities`);
    else toast.success(`Score ${score}% — JavaScript added to your skills!`);
  };
  return (
    <div>
      <PageHeader title="Progress Tracking" subtitle={`Progress Monitoring Agent · roadmap ${result.progress.pct}% complete`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card"><CardHeader><CardTitle>{QUIZ.skill} assessment</CardTitle></CardHeader><CardContent className="space-y-5">
          {QUIZ.questions.map((q, i) => (
            <div key={i}><p className="mb-2 font-medium">{i + 1}. {q.q}</p>
              <RadioGroup value={ans[i]?.toString() ?? ""} onValueChange={(v) => setAns({ ...ans, [i]: Number(v) })}>
                {q.options.map((o, j) => <div key={j} className="flex items-center gap-2"><RadioGroupItem value={String(j)} id={`q${i}-${j}`} /><Label htmlFor={`q${i}-${j}`}>{o}</Label></div>)}
              </RadioGroup>
            </div>
          ))}
          <Button className="w-full" disabled={Object.keys(ans).length < QUIZ.questions.length} onClick={submit}>Submit assessment</Button>
          <p className="text-xs text-muted-foreground">Tip: score below 60% to see the roadmap adapt.</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardHeader><CardTitle>Performance history</CardTitle></CardHeader><CardContent>
          {assessments.length === 0 ? <p className="text-muted-foreground">No assessments yet.</p> : (
            <>
              <div className="h-56"><ResponsiveContainer><LineChart data={assessments.map((a, i) => ({ n: `#${i + 1}`, score: a.score }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="n" /><YAxis domain={[0, 100]} /><Tooltip /><Line dataKey="score" stroke="var(--primary)" strokeWidth={3} />
              </LineChart></ResponsiveContainer></div>
              <div className="mt-4 space-y-2">{assessments.slice().reverse().map((a) => (
                <div key={a.id} className="flex justify-between rounded-lg border p-3 text-sm"><span>{a.skill} · {a.date}</span><span className={a.score < 60 ? "font-bold text-destructive" : "font-bold text-success"}>{a.score}%</span></div>
              ))}</div>
            </>
          )}
        </CardContent></Card>
      </div>
    </div>
  );
}
