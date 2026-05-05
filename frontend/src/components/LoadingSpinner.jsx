import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
  </div>
);

export default LoadingSpinner;
