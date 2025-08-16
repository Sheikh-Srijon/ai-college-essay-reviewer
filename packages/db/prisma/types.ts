import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { SubscriptionPlan, Status, EssayStatus, SuggestionStatus, SuggestionType, ChangeAction } from "./enums";

export type Account = {
    id: Generated<string>;
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
export type ChangeRecord = {
    id: Generated<string>;
    essayId: string;
    suggestionId: string | null;
    action: ChangeAction;
    description: string;
    changeData: unknown | null;
    createdAt: Generated<Timestamp>;
};
export type Customer = {
    id: Generated<number>;
    authUserId: string;
    name: string | null;
    plan: Generated<SubscriptionPlan>;
    lifetimeActivatedAt: Timestamp | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Timestamp | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Essay = {
    id: Generated<string>;
    title: string;
    content: string;
    school: string | null;
    type: string;
    userId: string;
    wordCount: Generated<number>;
    status: Generated<EssayStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type MetaEssayFeedback = {
    id: Generated<string>;
    essayId: string;
    elevatorPitch: string;
    strengths: string[];
    weaknesses: string[];
    structure: string[];
    theme: string;
    strategy: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RubricScore = {
    id: Generated<string>;
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
    updatedAt: Timestamp;
};
export type Session = {
    id: Generated<string>;
    sessionToken: string;
    userId: string;
    expires: Timestamp;
};
export type Suggestion = {
    id: Generated<string>;
    essayId: string;
    originalText: string;
    editedText: string;
    note: string | null;
    originalStart: number;
    originalEnd: number;
    currentStart: number;
    currentEnd: number;
    status: Generated<SuggestionStatus>;
    type: SuggestionType;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = {
    id: Generated<string>;
    name: string | null;
    email: string | null;
    emailVerified: Timestamp | null;
    image: string | null;
};
export type VerificationToken = {
    identifier: string;
    token: string;
    expires: Timestamp;
};
export type DB = {
    Account: Account;
    ChangeRecord: ChangeRecord;
    Customer: Customer;
    Essay: Essay;
    MetaEssayFeedback: MetaEssayFeedback;
    RubricScore: RubricScore;
    Session: Session;
    Suggestion: Suggestion;
    User: User;
    VerificationToken: VerificationToken;
};
