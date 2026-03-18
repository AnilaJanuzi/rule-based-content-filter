// Matching strategies
export type MatchType = "contains" | "startsWith" | "exact";

// Rule actions
export type ActionType = "highlight" | "tooltip";

// Rule entity
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

// Input model (no id)
export type RuleDraft = Omit<Rule, "id">;

// Defaults
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