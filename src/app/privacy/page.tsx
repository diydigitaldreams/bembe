"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { useI18n } from "@/lib/i18n/context";

const content = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: March 9, 2026",
    sections: [
      {
        heading: "1. Introduction",
        body: `Bembe ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our audio art walk platform at bembe.vercel.app and related services.

By using Bembe, you consent to the practices described in this policy.`,
      },
      {
        heading: "2. Information We Collect",
        body: `We collect the following types of information:

Account Information: When you register, we collect your name, email address, and role preference (artist, patron, or both).

Payment Information: Payment details (credit card numbers, bank account info) are collected and processed directly by Stripe. We do not store your full payment details on our servers. We receive transaction records (amounts, dates, status) from Stripe.

Location Data: During active walks, we collect your GPS location to trigger audio at the correct stops. Location data is used in real-time and is not permanently stored or tracked outside of active walk sessions.

Usage Data: We collect information about how you interact with the platform, including walks viewed, walks completed, stops visited, and time spent.

Device Information: We may collect browser type, operating system, and device identifiers for analytics and troubleshooting.

Communications: If you contact us at hola@bembe.pr or use in-app messaging, we retain those communications.`,
      },
      {
        heading: "3. How We Use Your Data",
        body: `We use collected information to:

- Provide and maintain the platform, including walk playback and GPS-guided experiences.
- Process payments and distribute earnings to artists.
- Manage your account and authentication.
- Send transactional emails (purchase confirmations, gift notifications).
- Improve the platform through aggregated, anonymized analytics.
- Provide the Grant Assistant feature (powered by AI) to help artists find funding opportunities.
- Respond to support requests and communications.
- Detect and prevent fraud or abuse.`,
      },
      {
        heading: "4. Third-Party Services",
        body: `We use the following third-party services that may process your data:

Supabase: Database hosting and user authentication. Data is stored in Supabase's cloud infrastructure. See supabase.com/privacy.

Stripe: Payment processing for walk purchases, tips, subscriptions, and artist payouts. See stripe.com/privacy.

Mapbox: Map rendering and geocoding for walk routes and stop locations. Mapbox may receive location queries. See mapbox.com/legal/privacy.

OpenAI: Powers the Grant Assistant feature. When you use the Grant Assistant, your prompts are sent to OpenAI's API. We do not send personal information to OpenAI beyond what you type in the assistant. See openai.com/privacy.

Vercel: Platform hosting. See vercel.com/legal/privacy-policy.`,
      },
      {
        heading: "5. Cookies and Tracking",
        body: `Bembe uses minimal cookies and local storage:

- Authentication tokens: To keep you signed in.
- Language preference: To remember your chosen language (Spanish or English).
- Offline walk data: Locally cached walk content for offline playback.

We do not use third-party advertising cookies or tracking pixels. We do not sell your data to advertisers.`,
      },
      {
        heading: "6. Data Retention",
        body: `We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except:

- Transaction records, which we retain for 7 years for legal and tax compliance.
- Anonymized, aggregated analytics data, which does not identify you personally.

Walk content created by artists remains on the platform until the artist removes it, even if the artist deletes their account (previously published walks may be archived).`,
      },
      {
        heading: "7. Your Rights",
        body: `You have the right to:

Access: Request a copy of the personal data we hold about you.
Correction: Request correction of inaccurate data.
Deletion: Request deletion of your account and personal data.
Portability: Request your data in a machine-readable format.
Opt-out: Disable location services, unsubscribe from non-transactional emails.

To exercise any of these rights, email us at hola@bembe.pr. We will respond within 30 days.`,
      },
      {
        heading: "8. CCPA Compliance (California Residents)",
        body: `If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):

- Right to know what personal information we collect, use, and disclose.
- Right to delete your personal information.
- Right to opt out of the sale of your personal information. Bembe does not sell personal information.
- Right to non-discrimination for exercising your CCPA rights.

To make a CCPA request, email hola@bembe.pr with the subject "CCPA Request."`,
      },
      {
        heading: "9. Children's Privacy",
        body: `Bembe is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected data from a child under 13, we will delete it promptly.`,
      },
      {
        heading: "10. Data Security",
        body: `We implement appropriate technical and organizational measures to protect your personal data, including encryption in transit (HTTPS/TLS) and secure authentication through Supabase. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.`,
      },
      {
        heading: "11. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. The "Last updated" date at the top of this page reflects the most recent revision.`,
      },
      {
        heading: "12. Contact",
        body: `If you have questions or concerns about this Privacy Policy, contact us at:

Email: hola@bembe.pr`,
      },
    ],
  },
  es: {
    title: "Politica de Privacidad",
    lastUpdated: "Ultima actualizacion: 9 de marzo de 2026",
    sections: [
      {
        heading: "1. Introduccion",
        body: `Bembe ("nosotros", "nuestro") respeta tu privacidad. Esta Politica de Privacidad explica como recopilamos, usamos, divulgamos y protegemos tu informacion cuando usas nuestra plataforma de caminatas de arte en audio en bembe.vercel.app y servicios relacionados.

Al usar Bembe, consientes las practicas descritas en esta politica.`,
      },
      {
        heading: "2. Informacion que Recopilamos",
        body: `Recopilamos los siguientes tipos de informacion:

Informacion de Cuenta: Al registrarte, recopilamos tu nombre, correo electronico y preferencia de rol (artista, patron o ambos).

Informacion de Pago: Los detalles de pago (numeros de tarjeta de credito, informacion bancaria) son recopilados y procesados directamente por Stripe. No almacenamos tus datos de pago completos en nuestros servidores. Recibimos registros de transacciones (montos, fechas, estado) de Stripe.

Datos de Ubicacion: Durante caminatas activas, recopilamos tu ubicacion GPS para activar el audio en las paradas correctas. Los datos de ubicacion se usan en tiempo real y no se almacenan permanentemente ni se rastrean fuera de las sesiones de caminata activas.

Datos de Uso: Recopilamos informacion sobre como interactuas con la plataforma, incluyendo caminatas vistas, caminatas completadas, paradas visitadas y tiempo empleado.

Informacion del Dispositivo: Podemos recopilar tipo de navegador, sistema operativo e identificadores de dispositivo para analiticas y solucion de problemas.

Comunicaciones: Si nos contactas a hola@bembe.pr o usas la mensajeria de la aplicacion, retenemos esas comunicaciones.`,
      },
      {
        heading: "3. Como Usamos tus Datos",
        body: `Usamos la informacion recopilada para:

- Proveer y mantener la plataforma, incluyendo la reproduccion de caminatas y experiencias guiadas por GPS.
- Procesar pagos y distribuir ganancias a artistas.
- Gestionar tu cuenta y autenticacion.
- Enviar correos transaccionales (confirmaciones de compra, notificaciones de regalos).
- Mejorar la plataforma mediante analiticas agregadas y anonimizadas.
- Proveer la funcion de Asistente de Becas (impulsada por IA) para ayudar a artistas a encontrar oportunidades de financiamiento.
- Responder a solicitudes de soporte y comunicaciones.
- Detectar y prevenir fraude o abuso.`,
      },
      {
        heading: "4. Servicios de Terceros",
        body: `Usamos los siguientes servicios de terceros que pueden procesar tus datos:

Supabase: Alojamiento de base de datos y autenticacion de usuarios. Los datos se almacenan en la infraestructura en la nube de Supabase. Ver supabase.com/privacy.

Stripe: Procesamiento de pagos para compras de caminatas, propinas, suscripciones y pagos a artistas. Ver stripe.com/privacy.

Mapbox: Renderizado de mapas y geocodificacion para rutas de caminatas y ubicaciones de paradas. Mapbox puede recibir consultas de ubicacion. Ver mapbox.com/legal/privacy.

OpenAI: Impulsa la funcion de Asistente de Becas. Cuando usas el Asistente de Becas, tus consultas se envian a la API de OpenAI. No enviamos informacion personal a OpenAI mas alla de lo que escribes en el asistente. Ver openai.com/privacy.

Vercel: Alojamiento de la plataforma. Ver vercel.com/legal/privacy-policy.`,
      },
      {
        heading: "5. Cookies y Rastreo",
        body: `Bembe usa cookies y almacenamiento local minimos:

- Tokens de autenticacion: Para mantener tu sesion iniciada.
- Preferencia de idioma: Para recordar tu idioma elegido (espanol o ingles).
- Datos de caminata offline: Contenido de caminatas almacenado localmente para reproduccion sin conexion.

No usamos cookies de publicidad de terceros ni pixeles de rastreo. No vendemos tus datos a anunciantes.`,
      },
      {
        heading: "6. Retencion de Datos",
        body: `Retenemos los datos de tu cuenta mientras tu cuenta este activa. Si eliminas tu cuenta, removeremos tus datos personales dentro de 30 dias, excepto:

- Registros de transacciones, que retenemos por 7 anos por cumplimiento legal y tributario.
- Datos analiticos anonimizados y agregados, que no te identifican personalmente.

El contenido de caminatas creado por artistas permanece en la plataforma hasta que el artista lo remueva, incluso si el artista elimina su cuenta (las caminatas publicadas previamente pueden ser archivadas).`,
      },
      {
        heading: "7. Tus Derechos",
        body: `Tienes derecho a:

Acceso: Solicitar una copia de los datos personales que tenemos sobre ti.
Correccion: Solicitar la correccion de datos inexactos.
Eliminacion: Solicitar la eliminacion de tu cuenta y datos personales.
Portabilidad: Solicitar tus datos en un formato legible por maquina.
Exclusion: Desactivar servicios de ubicacion, cancelar suscripcion a correos no transaccionales.

Para ejercer cualquiera de estos derechos, escribenos a hola@bembe.pr. Responderemos dentro de 30 dias.`,
      },
      {
        heading: "8. Cumplimiento CCPA (Residentes de California)",
        body: `Si eres residente de California, tienes derechos adicionales bajo la Ley de Privacidad del Consumidor de California (CCPA):

- Derecho a saber que informacion personal recopilamos, usamos y divulgamos.
- Derecho a eliminar tu informacion personal.
- Derecho a optar por no participar en la venta de tu informacion personal. Bembe no vende informacion personal.
- Derecho a no discriminacion por ejercer tus derechos CCPA.

Para hacer una solicitud CCPA, envia un correo a hola@bembe.pr con el asunto "Solicitud CCPA."`,
      },
      {
        heading: "9. Privacidad de Menores",
        body: `Bembe no esta dirigido a menores de 13 anos. No recopilamos intencionalmente informacion personal de menores de 13 anos. Si nos enteramos de que hemos recopilado datos de un menor de 13 anos, los eliminaremos de inmediato.`,
      },
      {
        heading: "10. Seguridad de Datos",
        body: `Implementamos medidas tecnicas y organizativas apropiadas para proteger tus datos personales, incluyendo cifrado en transito (HTTPS/TLS) y autenticacion segura a traves de Supabase. Sin embargo, ningun metodo de transmision electronica o almacenamiento es 100% seguro, y no podemos garantizar seguridad absoluta.`,
      },
      {
        heading: "11. Cambios a esta Politica",
        body: `Podemos actualizar esta Politica de Privacidad periodicamente. Notificaremos a los usuarios registrados de cambios materiales por correo electronico. La fecha de "Ultima actualizacion" en la parte superior de esta pagina refleja la revision mas reciente.`,
      },
      {
        heading: "12. Contacto",
        body: `Si tienes preguntas o inquietudes sobre esta Politica de Privacidad, contactanos en:

Correo electronico: hola@bembe.pr`,
      },
    ],
  },
};

export default function PrivacyPage() {
  const { locale } = useI18n();
  const c = content[locale];

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl">
          {c.title}
        </h1>
        <p className="mt-2 text-sm text-bembe-night/50">{c.lastUpdated}</p>

        <div className="mt-10 space-y-8">
          {c.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-bold text-bembe-night">
                {section.heading}
              </h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-bembe-night/70">
                {section.body}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-bembe-night/10 pt-8">
          <Link
            href="/"
            className="text-sm font-semibold text-bembe-teal hover:text-bembe-teal/80"
          >
            &larr; {locale === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
