"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect based on user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .single();

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      const userRole = profile?.role;
      router.push(userRole === "artist" || userRole === "both" ? "/artist/dashboard" : "/discover");
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      setError(
        t.auth.google_unavailable
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bembe-sand">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-bembe-night tracking-tight">
            Bembe
          </h1>
          <p className="mt-2 text-bembe-night/60">
            {t.auth.tagline}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-8">
          <h2 className="text-xl font-semibold text-bembe-night mb-6">
            {t.auth.login_title}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-bembe-coral/10 text-bembe-coral text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-bembe-night/70 mb-1.5"
              >
                {t.auth.email}
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
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bembe-night/30" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.placeholder_password}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bembe-night/30 hover:text-bembe-night/60 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-bembe-teal hover:underline"
              >
                {t.forgot_password.title}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t.auth.sign_in}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-bembe-night/10" />
            <span className="text-xs text-bembe-night/40 uppercase tracking-wider">
              {t.auth.or}
            </span>
            <div className="flex-1 h-px bg-bembe-night/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
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
            {t.auth.sign_in_google}
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center mt-6 text-sm text-bembe-night/50">
          {t.auth.no_account}{" "}
          <Link
            href="/signup"
            className="text-bembe-teal font-semibold hover:underline"
          >
            {t.auth.sign_up_link}
          </Link>
        </p>
      </div>
    </div>
  );
}
