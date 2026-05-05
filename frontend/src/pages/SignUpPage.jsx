import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import UserContext from "../context/UserContext";
import { api, AUTH } from "../services/api";

const SignUpPage = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(AUTH.REGISTER, form);
      setUser(data.user);
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Create account</h1>
          <p className="text-sm text-slate-400">Start managing your team's tasks</p>
        </div>

        <label className="block">
          <span className="text-xs text-slate-400">Name</span>
          <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3">
            <User className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={onChange}
              className="flex-1 bg-transparent py-2 outline-none text-sm"
              placeholder="Ritik Tomar"
            />
          </div>
        </label>

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
              minLength={6}
              value={form.password}
              onChange={onChange}
              className="flex-1 bg-transparent py-2 outline-none text-sm"
              placeholder="At least 6 characters"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Create account
        </button>

        <p className="text-xs text-slate-400 text-center">
          Have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
