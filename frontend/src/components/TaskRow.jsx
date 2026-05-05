import { Link } from "react-router-dom";

const STATUS_TONE = {
  todo: "bg-slate-700/40 text-slate-300",
  in_progress: "bg-amber-500/15 text-amber-300",
  done: "bg-sky-500/15 text-sky-300",
};

const STATUS_LABEL = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const PRIORITY_TONE = {
  low: "text-slate-400",
  medium: "text-amber-400",
  high: "text-rose-400",
};

const formatDue = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
};

const TaskRow = ({ task, showProject = false, onClick }) => {
  const overdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const content = (
    <div
      onClick={onClick}
      className={`bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 flex items-center gap-3 ${
        onClick ? "cursor-pointer hover:bg-slate-800" : ""
      }`}
    >
      <span
        className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
          STATUS_TONE[task.status]
        }`}
      >
        {STATUS_LABEL[task.status]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{task.title}</div>
        {showProject && task.project ? (
          <div className="text-xs text-slate-500 truncate">
            {task.project.name}
          </div>
        ) : null}
      </div>
      <span className={`text-xs ${PRIORITY_TONE[task.priority]}`}>
        {task.priority}
      </span>
      {task.dueDate ? (
        <span
          className={`text-xs ${overdue ? "text-rose-400" : "text-slate-400"}`}
        >
          {formatDue(task.dueDate)}
        </span>
      ) : null}
      {task.assignee ? (
        <span
          className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]"
          title={task.assignee.username}
        >
          {task.assignee.picture || task.assignee.username?.slice(0, 2).toUpperCase()}
        </span>
      ) : null}
    </div>
  );

  if (showProject && task.project && !onClick) {
    return <Link to={`/projects/${task.project._id}`}>{content}</Link>;
  }
  return content;
};

export default TaskRow;
