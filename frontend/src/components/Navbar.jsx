import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, FolderKanban } from "lucide-react";
import UserContext from "../context/UserContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
    isActive
      ? "bg-emerald-500/20 text-emerald-300"
      : "text-slate-300 hover:bg-slate-800"
  }`;

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          <span className="text-emerald-400">Team</span> Task Manager
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            <FolderKanban className="w-4 h-4" /> Projects
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-medium">
                {user.picture || user.username?.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 p-1.5 rounded-md hover:bg-slate-800 text-slate-300"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
