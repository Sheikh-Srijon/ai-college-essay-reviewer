export const SubscriptionPlan = {
    FREE: "FREE",
    MONTHLY: "MONTHLY",
    ANNUAL: "ANNUAL",
    LIFETIME: "LIFETIME"
} as const;
export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];
export const Status = {
    PENDING: "PENDING",
    CREATING: "CREATING",
    INITING: "INITING",
    RUNNING: "RUNNING",
    STOPPED: "STOPPED",
    DELETED: "DELETED"
} as const;
export type Status = (typeof Status)[keyof typeof Status];
export const EssayStatus = {
    DRAFT: "DRAFT",
    SUBMITTED: "SUBMITTED",
    REVIEWED: "REVIEWED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
} as const;
export type EssayStatus = (typeof EssayStatus)[keyof typeof EssayStatus];
export const SuggestionStatus = {
    OPEN: "OPEN",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    APPLIED: "APPLIED"
} as const;
export type SuggestionStatus = (typeof SuggestionStatus)[keyof typeof SuggestionStatus];
export const SuggestionType = {
    GRAMMAR: "GRAMMAR",
    STYLE: "STYLE",
    CONTENT: "CONTENT",
    STRUCTURE: "STRUCTURE",
    CLARITY: "CLARITY",
    TONE: "TONE"
} as const;
export type SuggestionType = (typeof SuggestionType)[keyof typeof SuggestionType];
export const ChangeAction = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    APPROVE: "APPROVE",
    REJECT: "REJECT",
    APPLY: "APPLY"
} as const;
export type ChangeAction = (typeof ChangeAction)[keyof typeof ChangeAction];
