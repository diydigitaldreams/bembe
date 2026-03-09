import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Bembe Database Seed Script
// Uses the service role key to bypass RLS and insert seed data.
// ---------------------------------------------------------------------------

export interface SeedResult {
  profiles: number;
  art_walks: number;
  walk_stops: number;
  events: number;
}

export async function seed(): Promise<SeedResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // -----------------------------------------------------------------------
  // 1. Artist profiles (must create auth.users first due to FK constraint)
  // -----------------------------------------------------------------------
  const artistDefs = [
    {
      email: "lourdes.pagan@bembe.app",
      full_name: "Lourdes Pagán Rivera [Ejemplo]",
      bio: "Perfil de ejemplo — Artista multidisciplinaria de Santurce. Explora la memoria colectiva boricua a través de instalaciones sonoras y murales interactivos. Su trabajo ha sido exhibido en la Bienal de San Juan y el Museo de Arte de Puerto Rico.",
      location: "Santurce, PR",
      role: "artist" as const,
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lourdes",
      lat: 18.4496,
      lng: -66.0638,
    },
    {
      email: "carlos.melendez@bembe.app",
      full_name: "Carlos Meléndez Ortiz [Ejemplo]",
      bio: "Perfil de ejemplo — Músico y historiador cultural de Ponce. Documenta las tradiciones orales y sonoras de Puerto Rico, desde la bomba y plena hasta los pregones del casco urbano. Fundador del colectivo Sonido Ancestral.",
      location: "Ponce, PR",
      role: "artist" as const,
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      lat: 18.0108,
      lng: -66.6141,
    },
  ];

  // Create auth users first (service role can do this)
  const artists: { id: string; email: string }[] = [];
  for (const def of artistDefs) {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === def.email);

    let userId: string;
    if (existing) {
      userId = existing.id;
    } else {
      const { data: newUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: def.email,
          password: "bembe-example-2024",
          email_confirm: true,
        });
      if (authError) {
        throw new Error(`Failed to create auth user ${def.email}: ${authError.message}`);
      }
      userId = newUser.user.id;
    }
    artists.push({ id: userId, email: def.email });
  }

  // Now upsert profiles with the real auth user IDs
  const profileRows = artistDefs.map((def, i) => ({
    id: artists[i].id,
    email: def.email,
    full_name: def.full_name,
    bio: def.bio,
    location: def.location,
    role: def.role,
    avatar_url: def.avatar_url,
    lat: def.lat,
    lng: def.lng,
  }));

  const { data: insertedProfiles, error: profilesError } = await supabase
    .from("profiles")
    .upsert(profileRows, { onConflict: "id" })
    .select();

  if (profilesError) {
    throw new Error(`Failed to seed profiles: ${profilesError.message}`);
  }

  // -----------------------------------------------------------------------
  // 2. Art walks
  // -----------------------------------------------------------------------
  const walks = [
    {
      id: "a1b00000-0000-4000-8000-000000000001",
      artist_id: artists[0].id,
      title: "Murales Vivos de Santurce [Ejemplo]",
      description:
        "🎧 Ejemplo de caminata — Recorre las calles de Santurce y descubre la vibrante escena de arte urbano. Desde los icónicos murales de la Calle Cerra hasta las galerías emergentes de la Placita, esta caminata te sumerge en la revolución artística del barrio más cool de San Juan.",
      cover_image_url: "https://images.unsplash.com/photo-1579783928621-7a13d66a62b1?w=800&q=80",
      price_cents: 500,
      duration_minutes: 45,
      distance_km: 1.8,
      neighborhood: "Santurce",
      municipality: "San Juan",
      is_published: true,
      is_featured: true,
      total_plays: 127,
      avg_rating: 4.7,
    },
    {
      id: "a1b00000-0000-4000-8000-000000000002",
      artist_id: artists[0].id,
      title: "Ecos del Viejo San Juan [Ejemplo]",
      description:
        "🎧 Ejemplo de caminata — Camina por los adoquines azules del Viejo San Juan mientras escuchas las historias que guardan sus murallas. Desde El Morro hasta la Catedral, cada parada revela capas de historia colonial, resistencia y cultura viva.",
      cover_image_url: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80",
      price_cents: 800,
      duration_minutes: 60,
      distance_km: 2.5,
      neighborhood: "Viejo San Juan",
      municipality: "San Juan",
      is_published: true,
      is_featured: true,
      total_plays: 243,
      avg_rating: 4.9,
    },
    {
      id: "a1b00000-0000-4000-8000-000000000003",
      artist_id: artists[1].id,
      title: "Ponce: La Perla del Sur [Ejemplo]",
      description:
        "🎧 Ejemplo de caminata — Explora la arquitectura criolla y neoclásica de Ponce. Desde el Parque de Bombas hasta el Museo de Arte de Ponce, esta caminata sonora celebra la elegancia y la historia de la Ciudad Señorial.",
      cover_image_url: "https://images.unsplash.com/photo-1564604985362-fbb6eae09796?w=800&q=80",
      price_cents: 0,
      duration_minutes: 50,
      distance_km: 2.0,
      neighborhood: "Ponce Centro",
      municipality: "Ponce",
      is_published: true,
      is_featured: false,
      total_plays: 89,
      avg_rating: 4.5,
    },
    {
      id: "a1b00000-0000-4000-8000-000000000004",
      artist_id: artists[1].id,
      title: "Atardecer en Rincón [Ejemplo]",
      description:
        "🎧 Ejemplo de caminata — Una experiencia inmersiva al atardecer por la costa de Rincón. Escucha las olas, los cuentos de pescadores y la música jíbara mientras caminas desde Domes Beach hasta el Faro de Punta Higüero.",
      cover_image_url: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&q=80",
      price_cents: 300,
      duration_minutes: 35,
      distance_km: 1.5,
      neighborhood: "Rincón",
      municipality: "Rincón",
      is_published: true,
      is_featured: false,
      total_plays: 56,
      avg_rating: 4.6,
    },
    {
      id: "a1b00000-0000-4000-8000-000000000005",
      artist_id: artists[0].id,
      title: "Condado: Brisa y Cultura [Ejemplo]",
      description:
        "🎧 Ejemplo de caminata — Pasea por el Condado y descubre cómo este barrio turístico esconde joyas culturales entre sus hoteles y playas. Arte público, arquitectura art deco y la energía del San Juan moderno en una sola caminata.",
      cover_image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      price_cents: 1000,
      duration_minutes: 40,
      distance_km: 1.6,
      neighborhood: "Condado",
      municipality: "San Juan",
      is_published: true,
      is_featured: false,
      total_plays: 34,
      avg_rating: 4.3,
    },
  ];

  const { data: insertedWalks, error: walksError } = await supabase
    .from("art_walks")
    .upsert(walks, { onConflict: "id" })
    .select();

  if (walksError) {
    throw new Error(`Failed to seed art_walks: ${walksError.message}`);
  }

  // -----------------------------------------------------------------------
  // 3. Walk stops
  // -----------------------------------------------------------------------
  const stops = [
    // -- Santurce walk (5 stops) --
    {
      walk_id: walks[0].id,
      order_index: 0,
      title: "La Placita de Santurce",
      description:
        "El corazón nocturno de Santurce. De día es un mercado de frutas; de noche, el epicentro de la vida cultural boricua.",
      lat: 18.4468,
      lng: -66.0614,
      trigger_radius_meters: 30,
      duration_seconds: 180,
    },
    {
      walk_id: walks[0].id,
      order_index: 1,
      title: "Calle Cerra — Galería a Cielo Abierto",
      description:
        "La calle más colorida de Puerto Rico, cubierta de murales de artistas locales e internacionales.",
      lat: 18.4482,
      lng: -66.0595,
      trigger_radius_meters: 25,
      duration_seconds: 240,
    },
    {
      walk_id: walks[0].id,
      order_index: 2,
      title: "Museo de Arte Contemporáneo (MAC)",
      description:
        "Espacio dedicado al arte contemporáneo caribeño y latinoamericano, con exhibiciones rotativas de artistas emergentes.",
      lat: 18.4500,
      lng: -66.0660,
      trigger_radius_meters: 35,
      duration_seconds: 200,
    },
    {
      walk_id: walks[0].id,
      order_index: 3,
      title: "Miramar — Antiguas Casas Señoriales",
      description:
        "Arquitectura residencial del siglo XX que cuenta la historia de la clase profesional puertorriqueña.",
      lat: 18.4530,
      lng: -66.0740,
      trigger_radius_meters: 30,
      duration_seconds: 160,
    },
    {
      walk_id: walks[0].id,
      order_index: 4,
      title: "Parada 18 — Talleres de Artistas",
      description:
        "Zona de talleres y estudios donde los artistas de Santurce crean sus obras. Un vistazo al proceso creativo boricua.",
      lat: 18.4450,
      lng: -66.0560,
      trigger_radius_meters: 25,
      duration_seconds: 190,
    },

    // -- Viejo San Juan walk (4 stops) --
    {
      walk_id: walks[1].id,
      order_index: 0,
      title: "Castillo San Felipe del Morro",
      description:
        "Fortaleza del siglo XVI que ha defendido la isla por más de 400 años. Patrimonio de la Humanidad por la UNESCO.",
      lat: 18.4709,
      lng: -66.1217,
      trigger_radius_meters: 50,
      duration_seconds: 300,
    },
    {
      walk_id: walks[1].id,
      order_index: 1,
      title: "Calle del Cristo",
      description:
        "Una de las calles más antiguas del Nuevo Mundo, con galerías, tiendas artesanales y la Capilla del Cristo.",
      lat: 18.4643,
      lng: -66.1172,
      trigger_radius_meters: 25,
      duration_seconds: 240,
    },
    {
      walk_id: walks[1].id,
      order_index: 2,
      title: "Catedral de San Juan Bautista",
      description:
        "La segunda catedral más antigua de las Américas, donde descansan los restos del explorador Juan Ponce de León.",
      lat: 18.4660,
      lng: -66.1179,
      trigger_radius_meters: 30,
      duration_seconds: 220,
    },
    {
      walk_id: walks[1].id,
      order_index: 3,
      title: "Plaza de Armas",
      description:
        "La plaza principal del Viejo San Juan, rodeada de edificios históricos y llena de vida local.",
      lat: 18.4656,
      lng: -66.1161,
      trigger_radius_meters: 35,
      duration_seconds: 180,
    },

    // -- Ponce walk (4 stops) --
    {
      walk_id: walks[2].id,
      order_index: 0,
      title: "Parque de Bombas",
      description:
        "El icónico edificio rojo y negro de 1882, símbolo de Ponce y antigua estación de bomberos.",
      lat: 18.0123,
      lng: -66.6140,
      trigger_radius_meters: 25,
      duration_seconds: 200,
    },
    {
      walk_id: walks[2].id,
      order_index: 1,
      title: "Museo de Arte de Ponce",
      description:
        "Una de las colecciones de arte europeo y puertorriqueño más importantes del Caribe, diseñado por Edward Durell Stone.",
      lat: 18.0068,
      lng: -66.6183,
      trigger_radius_meters: 40,
      duration_seconds: 280,
    },
    {
      walk_id: walks[2].id,
      order_index: 2,
      title: "Casa Wiechers-Villaronga",
      description:
        "Joya de la arquitectura criolla con influencias art nouveau, ejemplo perfecto del esplendor ponceño de 1911.",
      lat: 18.0115,
      lng: -66.6127,
      trigger_radius_meters: 20,
      duration_seconds: 180,
    },
    {
      walk_id: walks[2].id,
      order_index: 3,
      title: "Plaza Las Delicias",
      description:
        "La plaza central de Ponce con sus fuentes, árboles centenarios y la Catedral Nuestra Señora de Guadalupe.",
      lat: 18.0128,
      lng: -66.6133,
      trigger_radius_meters: 30,
      duration_seconds: 200,
    },

    // -- Rincón walk (3 stops) --
    {
      walk_id: walks[3].id,
      order_index: 0,
      title: "Domes Beach",
      description:
        "Playa icónica de Rincón, famosa por su oleaje y las cúpulas del antiguo reactor nuclear BONUS.",
      lat: 18.3561,
      lng: -67.2617,
      trigger_radius_meters: 40,
      duration_seconds: 240,
    },
    {
      walk_id: walks[3].id,
      order_index: 1,
      title: "Paseo por la Costa",
      description:
        "Sendero costero con vistas al Canal de la Mona. En invierno se pueden avistar ballenas jorobadas.",
      lat: 18.3535,
      lng: -67.2640,
      trigger_radius_meters: 35,
      duration_seconds: 200,
    },
    {
      walk_id: walks[3].id,
      order_index: 2,
      title: "Faro de Punta Higüero",
      description:
        "Faro histórico de 1892 con una de las mejores puestas de sol del Caribe. Punto final perfecto para la caminata.",
      lat: 18.3553,
      lng: -67.2650,
      trigger_radius_meters: 30,
      duration_seconds: 260,
    },

    // -- Condado walk (3 stops) --
    {
      walk_id: walks[4].id,
      order_index: 0,
      title: "Ventana al Mar",
      description:
        "Parque frente al océano con esculturas contemporáneas y una vista espectacular de la costa del Condado.",
      lat: 18.4573,
      lng: -66.0720,
      trigger_radius_meters: 30,
      duration_seconds: 180,
    },
    {
      walk_id: walks[4].id,
      order_index: 1,
      title: "Avenida Ashford — Art Deco Walk",
      description:
        "La avenida principal del Condado conserva joyas arquitectónicas art deco entre los edificios modernos.",
      lat: 18.4560,
      lng: -66.0690,
      trigger_radius_meters: 25,
      duration_seconds: 220,
    },
    {
      walk_id: walks[4].id,
      order_index: 2,
      title: "Laguna del Condado — Estuario",
      description:
        "Reserva natural urbana, hogar de manatíes y aves migratorias. Un oasis ecológico en medio de la ciudad.",
      lat: 18.4535,
      lng: -66.0665,
      trigger_radius_meters: 35,
      duration_seconds: 200,
    },
  ];

  const { data: insertedStops, error: stopsError } = await supabase
    .from("walk_stops")
    .upsert(stops)
    .select();

  if (stopsError) {
    throw new Error(`Failed to seed walk_stops: ${stopsError.message}`);
  }

  // -----------------------------------------------------------------------
  // 4. Events
  // -----------------------------------------------------------------------
  const now = new Date();
  const inDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();

  const events = [
    {
      id: "b2c00000-0000-4000-8000-000000000001",
      organizer_id: artists[0].id,
      title: "Noche de Galerías — Santurce es Ley [Ejemplo]",
      description:
        "La tradicional noche de galerías abiertas en Santurce. Más de 20 espacios abren sus puertas con arte, música en vivo y gastronomía local. Gratis y abierto al público.",
      location_name: "Calle Cerra, Santurce",
      neighborhood: "Santurce",
      lat: 18.4482,
      lng: -66.0595,
      starts_at: inDays(7),
      ends_at: inDays(7.25),
      ticket_price_cents: 0,
      max_capacity: 500,
      tickets_sold: 187,
      rsvp_url: "",
      cover_image_url: "",
      is_published: true,
    },
    {
      id: "b2c00000-0000-4000-8000-000000000002",
      organizer_id: artists[1].id,
      title: "Festival de Bomba y Plena — Ponce [Ejemplo]",
      description:
        "Celebración de las raíces afro-boricuas con presentaciones de bomba y plena, talleres de percusión y comida típica en la Plaza Las Delicias.",
      location_name: "Plaza Las Delicias, Ponce",
      neighborhood: "Ponce Centro",
      lat: 18.0128,
      lng: -66.6133,
      starts_at: inDays(14),
      ends_at: inDays(14.375),
      ticket_price_cents: 500,
      max_capacity: 300,
      tickets_sold: 92,
      rsvp_url: "",
      cover_image_url: "",
      is_published: true,
    },
    {
      id: "b2c00000-0000-4000-8000-000000000003",
      organizer_id: artists[0].id,
      title: "Jazz en la Calle — Viejo San Juan [Ejemplo]",
      description:
        "Noche de jazz al aire libre en las calles adoquinadas del Viejo San Juan. Artistas locales e invitados internacionales en un ambiente íntimo bajo las estrellas.",
      location_name: "Plaza de Armas, Viejo San Juan",
      neighborhood: "Viejo San Juan",
      lat: 18.4656,
      lng: -66.1161,
      starts_at: inDays(10),
      ends_at: inDays(10.167),
      ticket_price_cents: 1500,
      max_capacity: 150,
      tickets_sold: 63,
      rsvp_url: "",
      cover_image_url: "",
      is_published: true,
    },
    {
      id: "b2c00000-0000-4000-8000-000000000004",
      organizer_id: artists[1].id,
      title: "Exposición: Tierra y Memoria [Ejemplo]",
      description:
        "Inauguración de la exposición colectiva 'Tierra y Memoria' en el MAC. Artistas boricuas exploran la relación entre la isla, la diáspora y la identidad cultural a través de instalaciones y multimedia.",
      location_name: "Museo de Arte Contemporáneo, Santurce",
      neighborhood: "Santurce",
      lat: 18.4500,
      lng: -66.0660,
      starts_at: inDays(21),
      ends_at: inDays(21.125),
      ticket_price_cents: 0,
      max_capacity: 200,
      tickets_sold: 45,
      rsvp_url: "",
      cover_image_url: "",
      is_published: true,
    },
  ];

  const { data: insertedEvents, error: eventsError } = await supabase
    .from("events")
    .upsert(events, { onConflict: "id" })
    .select();

  if (eventsError) {
    throw new Error(`Failed to seed events: ${eventsError.message}`);
  }

  return {
    profiles: insertedProfiles?.length ?? 0,
    art_walks: insertedWalks?.length ?? 0,
    walk_stops: insertedStops?.length ?? 0,
    events: insertedEvents?.length ?? 0,
  };
}
