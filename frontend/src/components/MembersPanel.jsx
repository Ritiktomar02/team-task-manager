import { useState } from "react";
import { UserPlus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, PROJECT } from "../services/api";

const MembersPanel = ({ project, role, onProjectUpdate, currentUserId }) => {
  const isAdmin = role === "admin";
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const onAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post(PROJECT.ADD_MEMBER(project._id), {
        email: email.trim(),
      });
      onProjectUpdate(data.project);
      setEmail("");
      toast.success("Member added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setAdding(false);
    }
  };

  const onRemove = async (userId) => {
    if (!confirm("Remove this member?")) return;
    try {
      const { data } = await api.delete(
        PROJECT.REMOVE_MEMBER(project._id, userId),
      );
      onProjectUpdate(data.project);
      toast.success("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  const onChangeRole = async (userId, newRole) => {
    try {
      const { data } = await api.patch(
        PROJECT.UPDATE_ROLE(project._id, userId),
        { role: newRole },
      );
      onProjectUpdate(data.project);
      toast.success("Role updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <div className="space-y-4">
      {isAdmin ? (
        <form
          onSubmit={onAdd}
          className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex gap-2"
        >
          <input
            type="email"
            required
            placeholder="Add member by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-medium flex items-center gap-1 disabled:opacity-60"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Add
          </button>
        </form>
      ) : null}

      <div className="bg-slate-800/40 border border-slate-800 rounded-xl divide-y divide-slate-800">
        {project.members.map((m) => {
          const isCreator = project.createdBy?._id === m.user._id;
          return (
            <div
              key={m.user._id}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">
                {m.user.picture || m.user.username?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  {m.user.username}{" "}
                  {isCreator ? (
                    <span className="text-[10px] text-slate-500 ml-1">
                      (creator)
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {m.user.email}
                </div>
              </div>
              {isAdmin && !isCreator ? (
                <select
                  value={m.role}
                  onChange={(e) => onChangeRole(m.user._id, e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              ) : (
                <span className="text-xs text-slate-400 capitalize">
                  {m.role}
                </span>
              )}
              {isAdmin && !isCreator ? (
                <button
                  onClick={() => onRemove(m.user._id)}
                  className="p-1.5 rounded hover:bg-rose-500/10 text-rose-300"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersPanel;
