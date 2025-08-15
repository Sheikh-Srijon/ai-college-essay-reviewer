import type { MetaEssayFeedback } from "@/types/essay";

export const mockMetaEssayFeedback: MetaEssayFeedback = {
  elevatorPitch:
    "You are an introverted student from a modest background who pushed past early rejection and a lack of extracurricular exposure to step into leadership roles, find your passion for technology, and set a mission to protect national data and boost economic growth through cybersecurity.",

  strengthsAndWeaknesses: {
    strengths: [
      "You do a great job showing a growth arc — from being hesitant to take initiative (I've…failure) to leading a graphics team, placing in the ELC competition, and competing in Olympiads (For…theEconomics).",
      "You consistently tie your achievements to a bigger purpose, especially your vision for fintech and cybersecurity (Although…Iam). This makes your story more than just a résumé recap; it's mission-driven.",
      "You also reveal versatility, touching tech, writing, leadership, and national service.",
    ],
    weaknesses: [
      "You start with exposition instead of immersion (I've…assets), which makes your hook feel like a summary rather than a moment we can see and feel.",
      "Some transitions are abrupt — for example, when you move from the IT club to your father's leadership (This…qualities), you don't stop to reflect on how his example directly shaped your own actions.",
      'Your tone sometimes shifts into casual territory ("yes, definitely,haha!" in Those…haha!), which undercuts the maturity of your other sections.',
      "The vision in your cybersecurity paragraph is compelling but leans on telling rather than showing — you state what you want to do without grounding it in something you've already started.",
      "And your ending, while thematically consistent, doesn't build to a peak emotional or forward-looking moment (Every…Titanium).",
    ],
  },

  structure: [
    "Para 1: Family values academics, you're introverted, early rejection from teacher shapes resilience. Effectiveness: Good context + obstacle, but could be more gripping if you opened with the rejection scene itself.",
    "Para 2: First breakthrough — IT club → passion for tech → ELC competition → leadership success. Effectiveness: Strong turning point, but it's achievement-heavy; slow down to let us feel one moment more vividly.",
    "Para 3: Your father's leadership record as inspiration. Effectiveness: This is important, but it feels detached from the arc — it could be woven into your leadership story.",
    "Para 4: Physics Olympiad setback → Economics Olympiad invite → interest in fintech/cybersecurity. Effectiveness: The pivot is exciting but underdeveloped; we jump too quickly from failure to mission without narrative bridge.",
    'Para 5: Vision for building a cybersecurity "fortress" to protect data, create jobs, and grow the economy. Effectiveness: Inspiring mission, but it\'s all future-oriented. Give the reader one "show" example of how you\'ve begun this journey.',
    "Para 6: More Olympiads, all-rounder metaphor, closing motto. Effectiveness: The motto is personal, but your ending would be stronger if it looked forward to your role in college.",
  ],

  themeStrategy: {
    mainTheme:
      "Resilience and mission-oriented growth from introversion to leadership in technology and national development",
    strategy:
      "Position yourself as a resilient, mission-oriented student with leadership potential in technology and national development, showing both adaptability (shifting from physics to economics to tech) and purpose (cybersecurity, unemployment)",
    effectiveness:
      "That's a strong combination. If you can make your hook more immersive, smooth your transitions, and close with a vision for how you'll bring these qualities to a college campus, you'll turn a solid personal statement into one that's truly memorable.",
  },
};

export function getMockMetaEssayFeedback(): MetaEssayFeedback {
  return { ...mockMetaEssayFeedback };
}
