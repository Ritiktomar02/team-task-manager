import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, PROJECT } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(PROJECT.LIST);
      setProjects(data.projects);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post(PROJECT.CREATE, form);
      setProjects([data.project, ...projects]);
      setForm({ name: "", description: "" });
      setShowForm(false);
      toast.success("Project created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-slate-400">
            Workspaces you own or are a member of
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={onCreate}
          className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3"
        >
          <input
            type="text"
            required
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-medium flex items-center gap-2 disabled:opacity-60"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create
            </button>
          </div>
        </form>
      ) : null}

      {projects.length === 0 ? (
        <div className="text-sm text-slate-500 bg-slate-800/40 border border-slate-800 rounded-lg p-6 text-center">
          No projects yet. Create your first one.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((p) => (
            <Link
              key={p._id}
              to={`/projects/${p._id}`}
              className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition"
            >
              <div className="font-medium truncate">{p.name}</div>
              {p.description ? (
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {p.description}
                </p>
              ) : null}
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                <Users className="w-3.5 h-3.5" />
                {p.members.length} member{p.members.length === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
