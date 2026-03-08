"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Loader2,
  MapPin,
  Image as ImageIcon,
  Mic,
  DollarSign,
  Eye,
  GripVertical,
} from "lucide-react";
import Link from "next/link";

const NEIGHBORHOODS = [
  "Viejo San Juan",
  "Santurce",
  "Condado",
  "Ocean Park",
  "Isla Verde",
  "Miramar",
  "Hato Rey",
  "Rio Piedras",
  "Caguas",
  "Ponce",
  "Mayaguez",
  "Rincon",
  "Cabo Rojo",
  "Vieques",
  "Culebra",
  "Loiza",
  "Fajardo",
  "Humacao",
  "Aguadilla",
  "Arecibo",
];

interface WalkStop {
  id: string;
  title: string;
  description: string;
  artistNotes: string;
  aiGenerated: boolean;
  audioFile: File | null;
  lat: number;
  lng: number;
}

const STEPS = ["Basics", "Stops", "Pricing", "Review"];

function createEmptyStop(): WalkStop {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    artistNotes: "",
    aiGenerated: false,
    audioFile: null,
    lat: 18.4655,
    lng: -66.1057,
  };
}

export default function CreateWalkPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Basics
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Step 2: Stops
  const [stops, setStops] = useState<WalkStop[]>([createEmptyStop()]);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  // Step 3: Pricing
  const [pricingType, setPricingType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState(5);

  // Publishing
  const [publishing, setPublishing] = useState(false);

  function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  function updateStop(index: number, updates: Partial<WalkStop>) {
    setStops((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  }

  function addStop() {
    setStops((prev) => [...prev, createEmptyStop()]);
    setActiveStopIndex(stops.length);
  }

  function removeStop(index: number) {
    if (stops.length <= 1) return;
    setStops((prev) => prev.filter((_, i) => i !== index));
    setActiveStopIndex(Math.min(activeStopIndex, stops.length - 2));
  }

  async function handleAIPolish(index: number) {
    const stop = stops[index];
    if (!stop.artistNotes.trim()) return;

    setAiLoading(stop.id);
    try {
      const res = await fetch("/api/ai/generate-stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistDescription: stop.artistNotes,
          stopTitle: stop.title || `Stop ${index + 1}`,
          neighborhood: neighborhood || "Puerto Rico",
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      updateStop(index, {
        description: data.polishedDescription,
        aiGenerated: true,
      });
    } catch {
      alert("Failed to generate AI content. Please try again.");
    } finally {
      setAiLoading(null);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    // In production, this would call Supabase to create the walk
    await new Promise((r) => setTimeout(r, 1500));
    setPublishing(false);
    alert("Walk published successfully!");
  }

  function canProceed(): boolean {
    switch (currentStep) {
      case 0:
        return title.trim().length > 0 && neighborhood.length > 0;
      case 1:
        return stops.every((s) => s.title.trim().length > 0);
      case 2:
        return true;
      default:
        return true;
    }
  }

  const activeStop = stops[activeStopIndex];

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <header className="bg-white border-b border-bembe-night/5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/artist/dashboard"
              className="flex items-center gap-2 text-bembe-night/50 hover:text-bembe-night transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span className="text-sm text-bembe-night/40">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  className={`flex items-center gap-2 ${
                    i <= currentStep ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      i < currentStep
                        ? "bg-bembe-teal text-white"
                        : i === currentStep
                        ? "bg-bembe-night text-white"
                        : "bg-bembe-night/10 text-bembe-night/30"
                    }`}
                  >
                    {i < currentStep ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-sm hidden sm:inline ${
                      i === currentStep
                        ? "font-semibold text-bembe-night"
                        : "text-bembe-night/40"
                    }`}
                  >
                    {step}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded ${
                      i < currentStep ? "bg-bembe-teal" : "bg-bembe-night/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Basics */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-bembe-night">
                Walk Basics
              </h2>
              <p className="text-bembe-night/50 mt-1">
                Tell us about your art walk
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-bembe-night/70 mb-1.5"
                >
                  Walk Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Santurce Street Murals Tour"
                  className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-bembe-night/70 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your walk in a few sentences..."
                  className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition resize-none"
                />
              </div>

              {/* Neighborhood */}
              <div>
                <label
                  htmlFor="neighborhood"
                  className="block text-sm font-medium text-bembe-night/70 mb-1.5"
                >
                  Neighborhood
                </label>
                <select
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition appearance-none"
                >
                  <option value="">Select a neighborhood</option>
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                  Cover Image
                </label>
                {coverPreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => {
                        setCoverImage(null);
                        setCoverPreview(null);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-bembe-night/15 bg-bembe-sand/30 cursor-pointer hover:border-bembe-teal/40 hover:bg-bembe-teal/5 transition">
                    <ImageIcon className="w-8 h-8 text-bembe-night/20 mb-2" />
                    <span className="text-sm text-bembe-night/40 font-medium">
                      Click to upload cover image
                    </span>
                    <span className="text-xs text-bembe-night/30 mt-1">
                      JPG, PNG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Stops */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-bembe-night">
                Add Stops
              </h2>
              <p className="text-bembe-night/50 mt-1">
                Each stop is a point of interest on your walk
              </p>
            </div>

            {/* Stop tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {stops.map((stop, i) => (
                <button
                  key={stop.id}
                  onClick={() => setActiveStopIndex(i)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    i === activeStopIndex
                      ? "bg-bembe-night text-white"
                      : "bg-white text-bembe-night/60 hover:bg-white/80"
                  }`}
                >
                  <GripVertical className="w-3 h-3 opacity-40" />
                  Stop {i + 1}
                  {stop.title && (
                    <span className="max-w-[80px] truncate opacity-70">
                      : {stop.title}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={addStop}
                className="flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-bembe-teal/10 text-bembe-teal hover:bg-bembe-teal/20 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stop
              </button>
            </div>

            {/* Active stop editor */}
            {activeStop && (
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-bembe-night">
                    Stop {activeStopIndex + 1}
                  </h3>
                  {stops.length > 1 && (
                    <button
                      onClick={() => removeStop(activeStopIndex)}
                      className="flex items-center gap-1 text-sm text-bembe-coral hover:text-bembe-coral/80 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Stop Title */}
                <div>
                  <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                    Stop Title
                  </label>
                  <input
                    type="text"
                    value={activeStop.title}
                    onChange={(e) =>
                      updateStop(activeStopIndex, { title: e.target.value })
                    }
                    placeholder="e.g. Calle Cerra Murals"
                    className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                    Location
                  </label>
                  <div className="w-full h-40 rounded-xl bg-bembe-sand/50 border border-bembe-night/10 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-6 h-6 text-bembe-night/20 mx-auto mb-1" />
                      <p className="text-sm text-bembe-night/40">
                        Map picker - tap to set location
                      </p>
                      <p className="text-xs text-bembe-night/30 mt-0.5">
                        {activeStop.lat.toFixed(4)},{" "}
                        {activeStop.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Artist Notes for AI */}
                <div className="rounded-xl border-2 border-dashed border-bembe-gold/30 bg-bembe-gold/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-bembe-gold" />
                    <span className="text-sm font-semibold text-bembe-night">
                      Describe this stop in your own words
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={activeStop.artistNotes}
                    onChange={(e) =>
                      updateStop(activeStopIndex, {
                        artistNotes: e.target.value,
                      })
                    }
                    placeholder="Tell us about this place in your own words... What makes it special? What should visitors notice? Any personal stories?"
                    className="w-full px-4 py-3 rounded-xl border border-bembe-gold/20 bg-white text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-gold/30 focus:border-bembe-gold transition resize-none"
                  />
                  <button
                    onClick={() => handleAIPolish(activeStopIndex)}
                    disabled={
                      !activeStop.artistNotes.trim() ||
                      aiLoading === activeStop.id
                    }
                    className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bembe-gold text-bembe-night font-semibold text-sm hover:bg-bembe-gold/90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading === activeStop.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Polishing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Polish with AI
                      </>
                    )}
                  </button>
                </div>

                {/* Polished Description */}
                <div>
                  <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                    Stop Description
                    {activeStop.aiGenerated && (
                      <span className="ml-2 text-xs text-bembe-gold font-normal">
                        AI-polished
                      </span>
                    )}
                  </label>
                  <textarea
                    rows={5}
                    value={activeStop.description}
                    onChange={(e) =>
                      updateStop(activeStopIndex, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Final description for this stop (write manually or use AI polish above)"
                    className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/50 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition resize-none"
                  />
                </div>

                {/* Audio Upload */}
                <div>
                  <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                    Audio Narration
                  </label>
                  {activeStop.audioFile ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-bembe-teal/5 border border-bembe-teal/20">
                      <Mic className="w-5 h-5 text-bembe-teal" />
                      <span className="flex-1 text-sm text-bembe-night truncate">
                        {activeStop.audioFile.name}
                      </span>
                      <button
                        onClick={() =>
                          updateStop(activeStopIndex, { audioFile: null })
                        }
                        className="text-bembe-coral hover:text-bembe-coral/80 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-bembe-night/15 bg-bembe-sand/30 cursor-pointer hover:border-bembe-teal/40 hover:bg-bembe-teal/5 transition">
                      <Upload className="w-4 h-4 text-bembe-night/30" />
                      <span className="text-sm text-bembe-night/40 font-medium">
                        Upload audio file (MP3, WAV)
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateStop(activeStopIndex, { audioFile: file });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Pricing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-bembe-night">Pricing</h2>
              <p className="text-bembe-night/50 mt-1">
                Set your walk price
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
              {/* Pricing Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPricingType("free")}
                  className={`p-5 rounded-xl border-2 text-center transition ${
                    pricingType === "free"
                      ? "border-bembe-teal bg-bembe-teal/5"
                      : "border-bembe-night/10 hover:border-bembe-night/20"
                  }`}
                >
                  <DollarSign
                    className={`w-8 h-8 mx-auto mb-2 ${
                      pricingType === "free"
                        ? "text-bembe-teal"
                        : "text-bembe-night/20"
                    }`}
                  />
                  <span
                    className={`block font-semibold ${
                      pricingType === "free"
                        ? "text-bembe-teal"
                        : "text-bembe-night"
                    }`}
                  >
                    Free
                  </span>
                  <span className="block text-xs text-bembe-night/50 mt-1">
                    Open to everyone
                  </span>
                </button>
                <button
                  onClick={() => setPricingType("paid")}
                  className={`p-5 rounded-xl border-2 text-center transition ${
                    pricingType === "paid"
                      ? "border-bembe-teal bg-bembe-teal/5"
                      : "border-bembe-night/10 hover:border-bembe-night/20"
                  }`}
                >
                  <DollarSign
                    className={`w-8 h-8 mx-auto mb-2 ${
                      pricingType === "paid"
                        ? "text-bembe-teal"
                        : "text-bembe-night/20"
                    }`}
                  />
                  <span
                    className={`block font-semibold ${
                      pricingType === "paid"
                        ? "text-bembe-teal"
                        : "text-bembe-night"
                    }`}
                  >
                    Set a Price
                  </span>
                  <span className="block text-xs text-bembe-night/50 mt-1">
                    Earn from your art
                  </span>
                </button>
              </div>

              {/* Price Slider */}
              {pricingType === "paid" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-bembe-night/70">
                      Walk Price
                    </span>
                    <span className="text-3xl font-bold text-bembe-night">
                      ${price}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-bembe-teal bg-bembe-night/10"
                  />
                  <div className="flex justify-between text-xs text-bembe-night/40">
                    <span>$1</span>
                    <span>$25</span>
                    <span>$50</span>
                  </div>
                  <div className="p-4 rounded-xl bg-bembe-gold/10 border border-bembe-gold/20">
                    <p className="text-sm text-bembe-night/70">
                      <span className="font-semibold">
                        You earn ${(price * 0.85).toFixed(2)}
                      </span>{" "}
                      per walk (85% after platform fee)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-bembe-night">
                Review & Publish
              </h2>
              <p className="text-bembe-night/50 mt-1">
                Everything look good?
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
              {/* Cover + Title */}
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl bg-bembe-teal/10 flex-shrink-0 overflow-hidden">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-bembe-teal/30" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-bembe-night">
                    {title || "Untitled Walk"}
                  </h3>
                  <p className="text-sm text-bembe-night/50 mt-0.5">
                    {neighborhood || "No neighborhood set"}
                  </p>
                  <p className="text-sm font-semibold text-bembe-teal mt-1">
                    {pricingType === "free"
                      ? "Free"
                      : `$${price}`}
                  </p>
                </div>
              </div>

              {description && (
                <p className="text-sm text-bembe-night/60">{description}</p>
              )}

              {/* Stops Summary */}
              <div>
                <h4 className="text-sm font-semibold text-bembe-night/70 mb-3">
                  {stops.length} Stop{stops.length !== 1 ? "s" : ""}
                </h4>
                <div className="space-y-2">
                  {stops.map((stop, i) => (
                    <div
                      key={stop.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-bembe-sand/50"
                    >
                      <div className="w-7 h-7 rounded-full bg-bembe-night text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-bembe-night truncate">
                          {stop.title || `Stop ${i + 1}`}
                        </p>
                        {stop.description && (
                          <p className="text-xs text-bembe-night/40 truncate">
                            {stop.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {stop.audioFile && (
                          <Mic className="w-3.5 h-3.5 text-bembe-teal" />
                        )}
                        {stop.aiGenerated && (
                          <Sparkles className="w-3.5 h-3.5 text-bembe-gold" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Publish button */}
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full py-4 rounded-xl bg-bembe-teal text-white font-bold text-lg hover:bg-bembe-teal/90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-bembe-teal/20"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Publish Walk
                </>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-bembe-night/60 font-medium hover:text-bembe-night hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() =>
                setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))
              }
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-bembe-night text-white font-semibold hover:bg-bembe-night/90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
