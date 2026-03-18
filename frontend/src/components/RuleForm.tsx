import type { ActionType, MatchType, RuleDraft } from "../types/rule";

interface RuleFormProps {
  form: RuleDraft;
  setForm: (next: RuleDraft) => void;
  onSave: () => void;
  mode: "add" | "edit";
}

// Functional component for creating/updating a rule
const RuleForm = ({ form, setForm, onSave, mode }: RuleFormProps) => {
  const isKeywordEmpty = !form.keyword.trim();
  const priorityValue = Number.isFinite(form.priority)
    ? Number(form.priority)
    : 0;

    // Helper function to update priority with validation
  const updatePriority = (value: number) => {
    const normalized = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    setForm({ ...form, priority: normalized });
  };

  const stepPriority = (delta: number) => {
    updatePriority(priorityValue + delta);
  };

  return (
    <div className="space-y-4">
      {/* INPUT: Keyword */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="sm:w-28 text-sm font-medium text-gray-700 dark:text-slate-300">
          Keyword
        </label>

        <input
          className="input sm:flex-1"
          value={form.keyword}
          onChange={(e) => setForm({ ...form, keyword: e.target.value })}
        />
      </div>

      {/* SELECT: Match Type */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="sm:w-28 text-sm font-medium text-gray-700 dark:text-slate-300">
          Match Type
        </label>
        <select
          className="select sm:flex-1"
          value={form.matchType}
          onChange={(e) =>
            setForm({ ...form, matchType: e.target.value as MatchType })
          }
        >
          <option value="contains">Contains</option>
          <option value="startsWith">Starts With</option>
          <option value="exact">Exact</option>
        </select>
      </div>

      {/* SELECT: Action Type */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="sm:w-28 text-sm font-medium text-gray-700 dark:text-slate-300">
          Action
        </label>
        <select
          className="select sm:flex-1"
          value={form.actionType}
          onChange={(e) =>
            setForm({ ...form, actionType: e.target.value as ActionType })
          }
        >
          <option value="highlight">Highlight</option>
          <option value="tooltip">Tooltip</option>
        </select>
      </div>

      {/* INPUT: Priority */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="sm:w-28 text-sm font-medium text-gray-700 dark:text-slate-300">
          Priority
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-secondary !px-3 !py-2"
            onClick={() => stepPriority(-1)}
            aria-label="Decrease priority"
            disabled={priorityValue <= 0}
          >
            –
          </button>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="e.g. 10 = high"
            className="input w-32 text-center"
            value={priorityValue}
            onChange={(e) => updatePriority(Number(e.target.value))}
          />
          <button
            type="button"
            className="btn btn-secondary !px-3 !py-2"
            onClick={() => stepPriority(1)}
            aria-label="Increase priority"
          >
            +
          </button>
        </div>
      </div>

      {/* CONDITIONAL INPUTS based on action type */}
      {form.actionType === "highlight" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-28 text-sm font-medium text-gray-700 dark:text-slate-300">
            Color
          </label>

          <div className="flex items-center gap-3">
            {/* Preview circle */}
            <span
              className="h-6 w-6 rounded-full border border-gray-300"
              style={{ backgroundColor: form.color || "red" }} //default red
            />

            {/* Select dropdown*/}
            <select
              className="select"
              value={form.color ?? "red"}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            >
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>
      )}

      {/* Input for tooltip label */}
      {form.actionType === "tooltip" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-28 text-sm font-medium text-gray-700 dark:text-slate-300">
            Label
          </label>
          <input
            className="input sm:flex-1"
            value={form.label ?? ""}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </div>
      )}

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={isKeywordEmpty}
        className="btn btn-primary w-full"
      >
        {mode === "edit" ? "Update Rule" : "Save Rule"}
      </button>
    </div>
  );
};

export default RuleForm;
