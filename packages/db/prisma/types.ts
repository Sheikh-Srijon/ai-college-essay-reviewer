import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { SubscriptionPlan, Status, EssayStatus, SuggestionStatus, SuggestionType, ChangeAction } from "./enums"; // Status imported for parity/expansion

/* ========= Tables ========= */

export type Customer = {
  id: Generated<number>;
  authUserId: string; // unique
  name: string | null;
  plan: SubscriptionPlan; // default: FREE (non-null)
  lifetimeActivatedAt: Timestamp | null;

  // Stripe fields (nullable for lifetime/one-time)
  stripeCustomerId: string | null; // unique
  stripeSubscriptionId: string | null; // unique
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Timestamp | null;

  createdAt: Generated<Timestamp>; // now()
  updatedAt: Generated<Timestamp>; // @updatedAt
};

export type Account = {
  id: Generated<string>; // uuid via gen_random_uuid()
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};

export type Session = {
  id: Generated<string>; // uuid
  sessionToken: string; // unique
  userId: string;
  expires: Timestamp;
};

export type User = {
  id: Generated<string>; // uuid
  name: string | null;
  email: string | null; // unique
  emailVerified: Timestamp | null;
  image: string | null;
};

export type VerificationToken = {
  identifier: string;
  token: string; // unique
  expires: Timestamp;
};

// New essay-related types
export type Essay = {
  id: Generated<string>; // uuid
  title: string;
  content: string;
  school: string | null;
  type: string;
  userId: string;
  wordCount: number;
  status: EssayStatus;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};

export type Suggestion = {
  id: Generated<string>; // uuid
  essayId: string;
  originalText: string;
  editedText: string;
  note: string | null;
  originalStart: number;
  originalEnd: number;
  currentStart: number;
  currentEnd: number;
  status: SuggestionStatus;
  type: SuggestionType;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};

export type ChangeRecord = {
  id: Generated<string>; // uuid
  essayId: string;
  suggestionId: string | null;
  action: ChangeAction;
  description: string;
  changeData: unknown | null; // Json type
  createdAt: Generated<Timestamp>;
};

export type RubricScore = {
  id: Generated<string>; // uuid
  essayId: string;
  overallScore: number;
  clarity: number;
  creativity: number;
  structure: number;
  voice: number;
  impact: number;
  areasToImprove: string[];
  whyScore: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};

export type MetaEssayFeedback = {
  id: Generated<string>; // uuid
  essayId: string;
  elevatorPitch: string;
  strengths: string[];
  weaknesses: string[];
  structure: string[];
  theme: string;
  strategy: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};

/* ========= Database ========= */

export type DB = {
  Customer: Customer;
  Account: Account;
  Session: Session;
  User: User;
  VerificationToken: VerificationToken;
  Essay: Essay;
  Suggestion: Suggestion;
  ChangeRecord: ChangeRecord;
  RubricScore: RubricScore;
  MetaEssayFeedback: MetaEssayFeedback;
};
