import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  FolderKanban,
} from "lucide-react";
import toast from "react-hot-toast";
import { api, TASK } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskRow from "../components/TaskRow";

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(TASK.DASHBOARD);
      setData(data.dashboard);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const { projectCount, statusCounts, overdueTasks, myOpenTasks, recentTasks } =
    data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Overview of your tasks across all projects
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={projectCount}
          tone="bg-emerald-500/15 text-emerald-300"
        />
        <StatCard
          icon={ListTodo}
          label="To do"
          value={statusCounts.todo}
          tone="bg-slate-500/15 text-slate-300"
        />
        <StatCard
          icon={Clock}
          label="In progress"
          value={statusCounts.in_progress}
          tone="bg-amber-500/15 text-amber-300"
        />
        <StatCard
          icon={CheckCircle2}
          label="Done"
          value={statusCounts.done}
          tone="bg-sky-500/15 text-sky-300"
        />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <h2 className="font-medium">Overdue</h2>
          <span className="text-xs text-slate-500">
            ({overdueTasks.length})
          </span>
        </div>
        {overdueTasks.length === 0 ? (
          <div className="text-sm text-slate-500 bg-slate-800/40 border border-slate-800 rounded-lg p-3">
            Nothing overdue. Nice.
          </div>
        ) : (
          <div className="space-y-2">
            {overdueTasks.map((t) => (
              <TaskRow key={t._id} task={t} showProject />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-medium mb-2">My open tasks</h2>
        {myOpenTasks.length === 0 ? (
          <div className="text-sm text-slate-500 bg-slate-800/40 border border-slate-800 rounded-lg p-3">
            No open tasks assigned to you.
          </div>
        ) : (
          <div className="space-y-2">
            {myOpenTasks.map((t) => (
              <TaskRow key={t._id} task={t} showProject />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-medium mb-2">Recent activity</h2>
        {recentTasks.length === 0 ? (
          <div className="text-sm text-slate-500 bg-slate-800/40 border border-slate-800 rounded-lg p-3">
            No tasks yet.{" "}
            <Link to="/projects" className="text-emerald-400 hover:underline">
              Create a project
            </Link>{" "}
            to start.
          </div>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((t) => (
              <TaskRow key={t._id} task={t} showProject />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
