// Rule-based agents. Each is a pure function so a real AI API can replace any one later.
export type Skill = { name: string; level: number };
export type Level = "beginner" | "intermediate" | "advanced";
export type RoadmapItem = { id: string; skill: string; level: Level; type: "Course" | "Tutorial" | "Exercise" | "Project"; title: string; remedial?: boolean };
export type Assessment = { id: string; skill: string; score: number; date: string };
export type Profile = { name: string; education: string; skills: Skill[]; certifications: string; projects: string; targetCareer: string };

export const CAREERS: Record<string, string[]> = {
  "Full Stack Developer": ["Python", "SQL", "HTML", "JavaScript", "React", "Node.js"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git"],
  "Backend Developer": ["Python", "SQL", "Node.js", "REST APIs", "Docker", "Git"],
  "Data Scientist": ["Python", "SQL", "Statistics", "Pandas", "Machine Learning", "Data Visualization"],
};

export const levelOf = (n: number) => (n >= 70 ? "strong" : n >= 50 ? "intermediate" : "weak");

// Profile Analysis Agent
export function profileAgent(p: Profile) {
  return { total: p.skills.length, avg: p.skills.length ? Math.round(p.skills.reduce((a, s) => a + s.level, 0) / p.skills.length) : 0 };
}

// Skill Gap Analysis Agent
export function skillGapAgent(p: Profile) {
  const req = CAREERS[p.targetCareer] ?? [];
  const has = new Map(p.skills.map((s) => [s.name.toLowerCase(), s]));
  return {
    strong: p.skills.filter((s) => levelOf(s.level) === "strong"),
    intermediate: p.skills.filter((s) => levelOf(s.level) === "intermediate"),
    weak: p.skills.filter((s) => levelOf(s.level) === "weak"),
    missing: req.filter((r) => !has.has(r.toLowerCase())),
  };
}

// Career Matching Agent: each required skill contributes its level (0 if missing).
export function careerMatchAgent(p: Profile, career = p.targetCareer) {
  const req = CAREERS[career] ?? [];
  const has = new Map(p.skills.map((s) => [s.name.toLowerCase(), s.level]));
  const score = req.length ? Math.round(req.reduce((a, r) => a + Math.min(100, has.get(r.toLowerCase()) ?? 0), 0) / req.length) : 0;
  return { career, score, missing: req.filter((r) => !has.has(r.toLowerCase())), matched: req.filter((r) => has.has(r.toLowerCase())) };
}

const TEMPLATES: Record<Level, { type: RoadmapItem["type"]; t: (s: string) => string }[]> = {
  beginner: [{ type: "Course", t: (s) => `${s} Fundamentals` }, { type: "Tutorial", t: (s) => `Hands-on ${s} basics walkthrough` }],
  intermediate: [{ type: "Exercise", t: (s) => `${s} practice problem set` }, { type: "Course", t: (s) => `Intermediate ${s} patterns` }],
  advanced: [{ type: "Project", t: (s) => `Build a portfolio project with ${s}` }],
};

// Learning Recommendation Agent
export function recommendationAgent(p: Profile, assessments: Assessment[]): RoadmapItem[] {
  const gap = skillGapAgent(p);
  const focus = [...gap.missing, ...gap.weak.map((s) => s.name)];
  const items: RoadmapItem[] = [];
  for (const skill of focus) {
    const poor = assessments.some((a) => a.skill === skill && a.score < 60);
    if (poor) items.push({ id: `${skill}-remedial`, skill, level: "beginner", type: "Tutorial", title: `${skill} refresher: revisit core concepts`, remedial: true });
    (Object.keys(TEMPLATES) as Level[]).forEach((lvl) =>
      TEMPLATES[lvl].forEach((tpl, i) => items.push({ id: `${skill}-${lvl}-${i}`, skill, level: lvl, type: tpl.type, title: tpl.t(skill) })),
    );
  }
  return items;
}

// Progress Monitoring Agent
export function progressAgent(items: RoadmapItem[], done: string[]) {
  const completed = items.filter((i) => done.includes(i.id)).length;
  return { completed, total: items.length, pct: items.length ? Math.round((completed / items.length) * 100) : 0 };
}

// AI Mentor Agent (rule-based demo responses)
export function mentorAgent(q: string, p: Profile): string {
  const t = q.toLowerCase();
  const gap = skillGapAgent(p);
  if (t.includes("react")) return "**React** is a JavaScript library for building UIs from reusable *components*. Learn JavaScript basics first, then JSX, props, state and hooks like `useState`.";
  if (t.includes("node")) return "**Node.js** runs JavaScript on the server. Start with modules and npm, then build a small REST API with Express.";
  if (t.includes("javascript") || t.includes("js")) return "**JavaScript** powers the web. Focus on variables, functions, arrays, objects, and async code (`fetch`, promises).";
  if (t.includes("next") || t.includes("start") || t.includes("what should")) return `Your next focus for **${p.targetCareer}**: ${gap.missing.slice(0, 3).join(", ") || "deepening your weak skills"}. Open the Roadmap and complete the beginner items first.`;
  if (t.includes("interview") || t.includes("job")) return "Build 2–3 portfolio projects, practise explaining your decisions, and review common questions for your target role.";
  return `I'm a demo mentor with built-in answers. Try asking about JavaScript, React, Node.js, interviews, or "what should I learn next?"`;
}

// Orchestrator: combines every agent into one view of the learner.
export function orchestrate(p: Profile, assessments: Assessment[], done: string[]) {
  const roadmap = recommendationAgent(p, assessments);
  return {
    profile: profileAgent(p),
    gap: skillGapAgent(p),
    match: careerMatchAgent(p),
    roadmap,
    progress: progressAgent(roadmap, done),
    adapted: roadmap.some((r) => r.remedial),
  };
}

export const DEMO_PROFILE: Profile = {
  name: "Alex",
  education: "B.Sc. Computer Science",
  skills: [{ name: "Python", level: 78 }, { name: "SQL", level: 60 }, { name: "HTML", level: 35 }],
  certifications: "Python for Everybody",
  projects: "Inventory tracker (Python + SQLite)",
  targetCareer: "Full Stack Developer",
};

export const QUIZ = {
  skill: "JavaScript",
  questions: [
    { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "def", "dim"], a: 1 },
    { q: "What does `[1,2,3].map(x => x*2)` return?", options: ["[2,4,6]", "6", "[1,2,3]", "undefined"], a: 0 },
    { q: "Which value is falsy?", options: ['"0"', "[]", "0", "{}"], a: 2 },
    { q: "What does `fetch()` return?", options: ["A string", "A Promise", "JSON", "An array"], a: 1 },
    { q: "`===` checks…", options: ["Value only", "Type only", "Value and type", "Reference only"], a: 2 },
  ],
};
