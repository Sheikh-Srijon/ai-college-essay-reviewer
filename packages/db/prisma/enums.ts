export const SubscriptionPlan = {
  FREE: "FREE",
  MONTHLY: "MONTHLY",
  ANNUAL: "ANNUAL",
  LIFETIME: "LIFETIME",
} as const;

export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export const Status = {
  PENDING: "PENDING",
  CREATING: "CREATING",
  INITING: "INITING",
  RUNNING: "RUNNING",
  STOPPED: "STOPPED",
  DELETED: "DELETED",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
