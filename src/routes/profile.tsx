import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAREERS, type Profile } from "@/lib/agents";
import { useLearner } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Learner Profile — SkillPilot AI" }, { name: "description", content: "Enter your education, skills, certifications, projects and target career." }, { property: "og:title", content: "Learner Profile — SkillPilot AI" }, { property: "og:description", content: "Enter your education, skills, certifications, projects and target career." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, setProfile, reset } = useLearner();
  const [p, setP] = useState<Profile>(profile);
  const [newSkill, setNewSkill] = useState("");
  useEffect(() => setP(profile), [profile]);
  const f = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value });
  return (
    <div className="max-w-3xl">
      <PageHeader title="Learner Profile" subtitle="The Profile Analysis Agent uses this to personalise everything." />
      <Card className="shadow-card"><CardContent className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Name</Label><Input value={p.name} onChange={f("name")} /></div>
          <div className="space-y-2"><Label>Education</Label><Input value={p.education} onChange={f("education")} /></div>
        </div>
        <div className="space-y-2"><Label>Target career</Label>
          <Select value={p.targetCareer} onValueChange={(v) => setP({ ...p, targetCareer: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(CAREERS).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-3"><Label>Technical skills & proficiency</Label>
          {p.skills.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-28 text-sm font-medium">{s.name}</span>
              <Slider value={[s.level]} max={100} step={5} className="flex-1" onValueChange={([v]) => setP({ ...p, skills: p.skills.map((x, j) => (j === i ? { ...x, level: v } : x)) })} />
              <span className="w-10 text-right text-sm">{s.level}</span>
              <Button size="icon" variant="ghost" onClick={() => setP({ ...p, skills: p.skills.filter((_, j) => j !== i) })}><X className="h-4 w-4" /></Button>
            </div>
          ))}
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const n = newSkill.trim(); if (n && !p.skills.some((s) => s.name.toLowerCase() === n.toLowerCase())) setP({ ...p, skills: [...p.skills, { name: n, level: 40 }] }); setNewSkill(""); }}>
            <Input placeholder="Add a skill, e.g. JavaScript" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} /><Button type="submit" variant="secondary">Add</Button>
          </form>
        </div>
        <div className="space-y-2"><Label>Certifications</Label><Textarea value={p.certifications} onChange={f("certifications")} /></div>
        <div className="space-y-2"><Label>Projects</Label><Textarea value={p.projects} onChange={f("projects")} /></div>
        <div className="flex gap-2">
          <Button onClick={() => { setProfile(p); toast.success("Profile saved — analysis and roadmap updated"); }}>Save & re-analyse</Button>
          <Button variant="outline" onClick={() => { reset(); toast("Demo data restored"); }}>Reset demo</Button>
        </div>
      </CardContent></Card>
    </div>
  );
}
