"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { ArrowLeft, ArrowRight, Headphones, Ear, Sun, Moon, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function AsmrImmersiveGuide() {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bembe-gold/10">
              <Headphones className="h-6 w-6 text-bembe-gold" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-bembe-gold">
                {es ? "Guia #3" : "Guide #3"}
              </span>
              <span className="rounded-full bg-bembe-gold/10 px-2.5 py-0.5 text-[11px] font-bold text-bembe-gold uppercase tracking-wider">
                VR Ready
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl">
            {es ? "El Inmersivo" : "The Immersive"}
          </h1>
          <p className="text-lg text-bembe-night/50 mt-1">
            {es
              ? "ASMR y Sonido Ambiental — Vive un Dia en Puerto Rico"
              : "ASMR & Environmental Sound — Live a Day in Puerto Rico"}
          </p>
        </div>

        {/* Intro */}
        <div className="prose-bembe">
          <p className="text-lg leading-relaxed text-bembe-night/70 mb-4">
            {es
              ? "Este es el formato mas intimo. No narras. No editas para impresionar. Simplemente vives tu dia — y lo grabas. El sonido de la lluvia en tu techo de zinc. Los coquies al atardecer. El sonido de dominos en una mesa de plastico afuera del colmado. El cafe colandose en la manana."
              : "This is the most intimate format. You don't narrate. You don't edit to impress. You simply live your day — and record it. The sound of rain on your zinc roof. The coquis at sunset. The sound of dominoes on a plastic table outside the colmado. The coffee dripping in the morning."}
          </p>
          <p className="text-lg leading-relaxed text-bembe-night/70 mb-8">
            {es
              ? "La idea es darle a alguien en Nueva York, Madrid o Tokio un vistazo de como se siente vivir en Puerto Rico. No la version turistica — la real. Es como ASMR cultural. Y es perfecto para VR y Meta Glasses, donde la gente puede cerrar los ojos y sentir que estan ahi."
              : "The idea is to give someone in New York, Madrid, or Tokyo a glimpse of what it feels like to live in Puerto Rico. Not the tourist version — the real one. It's like cultural ASMR. And it's perfect for VR and Meta Glasses, where people can close their eyes and feel like they're there."}
          </p>

          <div className="rounded-2xl bg-bembe-gold/5 border border-bembe-gold/10 p-6 mb-10">
            <p className="text-bembe-night/70 leading-relaxed italic">
              {es
                ? "\"El lujo mas grande del mundo moderno es la experiencia de otro lugar. No solo verlo — sentirlo. Oir sus ritmos. Oler su aire.\" Este formato convierte tu vida cotidiana en ese lujo."
                : "\"The greatest luxury of the modern world is the experience of another place. Not just seeing it — feeling it. Hearing its rhythms. Smelling its air.\" This format turns your daily life into that luxury."}
            </p>
          </div>

          {/* What you need */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-gold/10 text-sm font-bold text-bembe-gold">1</span>
            {es ? "Lo que necesitas" : "What you need"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {[
              { icon: "📱", en: "A smartphone (video + audio recording)", es: "Un smartphone (grabacion de video + audio)" },
              { icon: "🎙️", en: "An external mic is highly recommended — binaural/stereo mics are ideal for ASMR ($20-40)", es: "Un mic externo es muy recomendado — mics binaural/stereo son ideales para ASMR ($20-40)" },
              { icon: "🎧", en: "Good headphones to monitor your audio while recording", es: "Buenos audifonos para monitorear tu audio mientras grabas" },
              { icon: "⏰", en: "A full day (or a few hours across morning, afternoon, night)", es: "Un dia completo (o varias horas entre manana, tarde y noche)" },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3 rounded-xl bg-white p-4 border border-bembe-night/5">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-bembe-night/70">{es ? item.es : item.en}</span>
              </div>
            ))}
          </div>

          {/* The concept */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-gold/10 text-sm font-bold text-bembe-gold">2</span>
            {es ? "El concepto: Un dia en tu vida" : "The concept: A day in your life"}
          </h2>
          <p className="text-bembe-night/70 leading-relaxed mb-4">
            {es
              ? "Tu walk es un dia completo, dividido en momentos. No necesitas hacer nada especial — ese es el punto. La vida cotidiana en Puerto Rico ya es extraordinaria para alguien que no la conoce."
              : "Your walk is a full day, divided into moments. You don't need to do anything special — that's the point. Daily life in Puerto Rico is already extraordinary to someone who doesn't know it."}
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                icon: Sun,
                periodEn: "Morning (La Manana)",
                periodEs: "La Manana",
                momentsEn: [
                  "Wake up. The sound of your fan turning off, birds outside, maybe a rooster",
                  "Making coffee — the sound of the greca on the stove, water boiling, pouring",
                  "Stepping outside — the humidity hits, neighborhood sounds start up",
                  "Walking to the bakery — footsteps, a distant radio, someone sweeping",
                ],
                momentsEs: [
                  "Despertar. El sonido del abanico apagandose, pajaros afuera, quizas un gallo",
                  "Haciendo cafe — el sonido de la greca en la estufa, agua hirviendo, sirviendo",
                  "Salir afuera — la humedad pega, los sonidos del barrio empiezan",
                  "Caminar a la panaderia — pasos, una radio lejana, alguien barriendo",
                ],
              },
              {
                icon: Sun,
                periodEn: "Afternoon (La Tarde)",
                periodEs: "La Tarde",
                momentsEn: [
                  "The neighborhood at peak activity — cars, conversations, music from houses",
                  "A walk through the plaza — kids playing, pigeons, a fountain if there is one",
                  "Stopping at a chinchorro or kiosk — the sound of frying, laughter, a TV playing",
                  "The afternoon rain — it starts suddenly, water on rooftops, streets, leaves",
                ],
                momentsEs: [
                  "El barrio en maxima actividad — carros, conversaciones, musica de las casas",
                  "Una caminata por la plaza — ninos jugando, palomas, una fuente si hay",
                  "Parando en un chinchorro o kiosco — el sonido de freir, risas, una TV prendida",
                  "La lluvia de la tarde — empieza de repente, agua en techos, calles, hojas",
                ],
              },
              {
                icon: Moon,
                periodEn: "Evening & Night (La Noche)",
                periodEs: "La Noche",
                momentsEn: [
                  "Sunset — the light changes, the coquis start one by one until they're everywhere",
                  "Sitting on the balcony — neighbors talking, distant music, a dog barking",
                  "Night sounds — the full coqui chorus, crickets, maybe a generator humming",
                  "The neighborhood going quiet — last car door, last conversation, then peace",
                ],
                momentsEs: [
                  "Atardecer — la luz cambia, los coquies empiezan uno por uno hasta que estan en todos lados",
                  "Sentado en el balcon — vecinos hablando, musica lejana, un perro ladrando",
                  "Sonidos nocturnos — el coro completo de coquies, grillos, quizas un generador",
                  "El barrio quedandose en silencio — ultima puerta de carro, ultima conversacion, luego paz",
                ],
              },
            ].map((period) => (
              <div key={period.periodEn} className="rounded-xl bg-white border border-bembe-night/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <period.icon className="h-4 w-4 text-bembe-gold" />
                  <span className="text-sm font-bold text-bembe-gold">
                    {es ? period.periodEs : period.periodEn}
                  </span>
                </div>
                <ul className="space-y-2">
                  {(es ? period.momentsEs : period.momentsEn).map((moment) => (
                    <li key={moment} className="flex items-start gap-2">
                      <span className="text-bembe-gold/40 mt-1.5 text-[8px]">●</span>
                      <span className="text-sm text-bembe-night/70">{moment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Recording tips */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-gold/10 text-sm font-bold text-bembe-gold">3</span>
            {es ? "Como grabar sonido inmersivo" : "How to record immersive sound"}
          </h2>

          <div className="rounded-2xl bg-bembe-teal/5 border border-bembe-teal/10 p-5 mb-6">
            <div className="flex items-start gap-3">
              <Ear className="h-5 w-5 text-bembe-teal shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-bembe-night text-sm">
                  {es ? "La regla de oro del ASMR" : "The golden rule of ASMR"}
                </p>
                <p className="text-sm text-bembe-night/60 mt-1">
                  {es
                    ? "Graba mas largo de lo que piensas. Un momento de 2 minutos de solo coquies suena aburrido cuando lo grabas — pero cuando alguien lo escucha con audifonos en su apartamento de Brooklyn, es magia."
                    : "Record longer than you think. A 2-minute moment of just coquis sounds boring when you're recording — but when someone listens with headphones in their Brooklyn apartment, it's magic."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              { en: "Hold your phone still. Movement creates wind noise and rustling.", es: "Mantene tu telefono quieto. El movimiento crea ruido de viento y roce." },
              { en: "Record 3-5 minutes per moment, even if you'll only use 60 seconds.", es: "Graba 3-5 minutos por momento, aunque solo uses 60 segundos." },
              { en: "Get close to the sound source — the greca, the domino table, the rain.", es: "Acercate a la fuente de sonido — la greca, la mesa de dominos, la lluvia." },
              { en: "Don't talk. Don't whisper. Let the environment be the entire soundtrack.", es: "No hables. No susurres. Deja que el ambiente sea toda la banda sonora." },
              { en: "Record video at the same time — even if the visual is simple, it adds presence.", es: "Graba video al mismo tiempo — aunque lo visual sea simple, agrega presencia." },
              { en: "For VR: record in landscape (horizontal) and keep the camera at eye level.", es: "Para VR: graba en paisaje (horizontal) y manten la camara a nivel de los ojos." },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-bembe-gold shrink-0 mt-1" />
                <span className="text-sm text-bembe-night/70">{es ? item.es : item.en}</span>
              </div>
            ))}
          </div>

          {/* Editing */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-gold/10 text-sm font-bold text-bembe-gold">4</span>
            {es ? "Edicion: Menos es todo" : "Editing: Less is everything"}
          </h2>
          <p className="text-bembe-night/70 leading-relaxed mb-4">
            {es
              ? "Este formato requiere la menor edicion de los tres. Eso es lo bello. Tu trabajo en la edicion es simplemente seleccionar los mejores momentos y ponerlos en orden."
              : "This format requires the least editing of the three. That's the beauty. Your editing job is simply to select the best moments and put them in order."}
          </p>

          <div className="space-y-3 mb-8">
            {[
              { en: "No background music. The environment IS the music.", es: "Sin musica de fondo. El ambiente ES la musica." },
              { en: "Keep each moment 30 seconds to 3 minutes. Let it breathe.", es: "Mantene cada momento de 30 segundos a 3 minutos. Dejalo respirar." },
              { en: "Use simple fades between moments — a gentle transition, like waking up.", es: "Usa fades simples entre momentos — una transicion gentil, como despertar." },
              { en: "Add minimal text: the time of day, the place, nothing else.", es: "Agrega texto minimo: la hora del dia, el lugar, nada mas." },
              { en: "Total walk length: 15-30 minutes. This is meant to be a meditation.", es: "Duracion total del walk: 15-30 minutos. Esto esta pensado como una meditacion." },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-bembe-gold shrink-0 mt-1" />
                <span className="text-sm text-bembe-night/70">{es ? item.es : item.en}</span>
              </div>
            ))}
          </div>

          {/* VR section */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-gold/10 text-sm font-bold text-bembe-gold">5</span>
            {es ? "Preparado para VR" : "VR-ready"}
          </h2>
          <div className="rounded-2xl bg-gradient-to-br from-bembe-night to-bembe-night/90 p-6 mb-8">
            <p className="text-white/80 leading-relaxed mb-4">
              {es
                ? "Este formato es perfecto para VR y Meta Glasses. Cuando alguien se pone unos lentes y escucha los coquies mientras ve tu balcon al atardecer, no esta viendo un video — esta teniendo una experiencia. Esta ahi."
                : "This format is perfect for VR and Meta Glasses. When someone puts on a headset and hears the coquis while seeing your balcony at sunset, they're not watching a video — they're having an experience. They're there."}
            </p>
            <p className="text-white/60 text-sm">
              {es
                ? "Para grabaciones VR-ready: usa la camara horizontal, evita movimientos bruscos, y si tienes acceso a una camara 360, aun mejor. Pero un telefono grabando un momento tranquilo en tu balcon ya es poderoso."
                : "For VR-ready recordings: use landscape orientation, avoid sudden movements, and if you have access to a 360 camera, even better. But a phone recording a quiet moment on your balcony is already powerful."}
            </p>
          </div>

          {/* Ideas */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-gold/10 text-sm font-bold text-bembe-gold">6</span>
            {es ? "Ideas para tu primer walk inmersivo" : "Ideas for your first immersive walk"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {[
              { en: "\"A day in Loiza\" — from morning roosters to nighttime bomba drums", es: "\"Un dia en Loiza\" — desde los gallos de la manana hasta los tambores de bomba de noche" },
              { en: "\"Rain season\" — the sounds of a tropical storm passing through", es: "\"Temporada de lluvia\" — los sonidos de una tormenta tropical pasando" },
              { en: "\"Sunday at abuela's\" — the kitchen sounds, the family, the TV, the backyard", es: "\"Domingo en casa de abuela\" — los sonidos de cocina, la familia, la TV, el patio" },
              { en: "\"The beach at 6am\" — waves, birds, no people, just ocean", es: "\"La playa a las 6am\" — olas, pajaros, sin gente, solo oceano" },
              { en: "\"Coffee country\" — a morning in the mountains, fog, roosters, nature", es: "\"Tierra del cafe\" — una manana en la montana, neblina, gallos, naturaleza" },
              { en: "\"Festival night\" — the approach, the crowd, the music getting louder", es: "\"Noche de festival\" — la llegada, la multitud, la musica subiendo de volumen" },
            ].map((idea) => (
              <div key={idea.en} className="rounded-xl bg-bembe-gold/5 border border-bembe-gold/10 px-4 py-3">
                <p className="text-sm text-bembe-night/70">{es ? idea.es : idea.en}</p>
              </div>
            ))}
          </div>

          {/* Final note */}
          <div className="rounded-2xl bg-bembe-gold/5 border border-bembe-gold/10 p-6">
            <p className="text-bembe-night/70 leading-relaxed">
              {es
                ? "Recuerda: no necesitas una vida \"interesante\". Tu vida normal en Puerto Rico — la greca, los coquies, el vecino poniendo salsa, la lluvia de las 3pm — eso es exactamente lo que alguien del otro lado del mundo pagaria por experimentar. Tu cotidianidad es el contenido."
                : "Remember: you don't need an \"interesting\" life. Your normal life in Puerto Rico — the greca, the coquis, the neighbor playing salsa, the 3pm rain — that's exactly what someone on the other side of the world would pay to experience. Your everyday is the content."}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-14 flex items-center justify-between border-t border-bembe-night/5 pt-8">
          <Link
            href="/guides/cinematic-clips"
            className="inline-flex items-center gap-2 text-sm font-semibold text-bembe-teal hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {es ? "Anterior: El Cineasta" : "Previous: The Filmmaker"}
          </Link>
          <Link
            href="/artist/walks/new"
            className="inline-flex items-center gap-2 rounded-full bg-bembe-teal px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-bembe-teal/25 transition-all hover:bg-bembe-teal/90"
          >
            {es ? "Crear mi Walk" : "Create my Walk"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
