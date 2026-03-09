"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { MapPin, ArrowRight, Headphones, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface Neighborhood {
  slug: string;
  name: string;
  municipality: string;
  gradient: string;
  walks: number;
  descEn: string;
  descEs: string;
  vibeEn: string;
  vibeEs: string;
  knownForEn: string[];
  knownForEs: string[];
}

const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "santurce",
    name: "Santurce",
    municipality: "San Juan",
    gradient: "from-bembe-coral to-orange-400",
    walks: 12,
    descEn:
      "Once a neglected urban zone, Santurce is now Puerto Rico's creative heartbeat. Every wall is a canvas — massive murals by local and international artists line Calle Cerra and Calle Loiza. The neighborhood pulses with galleries, studios, La Placita's legendary nightlife, and a food scene that ranges from street-side alcapurrias to chef-driven restaurants.",
    descEs:
      "Antes una zona urbana olvidada, Santurce es ahora el corazon creativo de Puerto Rico. Cada pared es un lienzo — murales masivos de artistas locales e internacionales cubren la Calle Cerra y la Calle Loiza. El barrio pulsa con galerias, estudios, la legendaria vida nocturna de La Placita, y una escena gastronomica que va desde alcapurrias callejeras hasta restaurantes de autor.",
    vibeEn: "Urban art, nightlife, galleries, food culture",
    vibeEs: "Arte urbano, vida nocturna, galerias, cultura gastronomica",
    knownForEn: ["Street murals", "La Placita", "Calle Loiza", "Gallery nights", "Live music venues"],
    knownForEs: ["Murales callejeros", "La Placita", "Calle Loiza", "Noches de galeria", "Venues de musica en vivo"],
  },
  {
    slug: "viejo-san-juan",
    name: "Viejo San Juan",
    municipality: "San Juan",
    gradient: "from-bembe-teal to-emerald-400",
    walks: 8,
    descEn:
      "Five centuries of history live in these blue cobblestone streets. Founded in 1521, Old San Juan is one of the oldest European-established settlements in the Americas. Walk past El Morro and San Cristobal fortresses, through pastel-colored colonial buildings, hidden plazas, and churches that have watched empires rise and fall. Every adoquin has a story.",
    descEs:
      "Cinco siglos de historia viven en estas calles de adoquines azules. Fundado en 1521, el Viejo San Juan es uno de los asentamientos europeos mas antiguos de las Americas. Camina junto a las fortalezas El Morro y San Cristobal, entre edificios coloniales de colores pastel, plazas escondidas e iglesias que han visto imperios nacer y caer. Cada adoquin tiene una historia.",
    vibeEn: "Colonial history, fortresses, colorful streets, ocean views",
    vibeEs: "Historia colonial, fortalezas, calles coloridas, vistas al mar",
    knownForEn: ["El Morro", "San Cristobal", "Blue cobblestones", "La Fortaleza", "Calle del Cristo"],
    knownForEs: ["El Morro", "San Cristobal", "Adoquines azules", "La Fortaleza", "Calle del Cristo"],
  },
  {
    slug: "condado",
    name: "Condado",
    municipality: "San Juan",
    gradient: "from-purple-500 to-bembe-coral",
    walks: 5,
    descEn:
      "San Juan's beachside strip where Art Deco meets Caribbean cool. Condado is the island's luxury corridor — boutique hotels, upscale restaurants, and designer shops line Ashford Avenue. But look past the glossy surface and you'll find hidden murals in alleys, local art in hotel lobbies, and a fascinating architectural story from the 1950s tourism boom.",
    descEs:
      "La franja playera de San Juan donde el Art Deco se encuentra con el cool caribeno. Condado es el corredor de lujo de la isla — hoteles boutique, restaurantes de alta cocina y tiendas de disenador bordean la Avenida Ashford. Pero mira mas alla de la superficie y encontraras murales escondidos en callejones, arte local en lobbies de hoteles, y una historia arquitectonica fascinante del boom turistico de los 1950s.",
    vibeEn: "Art Deco, beach culture, luxury meets local art",
    vibeEs: "Art Deco, cultura de playa, lujo con arte local",
    knownForEn: ["Ashford Avenue", "Condado Beach", "Art Deco buildings", "Laguna del Condado", "Gallery Row"],
    knownForEs: ["Avenida Ashford", "Playa del Condado", "Edificios Art Deco", "Laguna del Condado", "Gallery Row"],
  },
  {
    slug: "ponce",
    name: "Ponce Centro",
    municipality: "Ponce",
    gradient: "from-bembe-gold to-yellow-400",
    walks: 6,
    descEn:
      "The Pearl of the South. Ponce is Puerto Rico's second city and its cultural rival to San Juan. The historic center is a masterclass in architecture — neoclassical, Art Deco, and Creole styles stand side by side around Plaza Las Delicias. Home to the Museo de Arte de Ponce (one of the Caribbean's best), the iconic Parque de Bombas firehouse, and a fiercely proud local identity.",
    descEs:
      "La Perla del Sur. Ponce es la segunda ciudad de Puerto Rico y su rival cultural de San Juan. El centro historico es una catedra de arquitectura — estilos neoclasico, Art Deco y criollo conviven alrededor de la Plaza Las Delicias. Hogar del Museo de Arte de Ponce (uno de los mejores del Caribe), el iconico Parque de Bombas, y una identidad local fieramente orgullosa.",
    vibeEn: "Architecture, museums, cultural pride, plazas",
    vibeEs: "Arquitectura, museos, orgullo cultural, plazas",
    knownForEn: ["Plaza Las Delicias", "Parque de Bombas", "Museo de Arte", "Carnival", "Neoclassical architecture"],
    knownForEs: ["Plaza Las Delicias", "Parque de Bombas", "Museo de Arte", "Carnaval", "Arquitectura neoclasica"],
  },
  {
    slug: "loiza",
    name: "Loiza",
    municipality: "Loiza",
    gradient: "from-red-500 to-bembe-coral",
    walks: 4,
    descEn:
      "The heart of Afro-Caribbean culture in Puerto Rico. Loiza is where bomba and plena were born — the rhythms that define Puerto Rican music. This coastal town preserves traditions brought by enslaved Africans centuries ago. The Festival de Santiago Apostol (vejigante masks, bomba dancing) is one of the most authentic cultural celebrations on the island. The food — especially the coconut-based dishes — is unmatched.",
    descEs:
      "El corazon de la cultura afro-caribena en Puerto Rico. Loiza es donde nacieron la bomba y la plena — los ritmos que definen la musica puertorriquena. Este pueblo costero preserva tradiciones traidas por africanos esclavizados hace siglos. El Festival de Santiago Apostol (mascaras de vejigante, baile de bomba) es una de las celebraciones culturales mas autenticas de la isla. La comida — especialmente los platos a base de coco — es inigualable.",
    vibeEn: "Bomba, plena, Afro-Caribbean heritage, vejigantes",
    vibeEs: "Bomba, plena, herencia afro-caribena, vejigantes",
    knownForEn: ["Bomba y Plena", "Vejigante masks", "Piñones", "Coconut cuisine", "Festival de Santiago Apostol"],
    knownForEs: ["Bomba y Plena", "Mascaras de vejigante", "Piñones", "Cocina de coco", "Festival de Santiago Apostol"],
  },
  {
    slug: "rincon",
    name: "Rincon",
    municipality: "Rincon",
    gradient: "from-blue-400 to-bembe-teal",
    walks: 4,
    descEn:
      "Puerto Rico's surf capital and sunset paradise. Rincon sits on the island's western tip where the Caribbean meets the Atlantic. World-class surf breaks, whale watching in winter, and a laid-back community of artists, surfers, and expats. The sunsets here are legendary — locals literally stop what they're doing to watch. The art scene is organic and growing, with galleries in converted beach houses.",
    descEs:
      "La capital del surf y el paraiso del atardecer de Puerto Rico. Rincon se encuentra en la punta oeste de la isla donde el Caribe se encuentra con el Atlantico. Olas de clase mundial, avistamiento de ballenas en invierno, y una comunidad relajada de artistas, surfers y expatriados. Los atardeceres aqui son legendarios — los locales literalmente paran lo que estan haciendo para verlos. La escena artistica es organica y creciente, con galerias en casas de playa convertidas.",
    vibeEn: "Surf culture, sunsets, beach art, laid-back community",
    vibeEs: "Cultura de surf, atardeceres, arte de playa, comunidad relajada",
    knownForEn: ["Tres Palmas surf break", "Whale watching", "Sunset strip", "Beach galleries", "Eco-tourism"],
    knownForEs: ["Tres Palmas (surf)", "Avistamiento de ballenas", "Franja del atardecer", "Galerias de playa", "Eco-turismo"],
  },
  {
    slug: "caguas",
    name: "Caguas",
    municipality: "Caguas",
    gradient: "from-emerald-500 to-bembe-teal",
    walks: 3,
    descEn:
      "The Heart of the Valley — Caguas is the cultural center of Puerto Rico's mountainous interior. Known for its botanical garden, the Criollo Art Museum, and a thriving public art program that has turned the downtown into an open-air gallery. The surrounding mountains offer a completely different Puerto Rico from the coast — cooler, greener, with coffee fincas and haciendas dating back centuries.",
    descEs:
      "El Corazon del Valle — Caguas es el centro cultural del interior montanoso de Puerto Rico. Conocida por su jardin botanico, el Museo de Arte Criollo, y un programa de arte publico que ha convertido el centro en una galeria al aire libre. Las montanas circundantes ofrecen un Puerto Rico completamente diferente al de la costa — mas fresco, mas verde, con fincas de cafe y haciendas de hace siglos.",
    vibeEn: "Mountain culture, botanical gardens, public art, coffee country",
    vibeEs: "Cultura de montana, jardin botanico, arte publico, tierra del cafe",
    knownForEn: ["Botanical Garden", "Criollo Art Museum", "Coffee fincas", "Mountain trails", "Public art downtown"],
    knownForEs: ["Jardin Botanico", "Museo de Arte Criollo", "Fincas de cafe", "Rutas de montana", "Arte publico en el centro"],
  },
  {
    slug: "rio-piedras",
    name: "Rio Piedras",
    municipality: "San Juan",
    gradient: "from-amber-500 to-bembe-gold",
    walks: 3,
    descEn:
      "The university district and Puerto Rico's intellectual center. Home to the University of Puerto Rico's main campus, Rio Piedras has the energy of a college town — bookstores, debate cafes, protest art, and one of the most authentic public markets on the island (Plaza del Mercado). The botanical garden within the UPR campus is a hidden jewel of tropical flora.",
    descEs:
      "El distrito universitario y centro intelectual de Puerto Rico. Hogar del campus principal de la Universidad de Puerto Rico, Rio Piedras tiene la energia de una ciudad universitaria — librerias, cafes de debate, arte de protesta, y uno de los mercados publicos mas autenticos de la isla (Plaza del Mercado). El jardin botanico dentro del campus de la UPR es una joya escondida de flora tropical.",
    vibeEn: "University life, markets, intellectual culture, protest art",
    vibeEs: "Vida universitaria, mercados, cultura intelectual, arte de protesta",
    knownForEn: ["UPR campus", "Plaza del Mercado", "Botanical Garden", "Bookstores", "Student art"],
    knownForEs: ["Campus UPR", "Plaza del Mercado", "Jardin Botanico", "Librerias", "Arte estudiantil"],
  },
  {
    slug: "ocean-park",
    name: "Ocean Park",
    municipality: "San Juan",
    gradient: "from-sky-400 to-blue-500",
    walks: 2,
    descEn:
      "San Juan's best-kept secret beach neighborhood. Tucked between Condado and Isla Verde, Ocean Park has the most beautiful urban beach in Puerto Rico — wide, uncrowded, with kite surfers and locals playing volleyball at sunset. The residential streets are lined with mid-century homes, local cafes, and a growing community of artists and young professionals who chose this pocket of calm over the tourist strips.",
    descEs:
      "El secreto mejor guardado de las playas de San Juan. Escondido entre Condado e Isla Verde, Ocean Park tiene la playa urbana mas bonita de Puerto Rico — ancha, sin aglomeracion, con kitesurfers y locales jugando volleyball al atardecer. Las calles residenciales estan bordeadas de casas mid-century, cafes locales, y una comunidad creciente de artistas y jovenes profesionales que eligieron este rincon de calma sobre las franjas turisticas.",
    vibeEn: "Local beach culture, kite surfing, quiet residential, cafes",
    vibeEs: "Cultura de playa local, kitesurf, residencial tranquilo, cafes",
    knownForEn: ["Best local beach", "Kite surfing", "Ultimo Trolley bar", "Weekend volleyball", "Local cafes"],
    knownForEs: ["Mejor playa local", "Kitesurf", "Ultimo Trolley bar", "Volleyball de fin de semana", "Cafes locales"],
  },
  {
    slug: "mayaguez",
    name: "Mayaguez",
    municipality: "Mayaguez",
    gradient: "from-lime-500 to-emerald-500",
    walks: 2,
    descEn:
      "The Sultan of the West. Mayaguez is a university city (home to UPR Mayaguez, the island's top engineering school) on the western coast with a rich cultural heritage. The tropical agricultural research station is one of the oldest in the Western Hemisphere. The city's Plaza Colon features a massive Columbus statue, and the surrounding streets hold centuries of mercantile history, from the sugarcane era to the pharmaceutical boom.",
    descEs:
      "El Sultan del Oeste. Mayaguez es una ciudad universitaria (hogar de UPR Mayaguez, la mejor escuela de ingenieria de la isla) en la costa oeste con una rica herencia cultural. La estacion de investigacion agricola tropical es una de las mas antiguas del hemisferio occidental. La Plaza Colon tiene una estatua masiva de Cristobal Colon, y las calles circundantes guardan siglos de historia mercantil, desde la era de la cana de azucar hasta el boom farmaceutico.",
    vibeEn: "University town, tropical research, western coast heritage",
    vibeEs: "Ciudad universitaria, investigacion tropical, herencia de la costa oeste",
    knownForEn: ["UPR Mayaguez", "Tropical Agriculture Station", "Plaza Colon", "Western sunsets", "Mango festival"],
    knownForEs: ["UPR Mayaguez", "Estacion Agricola Tropical", "Plaza Colon", "Atardeceres del oeste", "Festival del mango"],
  },
  {
    slug: "vieques",
    name: "Vieques",
    municipality: "Vieques",
    gradient: "from-cyan-400 to-blue-500",
    walks: 2,
    descEn:
      "An island off the island — Vieques is Puerto Rico's most magical escape. Home to Mosquito Bay, one of the brightest bioluminescent bays in the world, and wild horses that roam freely through pristine beaches. The former US Navy bombing range is now a wildlife refuge with some of the most untouched coastline in the Caribbean. Art here is survival — the community's resilience after decades of military occupation is visible everywhere.",
    descEs:
      "Una isla fuera de la isla — Vieques es el escape mas magico de Puerto Rico. Hogar de Bahia Mosquito, una de las bahias bioluminiscentes mas brillantes del mundo, y caballos salvajes que deambulan libremente por playas virgenes. El antiguo campo de bombardeo de la Marina de EE.UU. es ahora un refugio de vida silvestre con algunas de las costas mas intactas del Caribe. El arte aqui es sobrevivencia — la resiliencia de la comunidad tras decadas de ocupacion militar es visible en todas partes.",
    vibeEn: "Bioluminescence, wild horses, untouched beaches, resilience art",
    vibeEs: "Bioluminiscencia, caballos salvajes, playas virgenes, arte de resiliencia",
    knownForEn: ["Mosquito Bay (bio bay)", "Wild horses", "Sun Bay Beach", "Former Navy land", "Island art scene"],
    knownForEs: ["Bahia Mosquito (bio bahia)", "Caballos salvajes", "Playa Sun Bay", "Antigua tierra de la Marina", "Escena artistica isleña"],
  },
  {
    slug: "cabo-rojo",
    name: "Cabo Rojo",
    municipality: "Cabo Rojo",
    gradient: "from-rose-400 to-red-500",
    walks: 2,
    descEn:
      "Puerto Rico's southwestern corner where the salt flats paint the landscape pink. The Cabo Rojo Salt Flats are a natural wonder — the water turns bright pink from microorganisms, creating an otherworldly landscape. Los Morrillos Lighthouse stands on dramatic cliffs overlooking the Caribbean. The area is also famous for its fishing villages and some of the freshest seafood on the island.",
    descEs:
      "La esquina suroeste de Puerto Rico donde las salinas pintan el paisaje de rosado. Las Salinas de Cabo Rojo son una maravilla natural — el agua se torna rosa brillante por microorganismos, creando un paisaje de otro mundo. El Faro Los Morrillos se alza sobre acantilados dramaticos con vista al Caribe. La zona tambien es famosa por sus pueblos pesqueros y algunos de los mariscos mas frescos de la isla.",
    vibeEn: "Salt flats, lighthouses, fishing villages, dramatic cliffs",
    vibeEs: "Salinas, faros, pueblos pesqueros, acantilados dramaticos",
    knownForEn: ["Pink salt flats", "Los Morrillos Lighthouse", "Playa Sucia", "Fresh seafood", "Boquerón"],
    knownForEs: ["Salinas rosadas", "Faro Los Morrillos", "Playa Sucia", "Mariscos frescos", "Boquerón"],
  },
];

