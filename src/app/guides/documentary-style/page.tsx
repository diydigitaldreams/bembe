"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { ArrowLeft, ArrowRight, Video, MapPin, Mic, Clock, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function DocumentaryStyleGuide() {
  const { locale } = useI18n();
  const es = locale === "es";

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-bembe-teal hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {es ? "Todas las guias" : "All guides"}
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bembe-teal/10">
              <Video className="h-6 w-6 text-bembe-teal" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-bembe-teal">
              {es ? "Guia #1" : "Guide #1"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl">
            {es ? "El Narrador" : "The Narrator"}
          </h1>
          <p className="text-lg text-bembe-night/50 mt-1">
            {es
              ? "Estilo Documental y Guia Turistica"
              : "Documentary & Tour Guide Style"}
          </p>
        </div>

        {/* Intro */}
        <div className="prose-bembe">
          <p className="text-lg leading-relaxed text-bembe-night/70 mb-8">
            {es
              ? "Imagina que un amigo te visita por primera vez. Le llevas por tu barrio, le cuentas la historia de cada esquina, le senales el mural que pintaron el verano pasado, le explicas por que esa panaderia lleva 40 anos ahi. Eso es exactamente lo que vas a hacer — pero grabado, para que miles de personas puedan vivir esa experiencia."
              : "Imagine a friend is visiting for the first time. You walk them through your neighborhood, tell them the story behind every corner, point out the mural painted last summer, explain why that bakery has been there for 40 years. That's exactly what you're going to do — but recorded, so thousands of people can live that experience."}
          </p>

          {/* What you need */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-teal/10 text-sm font-bold text-bembe-teal">1</span>
            {es ? "Lo que necesitas" : "What you need"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {[
              { icon: "📱", en: "A smartphone (any recent model works)", es: "Un smartphone (cualquier modelo reciente sirve)" },
              { icon: "🎙️", en: "A clip-on mic or earbuds with mic ($10-15)", es: "Un microfono de clip o audifonos con mic ($10-15)" },
              { icon: "📍", en: "A route with 4-8 interesting stops", es: "Una ruta con 4-8 paradas interesantes" },
              { icon: "📝", en: "Bullet points for each stop (not a full script)", es: "Puntos clave para cada parada (no un guion completo)" },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3 rounded-xl bg-white p-4 border border-bembe-night/5">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-bembe-night/70">{es ? item.es : item.en}</span>
              </div>
            ))}
          </div>

          {/* Planning your route */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-teal/10 text-sm font-bold text-bembe-teal">2</span>
            {es ? "Planifica tu ruta" : "Plan your route"}
          </h2>
          <p className="text-bembe-night/70 leading-relaxed mb-4">
            {es
              ? "Camina la ruta tu solo primero. Toma notas mentales de lo que te llama la atencion. Piensa en el flujo — cada parada debe conectar naturalmente con la siguiente. Un buen walk tiene entre 4 y 8 paradas y dura entre 30 y 60 minutos."
              : "Walk the route by yourself first. Take mental notes of what catches your attention. Think about the flow — each stop should connect naturally to the next. A good walk has 4 to 8 stops and lasts 30 to 60 minutes."}
          </p>
          <div className="rounded-2xl bg-bembe-teal/5 border border-bembe-teal/10 p-5 mb-8">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-bembe-teal shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-bembe-night text-sm">
                  {es ? "Consejo de ruta" : "Route tip"}
                </p>
                <p className="text-sm text-bembe-night/60 mt-1">
                  {es
                    ? "Empieza y termina en un lugar con sombra y donde la gente pueda sentarse. Tus caminantes te lo agradeceran. Evita cruces peligrosos y tramos sin acera."
                    : "Start and end at a spot with shade where people can sit down. Your walkers will thank you. Avoid dangerous crossings and stretches without sidewalks."}
                </p>
              </div>
            </div>
          </div>

          {/* Recording */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-teal/10 text-sm font-bold text-bembe-teal">3</span>
            {es ? "Grabacion" : "Recording"}
          </h2>
          <p className="text-bembe-night/70 leading-relaxed mb-4">
            {es
              ? "No intentes ser perfecto. La magia esta en que suenas real, como alguien que de verdad vive ahi. Habla como si le explicaras a un amigo, no como un presentador de television."
              : "Don't try to be perfect. The magic is in sounding real, like someone who actually lives there. Talk like you're explaining to a friend, not like a TV presenter."}
          </p>

          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-bembe-night">
              {es ? "Para cada parada:" : "For each stop:"}
            </h3>
            {[
              { en: "Film for 2-5 minutes — show what you're talking about", es: "Graba 2-5 minutos — muestra de lo que hablas" },
              { en: "Start wide (establishing shot), then go close on details", es: "Empieza amplio (toma de contexto), luego acercate a los detalles" },
              { en: "Narrate while filming — tell us what we're seeing and why it matters", es: "Narra mientras grabas — dinos que estamos viendo y por que importa" },
              { en: "Share a personal memory or story connected to the place", es: "Comparte un recuerdo o historia personal conectada al lugar" },
              { en: "Pause between stops — these become natural transitions", es: "Pausa entre paradas — estas se convierten en transiciones naturales" },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-bembe-teal shrink-0 mt-1" />
                <span className="text-sm text-bembe-night/70">{es ? item.es : item.en}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-bembe-coral/5 border border-bembe-coral/10 p-5 mb-8">
            <div className="flex items-start gap-3">
              <Mic className="h-5 w-5 text-bembe-coral shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-bembe-night text-sm">
                  {es ? "Audio importa mas que video" : "Audio matters more than video"}
                </p>
                <p className="text-sm text-bembe-night/60 mt-1">
                  {es
                    ? "La gente perdona video movido pero no perdona audio malo. Usa un mic externo, habla claro, y graba en un momento tranquilo del dia. Si pasa una guagua, espera a que pase."
                    : "People forgive shaky video but won't forgive bad audio. Use an external mic, speak clearly, and record during a quiet moment. If a bus passes, wait for it to pass."}
                </p>
              </div>
            </div>
          </div>

          {/* Structure */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-teal/10 text-sm font-bold text-bembe-teal">4</span>
            {es ? "Estructura sugerida" : "Suggested structure"}
          </h2>

          <div className="space-y-4 mb-8">
            {[
              {
                timeEn: "Opening (1-2 min)",
                timeEs: "Apertura (1-2 min)",
                en: "Introduce yourself and the neighborhood. Set the vibe — why is this place special to you? \"My name is Yara, and I've lived in Santurce for 15 years. Today I'm going to show you the Santurce I know.\"",
                es: "Presentate y presenta el barrio. Establece el ambiente — por que este lugar es especial para ti? \"Me llamo Yara y llevo 15 anos viviendo en Santurce. Hoy les voy a ensenar el Santurce que yo conozco.\"",
              },
              {
                timeEn: "Stops (2-5 min each)",
                timeEs: "Paradas (2-5 min cada una)",
                en: "At each stop: what are we looking at, what's the history, what's your personal connection. Mix facts with feelings. \"See that yellow building? That used to be a rum warehouse in the 1940s...\"",
                es: "En cada parada: que estamos viendo, cual es la historia, cual es tu conexion personal. Mezcla datos con sentimientos. \"Ven ese edificio amarillo? Eso era un almacen de ron en los 1940s...\"",
              },
              {
                timeEn: "Transitions (30 sec)",
                timeEs: "Transiciones (30 seg)",
                en: "Walk with your camera, showing the path between stops. Let the ambient sound breathe. \"As we walk down this street, notice the balconies...\"",
                es: "Camina con tu camara, mostrando el camino entre paradas. Deja que el sonido ambiente respire. \"Mientras caminamos por esta calle, fijense en los balcones...\"",
              },
              {
                timeEn: "Closing (1 min)",
                timeEs: "Cierre (1 min)",
                en: "Thank people for walking with you. Share one last thought about the neighborhood. Leave them with a feeling.",
                es: "Agradece a la gente por caminar contigo. Comparte un ultimo pensamiento sobre el barrio. Dejalos con un sentimiento.",
              },
            ].map((section) => (
              <div key={section.timeEn} className="rounded-xl bg-white border border-bembe-night/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-bembe-teal" />
                  <span className="text-sm font-bold text-bembe-teal">
                    {es ? section.timeEs : section.timeEn}
                  </span>
                </div>
                <p className="text-sm text-bembe-night/70 leading-relaxed">
                  {es ? section.es : section.en}
                </p>
              </div>
            ))}
          </div>

          {/* Examples */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-teal/10 text-sm font-bold text-bembe-teal">5</span>
            {es ? "Ideas para tu primer walk" : "Ideas for your first walk"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {[
              { en: "\"My block\" — the 5 spots that define your daily life", es: "\"Mi cuadra\" — los 5 lugares que definen tu dia a dia" },
              { en: "\"Before & after\" — how a neighborhood has changed", es: "\"Antes y despues\" — como ha cambiado un barrio" },
              { en: "\"The food walk\" — bakeries, chinchorreos, kiosks", es: "\"La ruta de la comida\" — panaderias, chinchorreos, kioscos" },
              { en: "\"Hidden gems\" — places tourists would never find", es: "\"Joyas escondidas\" — lugares que turistas nunca encontrarian" },
              { en: "\"The history walk\" — colonial buildings, historic sites", es: "\"La ruta historica\" — edificios coloniales, sitios historicos" },
              { en: "\"The art walk\" — murals, galleries, studios", es: "\"La ruta del arte\" — murales, galerias, estudios" },
            ].map((idea) => (
              <div key={idea.en} className="rounded-xl bg-bembe-gold/5 border border-bembe-gold/10 px-4 py-3">
                <p className="text-sm text-bembe-night/70">{es ? idea.es : idea.en}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-14 flex items-center justify-between border-t border-bembe-night/5 pt-8">
          <Link
            href="/guides"
            className="text-sm font-medium text-bembe-night/50 hover:text-bembe-teal transition-colors"
          >
            {es ? "Todas las guias" : "All guides"}
          </Link>
          <Link
            href="/guides/cinematic-clips"
            className="inline-flex items-center gap-2 text-sm font-semibold text-bembe-teal hover:underline"
          >
            {es ? "Siguiente: El Cineasta" : "Next: The Filmmaker"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
