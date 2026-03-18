export type MatchType = "contains" | "startsWith" | "exact";
export type ActionType = "highlight" | "tooltip";

export interface Rule {
  id: number;
  keyword: string;
  matchType: MatchType;
  actionType: ActionType;
  color?: string | null;
  label?: string | null;
  isActive: 0 | 1;
  priority?: number;
  groupName?: string | null;
}

export type RuleDraft = Omit<Rule, "id">;

export const defaultRuleDraft: RuleDraft = {
  keyword: "",
  matchType: "contains",
  actionType: "highlight",
  color: "red",
  label: "IMPORTANT",
  isActive: 1,
  priority: 0,
  groupName: "General",
};