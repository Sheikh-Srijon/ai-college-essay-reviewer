// Essay-related interfaces and types

export interface Essay {
  id: string;
  title: string;
  school: string;
  type: string; //supplemental or personal_statement
  text?: string; // The actual essay content
  version?: number;
}

export interface RawSuggestion {
  id: string;
  originalText: string;
  editedText: string;
  note?: string;
}

export interface SuggestionWithPosition {
  id: string;
  originalText: string;
  editedText: string;
  note?: string;
  anchor: {
    start: number;
    end: number;
  };
}

export interface AnchoredSuggestion {
  id: string;
  originalText: string;
  editedText: string;
  note?: string;
  status: "open" | "approved" | "rejected" | "stale";
  originalStart: number;
  originalEnd: number;
  currentStart: number;
  currentEnd: number;
}

// Backend feedback interface
export interface MetaEssayFeedback {
  elevatorPitch: string;
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  structure: string[]; // Array of paragraph comments
  themeStrategy: {
    mainTheme: string;
    strategy: string;
    effectiveness: string;
  };
}

// API response interfaces
export interface EssayFeedbackResponse {
  essayId: string;
  feedback: MetaEssayFeedback;
  timestamp: string;
  version: number;
}

// Change history for undo/redo
export interface ChangeRecord {
  id: string;
  essayId: string;
  sessionId: string;
  type: "approve" | "reject";
  suggestionId: string;
  change: unknown; // CodeMirror ChangeDesc - using unknown instead of any
  timestamp: Date;
  order: number;
}

export interface RubricCriterion {
  id:
    | "narrative_voice"
    | "reflection_insight"
    | "structure_flow"
    | "specificity_detail"
    | "purpose_fit"
    | "mechanics_style";
  title: string;
  score: number; // 0–5
  strengths: string[];
  areas_to_improve?: string[];
  why_score?: string;
}

export interface Rubric {
  criteria: [
    RubricCriterion, // narrative_voice
    RubricCriterion, // reflection_insight
    RubricCriterion, // structure_flow
    RubricCriterion, // specificity_detail
    RubricCriterion, // purpose_fit
    RubricCriterion, // mechanics_style
  ];
  total_score: number; // 0–30
  band: "Needs Work" | "Solid" | "Strong" | "Exceptional";
}
