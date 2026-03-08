"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patron");
  const [isAct60, setIsAct60] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showAct60 = role === "patron" || role === "both";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          is_act60: showAct60 ? isAct60 : false,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push("/artist/dashboard");
  }

  async function handleGoogleSignup() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  const roles: { value: UserRole; label: string; desc: string }[] = [
    {
      value: "artist",
      label: "I'm an Artist",
      desc: "Create walks & share your art",
    },
    {
      value: "patron",
      label: "I'm a Patron",
      desc: "Support artists & explore PR",
    },
    { value: "both", label: "Both", desc: "Create and support" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bembe-sand">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-bembe-night tracking-tight">
            Bembe
          </h1>
          <p className="mt-2 text-bembe-night/60">Join the movement</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-8">
          <h2 className="text-xl font-semibold text-bembe-night mb-6">
            Create your account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-bembe-coral/10 text-bembe-coral text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-bembe-night/70 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bembe-night/30" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-bembe-night/70 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bembe-night/30" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-bembe-night/70 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bembe-night/30" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-bembe-night/70 mb-2">
                I want to...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`relative p-3 rounded-xl border-2 text-center transition ${
                      role === r.value
                        ? "border-bembe-teal bg-bembe-teal/5"
                        : "border-bembe-night/10 hover:border-bembe-night/20"
                    }`}
                  >
                    {role === r.value && (
                      <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-bembe-teal" />
                    )}
                    <span
                      className={`block text-sm font-semibold ${
                        role === r.value
                          ? "text-bembe-teal"
                          : "text-bembe-night"
                      }`}
                    >
                      {r.label}
                    </span>
                    <span className="block text-[11px] text-bembe-night/50 mt-0.5">
                      {r.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Act 60 checkbox */}
            {showAct60 && (
              <label className="flex items-start gap-3 p-3 rounded-xl bg-bembe-gold/10 border border-bembe-gold/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAct60}
                  onChange={(e) => setIsAct60(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-bembe-night/20 text-bembe-gold focus:ring-bembe-gold accent-bembe-gold"
                />
                <div>
                  <span className="text-sm font-medium text-bembe-night">
                    I&apos;m an Act 60 decree holder
                  </span>
                  <span className="block text-xs text-bembe-night/50 mt-0.5">
                    Tax incentive benefits for supporting local art
                  </span>
                </div>
              </label>
            )}

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-bembe-night/20 text-bembe-teal focus:ring-bembe-teal accent-bembe-teal"
              />
              <span className="text-sm text-bembe-night/60">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-bembe-teal hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-bembe-teal hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-3 rounded-xl bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-bembe-night/10" />
            <span className="text-xs text-bembe-night/40 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-bembe-night/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            className="w-full py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night font-medium hover:bg-bembe-sand/50 active:scale-[0.98] transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center mt-6 text-sm text-bembe-night/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-bembe-teal font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
