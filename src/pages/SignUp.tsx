import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";

const MIN_PASSWORD_LENGTH = 8;

export default function SignUp() {
  const { user, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      signUp({ name, email, password });
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
          Create your account
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Demo app: accounts are saved in your browser only. Please do not use a real password.
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
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormField
          id="confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2.5 rounded-md transition-colors"
        >
          Create account
        </button>

        <p className="text-sm text-slate-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
