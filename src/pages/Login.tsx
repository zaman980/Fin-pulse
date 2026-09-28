import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 border border-ink-700"
      >
        <h1 className="text-lg font-semibold text-ink-900 mb-1">
          Sign in to your account
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Welcome back. Enter your details to continue.
        </p>

        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-rose-600 bg-rose-600/5 border border-rose-600/20 rounded-md px-3 py-2"
          >
            {error}
          </p>
        )}

        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2.5 rounded-md transition-colors"
        >
          Sign in
        </button>

        <p className="text-sm text-slate-600 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-emerald-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
