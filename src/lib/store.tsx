import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO_PROFILE, orchestrate, type Assessment, type Profile } from "./agents";

type State = { profile: Profile; assessments: Assessment[]; done: string[] };
const initial: State = { profile: DEMO_PROFILE, assessments: [], done: [] };
const KEY = "skillpilot-state";

function useLearnerState() {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setState(JSON.parse(raw)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(state)); }, [state, loaded]);
  const result = useMemo(() => orchestrate(state.profile, state.assessments, state.done), [state]);
  return {
    ...state, result,
    setProfile: (profile: Profile) => setState((s) => ({ ...s, profile })),
    toggleDone: (id: string) => setState((s) => ({ ...s, done: s.done.includes(id) ? s.done.filter((d) => d !== id) : [...s.done, id] })),
    addAssessment: (a: Assessment) => setState((s) => {
      // Passing (>=60) adds the skill to the profile at the scored level.
      const skills = s.profile.skills.filter((x) => x.name !== a.skill);
      if (a.score >= 60) skills.push({ name: a.skill, level: a.score });
      return { ...s, assessments: [...s.assessments, a], profile: { ...s.profile, skills } };
    }),
    reset: () => setState(initial),
  };
}

const Ctx = createContext<ReturnType<typeof useLearnerState> | null>(null);
export function LearnerProvider({ children }: { children: ReactNode }) {
  const v = useLearnerState();
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export function useLearner() { const v = useContext(Ctx); if (!v) throw new Error("no provider"); return v; }
