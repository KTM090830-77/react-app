
import { Routes, Route } from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import Layout from "./components/layout/Layout";
import ClassroomCallback from "./pages/ClassroomCallback";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SubmissionPage from "./pages/SubmissionPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/classroom/callback" element={<ClassroomCallback />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="assignment" element={<SubmissionPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
