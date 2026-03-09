import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  Headphones,
  BarChart3,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "For Artists — Earn with Bembe",
  description:
    "Create audio art walks in Puerto Rico and earn 88% of every sale. Join Bembe's community of local artists, storytellers, and musicians.",
  openGraph: {
    title: "For Artists — Earn with Bembe",
    description:
      "Create audio art walks and earn 88% of every sale. Join Puerto Rico's artist community on Bembe.",
  },
};

const benefits = [
  {
    icon: DollarSign,
    titleEn: "Keep 88% of every sale",
    titleEs: "Quédate con el 88% de cada venta",
    descEn: "We only take a 12% platform fee. The rest goes directly to you via Stripe.",
    descEs: "Solo tomamos 12% de comisión. El resto va directo a ti por Stripe.",
  },
  {
    icon: Headphones,
    titleEn: "Easy audio walk creator",
    titleEs: "Creador de caminatas fácil",
    descEn: "Upload audio, set GPS stops, add descriptions — publish in minutes.",
    descEs: "Sube audio, marca paradas GPS, agrega descripciones — publica en minutos.",
  },
  {
    icon: BarChart3,
    titleEn: "Real-time analytics",
    titleEs: "Analíticas en tiempo real",
    descEn: "Track plays, revenue, and listener engagement from your artist dashboard.",
    descEs: "Monitorea reproducciones, ingresos y participación desde tu panel de artista.",
  },
  {
    icon: MapPin,
    titleEn: "GPS-guided experiences",
    titleEs: "Experiencias guiadas por GPS",
    descEn: "Your walks auto-play as walkers reach each stop. True immersive storytelling.",
    descEs: "Tus caminatas se reproducen automáticamente al llegar a cada parada.",
  },
  {
    icon: Users,
    titleEn: "Growing community",
    titleEs: "Comunidad en crecimiento",
    descEn: "Join muralists, musicians, historians, and storytellers sharing Puerto Rico's culture.",
    descEs: "Únete a muralistas, músicos, historiadores y narradores compartiendo la cultura boricua.",
  },
];

const steps = [
  { numEs: "1", titleEs: "Crea tu perfil de artista", titleEn: "Create your artist profile" },
  { numEs: "2", titleEs: "Diseña tu caminata de audio", titleEn: "Design your audio walk" },
  { numEs: "3", titleEs: "Publica y empieza a ganar", titleEn: "Publish and start earning" },
];

export default function ForArtistsPage() {
  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bembe-night to-bembe-night/90">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-bembe-teal/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-bembe-gold/15 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-bembe-gold/20 text-bembe-gold text-sm font-medium mb-6">
            88% revenue share
          </span>
          <h1 className="text-4xl font-extrabold text-white leading-tight sm:text-5xl lg:text-6xl">
            Tu arte, tu isla,{" "}
            <span className="text-bembe-teal">tus ganancias</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60 leading-relaxed">
            Crea caminatas de audio inmersivas por Puerto Rico. Comparte tu historia, conecta con caminantes de todo el mundo, y gana dinero haciendo lo que amas.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup?role=artist"
              className="inline-flex items-center gap-2 rounded-full bg-bembe-teal px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-bembe-teal/25 transition-all hover:bg-bembe-teal/90"
            >
              Comenzar a crear
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/earn"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/40"
            >
              Ver detalles de ganancias
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-bold text-bembe-night text-center mb-12 sm:text-3xl">
          Por qué los artistas eligen Bembe
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.titleEs} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-bembe-teal/10 flex items-center justify-center mb-4">
                <b.icon className="h-6 w-6 text-bembe-teal" />
              </div>
              <h3 className="font-bold text-bembe-night mb-2">{b.titleEs}</h3>
              <p className="text-sm text-bembe-night/60 leading-relaxed">{b.descEs}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/60">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-bembe-night mb-12 sm:text-3xl">
            Tres pasos para empezar
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.numEs} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-bembe-teal text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step.numEs}
                </div>
                <p className="font-semibold text-bembe-night">{step.titleEs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue breakdown */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="bg-gradient-to-br from-bembe-teal to-emerald-600 rounded-3xl p-8 sm:p-12 text-white">
          <h2 className="text-2xl font-bold mb-6 sm:text-3xl">División de ingresos</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-4xl font-extrabold mb-2">88%</p>
              <p className="text-white/80">Para ti, el artista</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white/50 shrink-0" /> Ventas de caminatas</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white/50 shrink-0" /> 100% de propinas</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white/50 shrink-0" /> Suscripciones de fans</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-4xl font-extrabold mb-2">12%</p>
              <p className="text-white/80">Comisión de plataforma</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white/50 shrink-0" /> Hosting y mapas GPS</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white/50 shrink-0" /> Procesamiento de pagos</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white/50 shrink-0" /> Marketing y soporte</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bembe-night">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Comparte tu Puerto Rico con el mundo
          </h2>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">
            Únete a la comunidad de artistas que están transformando la isla en un museo al aire libre.
          </p>
          <Link
            href="/signup?role=artist"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-bembe-gold px-8 py-3.5 text-base font-bold text-bembe-night shadow-lg transition-all hover:shadow-xl"
          >
            Crear mi cuenta de artista
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
