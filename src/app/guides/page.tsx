"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { ArrowRight, Video, Film, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  "bembe-teal": { bg: "bg-bembe-teal/10", text: "text-bembe-teal" },
  "bembe-coral": { bg: "bg-bembe-coral/10", text: "text-bembe-coral" },
  "bembe-gold": { bg: "bg-bembe-gold/10", text: "text-bembe-gold" },
};

const guides = [
  {
    slug: "documentary-style",
    icon: Video,
    color: "bembe-teal",
    titleEn: "The Narrator",
    titleEs: "El Narrador",
    subtitleEn: "Documentary & Tour Guide Style",
    subtitleEs: "Estilo Documental y Guia Turistica",
    descEn:
      "Walk your audience through your neighborhood like a personal tour guide. Narrate the history, point out details, and share stories only a local would know.",
    descEs:
      "Guia a tu audiencia por tu barrio como un guia personal. Narra la historia, senala detalles y comparte historias que solo un local conoceria.",
    tagEn: "Best for: History, architecture, cultural landmarks",
    tagEs: "Ideal para: Historia, arquitectura, lugares culturales",
  },
  {
    slug: "cinematic-clips",
    icon: Film,
    color: "bembe-coral",
    titleEn: "The Filmmaker",
    titleEs: "El Cineasta",
    subtitleEn: "Cinematic & Artsy Short Films",
    subtitleEs: "Cortometrajes Cinematograficos y Artisticos",
    descEn:
      "Create beautiful, mood-driven clips that capture the feeling of a place. Think slow pans, golden hour light, and letting the visuals speak.",
    descEs:
      "Crea clips hermosos y atmosfericos que capturen la esencia de un lugar. Piensa en tomas lentas, luz de atardecer y dejar que las imagenes hablen.",
    tagEn: "Best for: Street art, murals, plazas, nature",
    tagEs: "Ideal para: Arte callejero, murales, plazas, naturaleza",
  },
  {
    slug: "asmr-immersive",
    icon: Headphones,
    color: "bembe-gold",
    titleEn: "The Immersive",
    titleEs: "El Inmersivo",
    subtitleEn: "ASMR & Environmental Sound",
    subtitleEs: "ASMR y Sonido Ambiental",
    descEn:
      "Record the raw sounds of daily life — the coqui at night, dominos on a table, rain on zinc rooftops. Let people feel what it's like to live there.",
    descEs:
      "Graba los sonidos reales de la vida diaria — el coqui de noche, dominos en la mesa, lluvia en techos de zinc. Deja que la gente sienta como es vivir ahi.",
    tagEn: "Best for: VR, relaxation, cultural immersion",
    tagEs: "Ideal para: VR, relajacion, inmersion cultural",
  },
];

export default function GuidesPage() {
  const { locale } = useI18n();
  const isEs = locale === "es";

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-bembe-teal mb-3">
            {isEs ? "Guias para Artistas" : "Artist Guides"}
          </p>
          <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl md:text-5xl">
            {isEs
              ? "Tres formas de crear tu caminata"
              : "Three ways to create your walk"}
          </h1>
          <p className="mt-4 text-lg text-bembe-night/60 max-w-2xl mx-auto">
            {isEs
              ? "No necesitas equipo profesional. Solo tu telefono, tu barrio y tu perspectiva unica. Escoge el formato que mejor cuente tu historia."
              : "No professional equipment needed. Just your phone, your neighborhood, and your unique perspective. Pick the format that best tells your story."}
          </p>
        </div>

        {/* Guide cards */}
        <div className="flex flex-col gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-bembe-night/5 hover:shadow-lg hover:border-bembe-night/10 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${COLOR_MAP[guide.color]?.bg || "bg-bembe-teal/10"}`}
                >
                  <guide.icon className={`h-7 w-7 ${COLOR_MAP[guide.color]?.text || "text-bembe-teal"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-bembe-night group-hover:text-bembe-teal transition-colors">
                        {isEs ? guide.titleEs : guide.titleEn}
                      </h2>
                      <p className="text-sm font-medium text-bembe-night/50 mt-0.5">
                        {isEs ? guide.subtitleEs : guide.subtitleEn}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-bembe-night/30 group-hover:text-bembe-teal group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                  <p className="mt-3 text-bembe-night/60 leading-relaxed">
                    {isEs ? guide.descEs : guide.descEn}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-bembe-night/40">
                    {isEs ? guide.tagEs : guide.tagEn}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-bembe-night/50 mb-4">
            {isEs
              ? "Listo para empezar? Crea tu primera caminata hoy."
              : "Ready to start? Create your first walk today."}
          </p>
          <Link
            href="/artist/walks/new"
            className="inline-flex items-center gap-2 rounded-full bg-bembe-teal px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-bembe-teal/25 transition-all hover:bg-bembe-teal/90"
          >
            {isEs ? "Crear Caminata" : "Create a Walk"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
