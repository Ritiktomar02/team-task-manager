import { useEffect, useState } from "react";
import { X, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, TASK } from "../services/api";

const STATUSES = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const TaskFormModal = ({
  open,
  onClose,
  project,
  role,
  task,
  onSaved,
  onDeleted,
  currentUserId,
}) => {
  const isEdit = !!task;
  const isAdmin = role === "admin";
  const isAssignee = task?.assignee?._id === currentUserId;
  const canEditAll = isAdmin;
  const canEditStatusOnly = !isAdmin && isAssignee;

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        assignee: task.assignee?._id || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: toDateInput(task.dueDate),
      });
    } else {
      setForm({
        title: "",
        description: "",
        assignee: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
    }
  }, [open, task]);

  if (!open) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        const payload = canEditAll
          ? {
              title: form.title,
              description: form.description,
              assignee: form.assignee || null,
              status: form.status,
              priority: form.priority,
              dueDate: form.dueDate || null,
            }
          : { status: form.status };
        const { data } = await api.patch(TASK.UPDATE(task._id), payload);
        onSaved(data.task);
        toast.success("Task updated");
      } else {
        const { data } = await api.post(TASK.CREATE, {
          projectId: project._id,
          title: form.title,
          description: form.description,
          assignee: form.assignee || null,
          status: form.status,
          priority: form.priority,
          dueDate: form.dueDate || null,
        });
        onSaved(data.task);
        toast.success("Task created");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!isEdit || !isAdmin) return;
    if (!confirm("Delete this task?")) return;
    setDeleting(true);
    try {
      await api.delete(TASK.DELETE(task._id));
      onDeleted(task._id);
      toast.success("Task deleted");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit task" : "New task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!canEditAll && !canEditStatusOnly ? (
          <div className="text-xs text-slate-400 bg-slate-800/60 rounded p-2">
            Read-only — you can only update tasks assigned to you.
          </div>
        ) : null}

        <label className="block">
          <span className="text-xs text-slate-400">Title</span>
          <input
            type="text"
            required
            disabled={!canEditAll}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none disabled:opacity-60"
          />
        </label>

        <label className="block">
          <span className="text-xs text-slate-400">Description</span>
          <textarea
            disabled={!canEditAll}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none resize-none disabled:opacity-60"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-slate-400">Assignee</span>
            <select
              disabled={!canEditAll}
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none disabled:opacity-60"
            >
              <option value="">Unassigned</option>
              {project.members.map((m) => (
                <option key={m.user._id} value={m.user._id}>
                  {m.user.username}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-slate-400">Status</span>
            <select
              disabled={!canEditAll && !canEditStatusOnly}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none disabled:opacity-60"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-slate-400">Priority</span>
            <select
              disabled={!canEditAll}
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none disabled:opacity-60"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-slate-400">Due date</span>
            <input
              type="date"
              disabled={!canEditAll}
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none disabled:opacity-60"
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isEdit && isAdmin ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="px-3 py-1.5 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10 flex items-center gap-1"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            {(canEditAll || canEditStatusOnly) ? (
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-medium flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isEdit ? "Save" : "Create"}
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskFormModal;
