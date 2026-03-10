"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Loader2, User } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { SkeletonReview } from "@/components/skeleton";
import type { Review } from "@/types";

interface WalkReviewsProps {
  walkId: string;
  totalPlays: number;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const px = size === "sm" ? "h-4 w-4" : "h-7 w-7";
  const groupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (readonly || !onChange) return;

      let newValue = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        newValue = Math.min(5, value + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        newValue = Math.max(1, value - 1);
      } else {
        return;
      }

      onChange(newValue);

      // Move focus to the newly selected star
      const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      buttons?.[newValue - 1]?.focus();
    },
    [value, onChange, readonly]
  );

  return (
    <div
      ref={groupRef}
      className="flex gap-0.5"
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          role="radio"
          aria-checked={star === value}
          tabIndex={readonly ? -1 : star === value || (value === 0 && star === 1) ? 0 : -1}
          onClick={() => onChange?.(star)}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
        >
          <Star
            className={`${px} ${
              star <= (hover || value)
                ? "text-bembe-gold fill-bembe-gold"
                : "text-bembe-night/15"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string, reviews: { today: string; yesterday: string; days_ago: string; months_ago: string }): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return reviews.today;
  if (days === 1) return reviews.yesterday;
  if (days < 30) return `${days} ${reviews.days_ago}`;
  const months = Math.floor(days / 30);
  return `${months} ${reviews.months_ago}`;
}

export default function WalkReviews({ walkId, totalPlays }: WalkReviewsProps) {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      try {
        const res = await fetch(`/api/walks/${walkId}/reviews`);
        const data = await res.json();
        setReviews(data.reviews || []);

        // Pre-fill if user already reviewed
        if (user && data.reviews) {
          const existing = data.reviews.find((r: Review) => r.user_id === user.id);
          if (existing) {
            setRating(existing.rating);
            setComment(existing.comment || "");
            setSubmitted(true);
          }
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [walkId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/walks/${walkId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t.common.error);
        return;
      }

      const { review } = await res.json();

      // Update local list
      setReviews((prev) => {
        const filtered = prev.filter((r) => r.user_id !== review.user_id);
        return [review, ...filtered];
      });
      setSubmitted(true);
    } catch {
      setError(t.common.error);
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div>
      <h2 className="text-lg font-bold text-bembe-night mb-3">{t.walk.reviews}</h2>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-bembe-night">{avgRating}</p>
            <StarRating value={Math.round(Number(avgRating))} readonly size="sm" />
            <p className="text-xs text-bembe-night/40 mt-1">
              {reviews.length} {t.reviews.count}
            </p>
          </div>
          <div className="flex-1 text-sm text-bembe-night/50">
            <p>{totalPlays} {t.walk.people_taken}</p>
          </div>
        </div>
      </div>

      {/* Review form */}
      {userId && !submitted ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 mb-4">
          <p className="text-sm font-semibold text-bembe-night mb-3">
            {t.reviews.your_review}
          </p>
          <div className="mb-3">
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 1000))}
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/30 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition-all resize-none text-sm"
            placeholder={t.reviews.comment_placeholder}
          />
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="mt-3 w-full py-2.5 rounded-xl bg-bembe-teal text-white text-sm font-semibold hover:bg-bembe-teal/90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.reviews.submit}
          </button>
        </form>
      ) : userId && submitted ? (
        <div className="bg-bembe-teal/5 rounded-2xl p-4 mb-4 text-center">
          <p className="text-sm text-bembe-teal font-medium">{t.reviews.thanks}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 mb-4 text-center">
          <p className="text-sm text-bembe-night/50">{t.reviews.login_to_review}</p>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          <SkeletonReview />
          <SkeletonReview />
          <SkeletonReview />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center">
          <Star className="h-8 w-8 text-bembe-gold/30 mx-auto mb-2" />
          <p className="text-sm text-bembe-night/50">{t.reviews.no_reviews}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-bembe-gold/20 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-bembe-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-bembe-night truncate">
                    {review.user?.full_name || "Walker"}
                  </p>
                  <p className="text-xs text-bembe-night/40">
                    {timeAgo(review.created_at, t.reviews)}
                  </p>
                </div>
                <StarRating value={review.rating} readonly size="sm" />
              </div>
              {review.comment && (
                <p className="text-sm text-bembe-night/70 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
