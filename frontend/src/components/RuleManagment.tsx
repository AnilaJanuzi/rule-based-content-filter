import { useEffect, useState } from "react";
import API from "../api/api";
import RuleTable from "./RuleTable";
import RuleForm from "./RuleForm";
import type { Rule, RuleDraft } from "../types/rule.ts";
import { defaultRuleDraft } from "../types/rule.ts";

// Main component for managing rules
const RuleManagement = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [showEditSuccess, setShowEditSuccess] = useState(false);

  // Form state for new rule creation
  const [form, setForm] = useState<RuleDraft>(defaultRuleDraft);

  // Fetch rules from backend API
  const fetchRules = async () => {
    const res = await API.get<Rule[]>("/rules");
    setRules(res.data);
  };

  // Fetch rules on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  const resetForm = () => {
    setForm(defaultRuleDraft);
    setEditingRuleId(null);
  };

  // Create or update rule
  const saveRule = async () => {
    if (!form.keyword.trim()) return;

    if (editingRuleId == null) {
      // POST request to create new rule
      await API.post("/rules", form);
    } else {
      await API.put(`/rules/${editingRuleId}`, form);
      setShowEditSuccess(true);
    }

    await fetchRules();
    resetForm();
    setShowForm(false);
  };

  const deleteRule = async (id: number) => {
    await API.delete(`/rules/${id}`);
    await fetchRules();
  };

  const requestDelete = (id: number) => setPendingDeleteId(id);
  const cancelDelete = () => setPendingDeleteId(null);
  const confirmDelete = async () => {
    if (pendingDeleteId == null) return;
    await deleteRule(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const toggleRuleActive = async (id: number) => {
    await API.patch(`/rules/${id}/toggle`);
    await fetchRules();
  };

  const startEdit = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setForm({
      keyword: rule.keyword,
      matchType: rule.matchType,
      actionType: rule.actionType,
      color: rule.color ?? "red",
      label: rule.label ?? "IMPORTANT",
      isActive: rule.isActive,
      priority: rule.priority ?? 0,
      groupName: rule.groupName ?? "General",
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">Rule Management</h3>
          <p className="card-subtitle">
            Create, edit, and toggle rules to control how text is marked.
          </p>
        </div>

        {/* Table displaying existing rules */}
        <RuleTable
          rules={rules}
          onToggleActive={toggleRuleActive}
          onDelete={requestDelete}
          onEdit={startEdit}
        />


        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-400">
            Tip: Use “Contains” for partial matches.
          </p>

          {/*  toggle rule creation form */}
          <button
            onClick={() => {
              if (showForm) {
                cancelForm();
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            className={`btn w-full sm:w-auto ${showForm ? "btn-secondary" : "btn-primary"}`}
          >
            {showForm ? "Cancel" : "+ Add New Rule"}
          </button>
        </div>

        {/* Conditionally render the rule creation form */}
        {showForm && (
          <div className="mt-4 border-t border-slate-800 pt-4">
            <RuleForm
              form={form}
              setForm={setForm}
              onSave={saveRule}
              mode={editingRuleId == null ? "add" : "edit"}
            />
          </div>
        )}

      {/* Edit success modal */}
      {showEditSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowEditSuccess(false)}
          />
          <div className="relative card w-full max-w-sm">
            <div className="card-body">
            <h4 className="text-lg font-semibold text-slate-50">Updated</h4>
            <p className="text-sm text-slate-300 mt-1">
              Rule updated successfully.
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowEditSuccess(false)}
                className="btn btn-primary w-full"
              >
                OK
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {pendingDeleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={cancelDelete} />
          <div className="relative card w-full max-w-sm">
            <div className="card-body">
            <h4 className="text-lg font-semibold text-slate-50">Delete rule?</h4>
            <p className="text-sm text-slate-300 mt-1">
              Are you sure you want to delete it?
            </p>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={cancelDelete}
                className="btn btn-secondary w-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn btn-danger w-full"
              >
                Yes
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RuleManagement;