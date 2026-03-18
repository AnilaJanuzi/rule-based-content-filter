import RuleRow from "./RuleRow";
import type { Rule } from "../types/rule.ts";

interface RuleTableProps {
  rules: Rule[];
  onToggleActive: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (rule: Rule) => void;
}

// Component for rendering the table of rules
const RuleTable = ({ rules, onToggleActive, onDelete, onEdit }: RuleTableProps) => {
  return (
    <div className="table-wrap mb-4">
      <div className="table-inner min-w-[720px] lg:min-w-0">
        <div className="table-shell">
          <table className="table">
          <thead>
            <tr className="text-left">
              <th className="th rounded-tl-xl">
                Active
              </th>
              <th className="th">
                Keyword
              </th>
              <th className="th">
                Match
              </th>
              <th className="th">
                Action
              </th>
              <th className="th">
                Color/Tag
              </th>
              <th className="th rounded-tr-xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <RuleRow
                key={r.id}
                rule={r}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RuleTable;