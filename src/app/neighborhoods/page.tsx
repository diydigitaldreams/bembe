import Link from "next/link";
import Navbar from "@/components/navbar";
import { MapPin, ArrowRight, Headphones } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import NeighborhoodList from "./neighborhood-list";

export const metadata: Metadata = {
  title: "Barrios y Comunidades",
  description:
    "Explora caminatas de arte curadas por artistas locales en cada barrio de Puerto Rico — Santurce, Viejo San Juan, Condado, Ponce, Loiza y mas.",
};

export default async function NeighborhoodsPage() {
  const supabase = await createClient();

  // Get walk counts grouped by neighborhood
  const { data: walks } = await supabase
    .from("art_walks")
    .select("neighborhood")
    .eq("is_published", true);

  const walkCountMap: Record<string, number> = {};
  if (walks) {
    for (const w of walks) {
      const key = w.neighborhood.toLowerCase();
      walkCountMap[key] = (walkCountMap[key] || 0) + 1;
    }
  }

  return <NeighborhoodList walkCounts={walkCountMap} />;
}
