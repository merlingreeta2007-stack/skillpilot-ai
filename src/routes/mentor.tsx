import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mentorAgent } from "@/lib/agents";
import { useLearner } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor — SkillPilot AI" }, { name: "description", content: "Ask career and learning questions to your mentor." }, { property: "og:title", content: "AI Mentor — SkillPilot AI" }, { property: "og:description", content: "Ask career and learning questions to your mentor." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: MentorPage,
});

type Msg = { role: "user" | "mentor"; text: string };
const suggestions = ["What should I learn next?", "Explain React", "How do I start with Node.js?", "Interview tips"];

function MentorPage() {
  const { profile } = useLearner();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "mentor", text: `Hi ${profile.name}! I'm your mentor. Ask me about your path to **${profile.targetCareer}**.` }]);
  const [q, setQ] = useState("");
  const send = (text: string) => { if (!text.trim()) return; setMsgs((m) => [...m, { role: "user", text }, { role: "mentor", text: mentorAgent(text, profile) }]); setQ(""); };
  return (
    <div className="max-w-3xl">
      <PageHeader title="AI Mentor" subtitle="Demo mode: built-in answers. Ready to connect a real AI model later." />
      <Card className="shadow-card"><CardContent className="flex h-[60vh] flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => m.role === "user" ? (
            <div key={i} className="ml-auto max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground">{m.text}</div>
          ) : (
            <div key={i} className="flex max-w-[85%] gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-primary-foreground"><Compass className="h-4 w-4" /></div><div className="prose prose-sm pt-1"><ReactMarkdown>{m.text}</ReactMarkdown></div></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 px-5">{suggestions.map((s) => <Button key={s} size="sm" variant="outline" onClick={() => send(s)}>{s}</Button>)}</div>
        <form className="flex gap-2 p-5" onSubmit={(e) => { e.preventDefault(); send(q); }}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask your mentor…" /><Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
        </form>
      </CardContent></Card>
    </div>
  );
}
