import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  ListChecks,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { api, PROJECT, TASK } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskRow from "../components/TaskRow";
import TaskFormModal from "../components/TaskFormModal";
import MembersPanel from "../components/MembersPanel";
import UserContext from "../context/UserContext";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [project, setProject] = useState(null);
  const [role, setRole] = useState("member");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("tasks");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editingHeader, setEditingHeader] = useState(false);
  const [headerForm, setHeaderForm] = useState({ name: "", description: "" });
  const [savingHeader, setSavingHeader] = useState(false);

  const isAdmin = role === "admin";

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: pData }, { data: tData }] = await Promise.all([
        api.get(PROJECT.GET(projectId)),
        api.get(TASK.BY_PROJECT(projectId)),
      ]);
      setProject(pData.project);
      setRole(pData.role);
      setTasks(tData.tasks);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load project");
      navigate("/projects", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const grouped = useMemo(() => {
    const out = { todo: [], in_progress: [], done: [] };
    for (const t of tasks) out[t.status]?.push(t);
    return out;
  }, [tasks]);

  const onTaskSaved = (saved) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t._id === saved._id);
      if (idx === -1) return [saved, ...prev];
      const next = prev.slice();
      next[idx] = saved;
      return next;
    });
  };

  const onTaskDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const startEditHeader = () => {
    setHeaderForm({ name: project.name, description: project.description || "" });
    setEditingHeader(true);
  };

  const saveHeader = async () => {
    setSavingHeader(true);
    try {
      const { data } = await api.patch(PROJECT.UPDATE(project._id), headerForm);
      setProject(data.project);
      setEditingHeader(false);
      toast.success("Project updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSavingHeader(false);
    }
  };

  const deleteProject = async () => {
    if (!confirm("Delete this project and all its tasks? This cannot be undone."))
      return;
    try {
      await api.delete(PROJECT.DELETE(project._id));
      toast.success("Project deleted");
      navigate("/projects", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate("/projects")}
        className="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> All projects
      </button>

      <header className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
        {editingHeader ? (
          <div className="space-y-3">
            <input
              value={headerForm.name}
              onChange={(e) =>
                setHeaderForm({ ...headerForm, name: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            />
            <textarea
              value={headerForm.description}
              onChange={(e) =>
                setHeaderForm({ ...headerForm, description: e.target.value })
              }
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingHeader(false)}
                className="p-1.5 rounded hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={saveHeader}
                disabled={savingHeader}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-medium flex items-center gap-1 disabled:opacity-60"
              >
                {savingHeader ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold truncate">{project.name}</h1>
              {project.description ? (
                <p className="text-sm text-slate-400 mt-1">
                  {project.description}
                </p>
              ) : null}
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 capitalize">
                  {role}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {project.members.length} member
                  {project.members.length === 1 ? "" : "s"}
                </span>
                <span className="flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5" />
                  {tasks.length} task{tasks.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {isAdmin ? (
              <div className="flex gap-1">
                <button
                  onClick={startEditHeader}
                  className="p-2 rounded hover:bg-slate-700 text-slate-300"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={deleteProject}
                  className="p-2 rounded hover:bg-rose-500/10 text-rose-300"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        )}
      </header>

      <div className="flex gap-1 border-b border-slate-800">
        <button
          onClick={() => setTab("tasks")}
          className={`px-3 py-2 text-sm border-b-2 -mb-px ${
            tab === "tasks"
              ? "border-emerald-400 text-emerald-300"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setTab("members")}
          className={`px-3 py-2 text-sm border-b-2 -mb-px ${
            tab === "members"
              ? "border-emerald-400 text-emerald-300"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Members
        </button>
      </div>

      {tab === "tasks" ? (
        <div className="space-y-4">
          {isAdmin ? (
            <button
              onClick={() => setCreating(true)}
              className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New task
            </button>
          ) : null}

          <div className="grid md:grid-cols-3 gap-3">
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 space-y-2 min-h-[120px]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{col.label}</h3>
                  <span className="text-xs text-slate-500">
                    {grouped[col.key].length}
                  </span>
                </div>
                {grouped[col.key].length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-4">
                    Empty
                  </div>
                ) : (
                  grouped[col.key].map((t) => (
                    <TaskRow
                      key={t._id}
                      task={t}
                      onClick={() => setEditing(t)}
                    />
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MembersPanel
          project={project}
          role={role}
          onProjectUpdate={(p) => setProject(p)}
          currentUserId={user?._id}
        />
      )}

      <TaskFormModal
        open={creating}
        onClose={() => setCreating(false)}
        project={project}
        role={role}
        currentUserId={user?._id}
        onSaved={onTaskSaved}
        onDeleted={onTaskDeleted}
      />
      <TaskFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        project={project}
        role={role}
        task={editing}
        currentUserId={user?._id}
        onSaved={onTaskSaved}
        onDeleted={onTaskDeleted}
      />
    </div>
  );
};

export default ProjectPage;
