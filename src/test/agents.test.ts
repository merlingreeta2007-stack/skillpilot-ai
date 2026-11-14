import { describe, it, expect } from "vitest";
import { DEMO_PROFILE, careerMatchAgent, recommendationAgent, skillGapAgent } from "@/lib/agents";

describe("agents", () => {
  it("Alex is missing JavaScript, React and Node.js for Full Stack", () => {
    expect(skillGapAgent(DEMO_PROFILE).missing).toEqual(["JavaScript", "React", "Node.js"]);
  });
  it("poor assessment (<60) adds a refresher item", () => {
    const items = recommendationAgent(DEMO_PROFILE, [{ id: "1", skill: "JavaScript", score: 40, date: "" }]);
    expect(items.some((i) => i.remedial && i.skill === "JavaScript")).toBe(true);
    expect(recommendationAgent(DEMO_PROFILE, []).some((i) => i.remedial)).toBe(false);
  });
  it("career score averages required skill levels", () => {
    expect(careerMatchAgent(DEMO_PROFILE).score).toBe(Math.round((78 + 60 + 35) / 6));
  });
});
