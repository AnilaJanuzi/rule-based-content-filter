import type { Rule } from "../types/rule.ts";
import DeleteIcon from "../assets/icons/deleteicon.svg";
import EditIcon from "../assets/icons/editicon.svg";

interface RuleRowProps {
  rule: Rule;
  onToggleActive: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (rule: Rule) => void;
}

// Component for rendering a single rule row in the table
const RuleRow = ({ rule, onToggleActive, onDelete, onEdit }: RuleRowProps) => {
  const inactive = rule.isActive !== 1;

  return (
    <tr
      className={`border-b border-slate-800 transition-colors ${
        inactive ? "bg-slate-900/20" : "bg-slate-900/40"
      } hover:bg-slate-800/60`}
    >
      <td className="td">
        <input
          type="checkbox"
          checked={rule.isActive === 1}
          onChange={() => onToggleActive(rule.id)}
          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-400 focus:ring-indigo-500"
        />
      </td>
      <td
        className={`td font-medium ${inactive ? "text-slate-400" : "text-slate-50"}`}
      >
        {rule.keyword}
      </td>
      <td className={`td ${inactive ? "text-slate-500" : "text-slate-200"}`}>
        {rule.matchType}
      </td>
      <td className={`td ${inactive ? "text-slate-500" : "text-slate-200"}`}>
        {rule.actionType}
      </td>
      <td className="td">
        {rule.actionType === "highlight" ? (
          <span
            className="inline-block h-5 w-5 rounded-full border border-slate-600"
            style={{ backgroundColor: rule.color || "#ef4444" }}
          />
        ) : (
          <span className="badge badge-warn">{rule.label}</span>
        )}
      </td>
      <td className="td">
        <div className="flex gap-3 whitespace-nowrap text-slate-300">
          {onEdit && (
            <button
              type="button"
              className="rounded-lg p-1 transition hover:bg-slate-800 hover:text-white"
              onClick={() => onEdit(rule)}
              aria-label="Edit rule"
            >
              <img src={EditIcon} alt="Edit" className="h-4 w-4 invert" />
            </button>
          )}
          <button
            type="button"
            className="rounded-lg p-1 transition hover:bg-slate-800 hover:text-white"
            onClick={() => onDelete(rule.id)}
            aria-label="Delete rule"
          >
            <img src={DeleteIcon} alt="Delete" className="h-4 w-4 invert" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RuleRow;
