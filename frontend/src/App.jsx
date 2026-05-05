import { Route, Routes, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import UserContext from "./context/UserContext";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useContext(UserContext);
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
};

const RedirectAuthed = ({ children }) => {
  const { authenticated } = useContext(UserContext);
  if (authenticated) return <Navigate to="/" replace />;
  return children;
};

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-900 text-slate-100">
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
  </div>
);

const App = () => {
  const { checkingAuth, checkAuth } = useContext(UserContext);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <RedirectAuthed>
            <LoginPage />
          </RedirectAuthed>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectAuthed>
            <SignUpPage />
          </RedirectAuthed>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
