import type { Rubric, RubricCriterion } from "@/types/essay";

export const mockEssayRubricScore: Rubric = {
  criteria: [
    {
      id: "narrative_voice",
      title: "Narrative Voice & Authenticity",
      score: 4,
      strengths: [
        "Strong personal voice that feels genuine and authentic",
        "Effective use of first-person perspective throughout",
        "Consistent tone that matches the personal nature of the essay",
      ],
      areas_to_improve: ["Could include more specific personal anecdotes to strengthen voice"],
      why_score:
        "The essay maintains a consistent, authentic voice that effectively conveys the student's personality and experiences.",
    },
    {
      id: "reflection_insight",
      title: "Reflection & Insight",
      score: 5,
      strengths: [
        "Exceptional depth of reflection on experiences",
        "Clear connections between events and personal growth",
        "Sophisticated understanding of how challenges shaped character",
      ],
      areas_to_improve: [],
      why_score:
        "Demonstrates mature, thoughtful reflection that goes beyond surface-level storytelling to show genuine personal growth and self-awareness.",
    },
    {
      id: "structure_flow",
      title: "Structure & Flow",
      score: 4,
      strengths: [
        "Clear narrative arc with logical progression",
        "Effective transitions between ideas and experiences",
        "Strong opening and conclusion that bookend the essay well",
      ],
      areas_to_improve: ["Middle section could be more tightly organized around central themes"],
      why_score:
        "The essay flows well with a clear structure, though some sections could be more tightly integrated around central themes.",
    },
    {
      id: "specificity_detail",
      title: "Specificity & Detail",
      score: 3,
      strengths: [
        "Good use of specific examples and experiences",
        "Clear descriptions of key moments and decisions",
      ],
      areas_to_improve: [
        "Could include more sensory details and specific imagery",
        "Some experiences could be described with more vivid detail",
      ],
      why_score:
        "While the essay includes specific examples, it could benefit from more vivid, sensory details to make experiences more memorable.",
    },
    {
      id: "purpose_fit",
      title: "Purpose & Fit",
      score: 5,
      strengths: [
        "Clearly demonstrates why this student is a strong candidate",
        "Excellent alignment with the program's values and goals",
        "Shows genuine passion and commitment to the field",
      ],
      areas_to_improve: [],
      why_score:
        "Perfectly demonstrates the student's fit for the program with clear evidence of passion, preparation, and alignment with institutional values.",
    },
    {
      id: "mechanics_style",
      title: "Mechanics & Style",
      score: 4,
      strengths: [
        "Clean, professional writing style",
        "Good sentence variety and flow",
        "Appropriate vocabulary and tone for academic writing",
      ],
      areas_to_improve: [
        "A few minor grammatical issues could be addressed",
        "Some sentences could be more concise",
      ],
      why_score:
        "The writing is polished and professional with only minor mechanical issues that don't significantly impact readability.",
    },
  ],
  total_score: 25,
  band: "Strong",
};

export function getMockEssayRubricScore(): Rubric {
  return { ...mockEssayRubricScore };
}
