import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Accounts = lazy(() => import("./pages/Accounts"));
const AccountDetail = lazy(() => import("./pages/AccountDetail"));

function PageFallback() {
  return <p className="text-sm text-slate-400">Loading…</p>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:id"
          element={
            <ProtectedRoute>
              <AccountDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
