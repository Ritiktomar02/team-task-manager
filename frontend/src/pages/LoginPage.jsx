import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import UserContext from "../context/UserContext";
import { api, AUTH } from "../services/api";

const DEMO_PASSWORD = "Demo@123";
const DEMO_ACCOUNTS = [
  { label: "Admin", email: "demo.admin@example.com" },
  { label: "Member", email: "demo.member@example.com" },
];

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (creds) => {
    setLoading(true);
    try {
      const { data } = await api.post(AUTH.LOGIN, creds);
      setUser(data.user);
      toast.success("Welcome back");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    submit(form);
  };

  const onDemoLogin = (email) => {
    setForm({ email, password: DEMO_PASSWORD });
    submit({ email, password: DEMO_PASSWORD });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to your team workspace</p>
        </div>

        <label className="block">
          <span className="text-xs text-slate-400">Email</span>
          <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3">
            <Mail className="w-4 h-4 text-slate-500" />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChange}
              className="flex-1 bg-transparent py-2 outline-none text-sm"
              placeholder="you@example.com"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-xs text-slate-400">Password</span>
          <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3">
            <Lock className="w-4 h-4 text-slate-500" />
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={onChange}
              className="flex-1 bg-transparent py-2 outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Sign in
        </button>

        <div className="border-t border-slate-700 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Try a demo account — pre-loaded with a project & tasks</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((d) => (
              <button
                key={d.email}
                type="button"
                disabled={loading}
                onClick={() => onDemoLogin(d.email)}
                className="px-2 py-1.5 rounded-lg border border-slate-700 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-xs text-slate-200 disabled:opacity-60 text-left"
              >
                <div className="font-medium text-slate-100">{d.label}</div>
                <div className="text-[10px] text-slate-400 truncate">
                  {d.email}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-slate-500 text-center">
            Password for both: <code className="text-slate-300">{DEMO_PASSWORD}</code>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center">
          New here?{" "}
          <Link to="/signup" className="text-emerald-400 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
