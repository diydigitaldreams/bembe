"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { ArrowLeft, ArrowRight, Film, Clapperboard, Palette, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function CinematicClipsGuide() {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bembe-coral/10">
              <Film className="h-6 w-6 text-bembe-coral" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-bembe-coral">
              {es ? "Guia #2" : "Guide #2"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl">
            {es ? "El Cineasta" : "The Filmmaker"}
          </h1>
          <p className="text-lg text-bembe-night/50 mt-1">
            {es
              ? "Cortometrajes Cinematograficos y Artisticos"
              : "Cinematic & Artsy Short Films"}
          </p>
        </div>

        {/* Intro */}
        <div className="prose-bembe">
          <p className="text-lg leading-relaxed text-bembe-night/70 mb-8">
            {es
              ? "Este formato no es sobre informar — es sobre hacer sentir. Piensa en esos videos que ves en Instagram donde alguien camina por una calle bonita con la luz perfecta y de repente quieres estar ahi. Eso es lo que vamos a crear. Clips cortos, visuales potentes, con musica o sonido ambiental que te transportan."
              : "This format isn't about informing — it's about making people feel. Think of those Instagram videos where someone walks down a beautiful street with perfect light and suddenly you want to be there. That's what we're creating. Short clips, powerful visuals, with music or ambient sound that transport you."}
          </p>

          {/* Philosophy */}
          <div className="rounded-2xl bg-bembe-coral/5 border border-bembe-coral/10 p-6 mb-10">
            <p className="text-bembe-night/70 leading-relaxed italic">
              {es
                ? "\"No me digas que la luna brilla; muestrame el reflejo de luz en un cristal roto.\" — Anton Chekhov. Ese es el principio de este formato. No narres. Muestra."
                : "\"Don't tell me the moon is shining; show me the glint of light on broken glass.\" — Anton Chekhov. That's the principle of this format. Don't narrate. Show."}
            </p>
          </div>

          {/* What you need */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-coral/10 text-sm font-bold text-bembe-coral">1</span>
            {es ? "Lo que necesitas" : "What you need"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {[
              { icon: "📱", en: "A smartphone with good camera (most phones from 2022+ work great)", es: "Un smartphone con buena camara (la mayoria de los telefonos del 2022+ sirven)" },
              { icon: "🤳", en: "A simple gimbal or steady hands (optional but helps)", es: "Un gimbal simple o manos firmes (opcional pero ayuda)" },
              { icon: "🎵", en: "Royalty-free music or your own ambient recordings", es: "Musica libre de derechos o tus propias grabaciones ambientales" },
              { icon: "✂️", en: "A free editing app (CapCut, InShot, or iMovie)", es: "Una app de edicion gratis (CapCut, InShot, o iMovie)" },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3 rounded-xl bg-white p-4 border border-bembe-night/5">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-bembe-night/70">{es ? item.es : item.en}</span>
              </div>
            ))}
          </div>

          {/* Shot types */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-coral/10 text-sm font-bold text-bembe-coral">2</span>
            {es ? "Las tomas que necesitas" : "The shots you need"}
          </h2>
          <p className="text-bembe-night/70 leading-relaxed mb-4">
            {es
              ? "Cada parada de tu walk se compone de 3-5 clips cortos (5-15 segundos cada uno) que cuentan una historia visual. Aqui van los tipos de tomas:"
              : "Each stop on your walk is made up of 3-5 short clips (5-15 seconds each) that tell a visual story. Here are the shot types:"}
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                nameEn: "The Establishing Shot",
                nameEs: "La Toma de Contexto",
                en: "Wide angle. Show the whole scene — the street, the building, the plaza. This tells the viewer where they are. Walk slowly into the scene or pan from one side to the other.",
                es: "Angulo amplio. Muestra toda la escena — la calle, el edificio, la plaza. Esto le dice al espectador donde esta. Camina lentamente hacia la escena o haz un paneo de un lado al otro.",
              },
              {
                nameEn: "The Detail Shot",
                nameEs: "La Toma de Detalle",
                en: "Get close. A hand painting a mural. The texture of an old wall. Steam rising from a coffee cup. The tiles on a floor. These are the shots that make people stop scrolling.",
                es: "Acercate. Una mano pintando un mural. La textura de una pared vieja. El vapor subiendo de una taza de cafe. Las losetas de un piso. Estas son las tomas que hacen a la gente dejar de scrollear.",
              },
              {
                nameEn: "The Walk-Through",
                nameEs: "La Caminata",
                en: "Point your camera forward and walk. Through an alley, under an archway, down a colorful street. Keep it steady. This is the shot that makes the viewer feel like they're there.",
                es: "Apunta tu camara hacia adelante y camina. Por un callejon, bajo un arco, por una calle colorida. Mantenlo estable. Esta es la toma que hace sentir al espectador que esta ahi.",
              },
              {
                nameEn: "The People Shot",
                nameEs: "La Toma de Gente",
                en: "Capture life happening — always respectfully and from a distance if needed. A musician playing on a corner. Kids running through a plaza. A vendor arranging fruit. Don't stage it.",
                es: "Captura la vida sucediendo — siempre con respeto y de lejos si es necesario. Un musico tocando en una esquina. Ninos corriendo en una plaza. Un vendedor arreglando frutas. No lo montes.",
              },
              {
                nameEn: "The Golden Shot",
                nameEs: "La Toma Dorada",
                en: "That one perfect moment. Sunset hitting a wall just right. A cat sitting in a doorway framed perfectly. Rain on cobblestones. You can't plan these — but you can be ready for them.",
                es: "Ese momento perfecto. El atardecer pegando en una pared justo asi. Un gato sentado en una puerta enmarcado perfectamente. Lluvia en adoquines. No puedes planificar estos — pero puedes estar listo.",
              },
            ].map((shot) => (
              <div key={shot.nameEn} className="rounded-xl bg-white border border-bembe-night/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clapperboard className="h-4 w-4 text-bembe-coral" />
                  <span className="text-sm font-bold text-bembe-coral">
                    {es ? shot.nameEs : shot.nameEn}
                  </span>
                </div>
                <p className="text-sm text-bembe-night/70 leading-relaxed">
                  {es ? shot.es : shot.en}
                </p>
              </div>
            ))}
          </div>

          {/* Editing */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-coral/10 text-sm font-bold text-bembe-coral">3</span>
            {es ? "Edicion" : "Editing"}
          </h2>
          <p className="text-bembe-night/70 leading-relaxed mb-4">
            {es
              ? "La edicion es donde todo se une. Menos es mas. No necesitas transiciones locas ni efectos. Lo que necesitas es ritmo."
              : "Editing is where everything comes together. Less is more. You don't need crazy transitions or effects. What you need is rhythm."}
          </p>

          <div className="space-y-3 mb-8">
            {[
              { en: "Cut each clip to 5-10 seconds. If a shot isn't beautiful, cut it.", es: "Corta cada clip a 5-10 segundos. Si una toma no es hermosa, eliminala." },
              { en: "Use simple cuts — no wipes, no star transitions. Just cut.", es: "Usa cortes simples — sin wipes, sin transiciones de estrella. Solo corta." },
              { en: "Add music that matches the mood. Chill for peaceful spots, upbeat for vibrant streets.", es: "Agrega musica que combine con el mood. Chill para lugares tranquilos, upbeat para calles vibrantes." },
              { en: "Lower the music volume enough to hear ambient sounds underneath.", es: "Baja el volumen de la musica lo suficiente para escuchar sonidos ambientales debajo." },
              { en: "Add minimal text if needed — location name, a short phrase. Keep it clean.", es: "Agrega texto minimo si es necesario — nombre del lugar, una frase corta. Mantenlo limpio." },
              { en: "Final length per stop: 30-90 seconds. Keep it tight.", es: "Duracion final por parada: 30-90 segundos. Mantenlo conciso." },
            ].map((item) => (
              <div key={item.en} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-bembe-coral shrink-0 mt-1" />
                <span className="text-sm text-bembe-night/70">{es ? item.es : item.en}</span>
              </div>
            ))}
          </div>

          {/* Visual mood */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-coral/10 text-sm font-bold text-bembe-coral">4</span>
            {es ? "Creando un mood visual" : "Creating a visual mood"}
          </h2>

          <div className="rounded-2xl bg-white border border-bembe-night/5 p-6 mb-8">
            <div className="flex items-start gap-3">
              <Palette className="h-5 w-5 text-bembe-coral shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="text-sm text-bembe-night/70 leading-relaxed">
                  {es
                    ? "La hora del dia lo cambia todo. Los mejores momentos para grabar:"
                    : "The time of day changes everything. The best times to film:"}
                </p>
                <ul className="space-y-2">
                  {[
                    { en: "Golden hour (6-7am, 5-6pm) — warm light, long shadows, everything looks magical", es: "Hora dorada (6-7am, 5-6pm) — luz calida, sombras largas, todo se ve magico" },
                    { en: "Blue hour (just after sunset) — moody, perfect for neon signs and lit-up streets", es: "Hora azul (justo despues del atardecer) — atmosferico, perfecto para letreros de neon y calles iluminadas" },
                    { en: "Overcast days — soft, even light with no harsh shadows. Underrated.", es: "Dias nublados — luz suave y uniforme sin sombras duras. Subestimado." },
                    { en: "After rain — reflections on wet streets, saturated colors, fresh feeling", es: "Despues de lluvia — reflejos en calles mojadas, colores saturados, sensacion fresca" },
                  ].map((time) => (
                    <li key={time.en} className="text-sm text-bembe-night/70 leading-relaxed">
                      <strong className="text-bembe-night">{(es ? time.es : time.en).split(" — ")[0]}</strong>
                      {" — "}
                      {(es ? time.es : time.en).split(" — ")[1]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ideas */}
          <h2 className="text-xl font-bold text-bembe-night mt-10 mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bembe-coral/10 text-sm font-bold text-bembe-coral">5</span>
            {es ? "Ideas para tu primer walk cinematografico" : "Ideas for your first cinematic walk"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {[
              { en: "\"Colors of Santurce\" — follow the murals and painted walls", es: "\"Colores de Santurce\" — sigue los murales y paredes pintadas" },
              { en: "\"Old San Juan at dawn\" — empty cobblestone streets, first light", es: "\"Viejo San Juan al amanecer\" — calles de adoquin vacias, primera luz" },
              { en: "\"Market day\" — textures, hands, produce, movement", es: "\"Dia de mercado\" — texturas, manos, productos, movimiento" },
              { en: "\"The water\" — beaches, rivers, rain, fountains across one neighborhood", es: "\"El agua\" — playas, rios, lluvia, fuentes en un barrio" },
              { en: "\"Doors of PR\" — just doors. Colors, textures, what they say about the people inside", es: "\"Puertas de PR\" — solo puertas. Colores, texturas, lo que dicen de la gente adentro" },
              { en: "\"Night walk\" — a neighborhood after dark, lit by streetlamps and colmados", es: "\"Caminata nocturna\" — un barrio de noche, iluminado por faroles y colmados" },
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
            href="/guides/documentary-style"
            className="inline-flex items-center gap-2 text-sm font-semibold text-bembe-teal hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {es ? "Anterior: El Narrador" : "Previous: The Narrator"}
          </Link>
          <Link
            href="/guides/asmr-immersive"
            className="inline-flex items-center gap-2 text-sm font-semibold text-bembe-teal hover:underline"
          >
            {es ? "Siguiente: El Inmersivo" : "Next: The Immersive"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