export default function NeighborhoodsPage() {
  const { locale } = useI18n();
  const es = locale === "es";

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-bembe-teal mb-3">
            {es ? "Explora Puerto Rico" : "Explore Puerto Rico"}
          </p>
          <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl md:text-5xl">
            {es ? "Barrios y Comunidades" : "Neighborhoods & Communities"}
          </h1>
          <p className="mt-4 text-lg text-bembe-night/60 max-w-2xl mx-auto">
            {es
              ? "Cada barrio de Puerto Rico tiene su propia personalidad, su propia historia y su propio sonido. Descubre caminatas de arte curadas por artistas que viven y respiran estos lugares."
              : "Every neighborhood in Puerto Rico has its own personality, its own history, and its own sound. Discover art walks curated by artists who live and breathe these places."}
          </p>
        </div>

        {/* Neighborhood grid */}
        <div className="space-y-8">
          {NEIGHBORHOODS.map((hood) => (
            <div
              key={hood.slug}
              className="overflow-hidden rounded-2xl bg-white shadow-sm border border-bembe-night/5 hover:shadow-md transition-shadow"
            >
              {/* Color banner */}
              <div className={`h-3 bg-gradient-to-r ${hood.gradient}`} />

              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="flex-1 min-w-0">
                    {/* Name + municipality */}
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-bembe-night">
                        {hood.name}
                      </h2>
                      <span className="text-sm text-bembe-night/40 font-medium">
                        {hood.municipality}
                      </span>
                    </div>

                    {/* Vibe */}
                    <p className="text-sm font-medium text-bembe-teal mb-3">
                      {es ? hood.vibeEs : hood.vibeEn}
                    </p>

                    {/* Description */}
                    <p className="text-bembe-night/60 leading-relaxed mb-4">
                      {es ? hood.descEs : hood.descEn}
                    </p>

                    {/* Known for tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(es ? hood.knownForEs : hood.knownForEn).map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bembe-night/5 text-xs font-medium text-bembe-night/60"
                        >
                          <MapPin className="w-3 h-3" />
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Stats + CTA */}
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-bembe-night/50">
                        <Headphones className="w-4 h-4" />
                        {hood.walks} {es ? "caminatas" : "walks"}
                      </span>
                      <Link
                        href={`/discover?neighborhood=${encodeURIComponent(hood.name)}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-bembe-teal hover:underline"
                      >
                        {es ? "Ver caminatas" : "View walks"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-bembe-night/50 mb-4">
            {es
              ? "No ves tu barrio? Los artistas estan creando nuevas caminatas cada semana."
              : "Don't see your neighborhood? Artists are creating new walks every week."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bembe-teal px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-bembe-teal/25 transition-all hover:bg-bembe-teal/90"
            >
              {es ? "Explorar todas las caminatas" : "Explore all walks"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup?role=artist"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-bembe-night/10 bg-white px-8 py-3.5 text-base font-semibold text-bembe-night transition-all hover:border-bembe-coral/30 hover:text-bembe-coral"
            >
              {es ? "Crear caminata de tu barrio" : "Create your neighborhood's walk"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
