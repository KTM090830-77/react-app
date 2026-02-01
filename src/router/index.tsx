import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Dashboard";
import Assignment from "../pages/SubmissionPage";
import Settings from "../pages/SettingsPage";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
