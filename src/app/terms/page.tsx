"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { useI18n } from "@/lib/i18n/context";

const content = {
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: March 9, 2026",
    sections: [
      {
        heading: "1. About Bembe",
        body: `Bembe ("we", "us", "our") is an audio art walk marketplace that connects artists in Puerto Rico with people who want to experience the island's culture through immersive, GPS-guided audio walks. Our platform is accessible at bembe.vercel.app and related domains.

By accessing or using Bembe, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.`,
      },
      {
        heading: "2. User Accounts",
        body: `To use certain features of Bembe, you must create an account. You agree to:

- Provide accurate and complete information during registration.
- Keep your login credentials secure and confidential.
- Notify us immediately of any unauthorized access to your account.
- Be responsible for all activity that occurs under your account.

You may register as a Patron (listener/walker), an Artist (content creator), or both. We reserve the right to suspend or terminate accounts that violate these terms.`,
      },
      {
        heading: "3. Content Ownership and Licensing",
        body: `Artists retain full intellectual property rights to all content they create and upload to Bembe, including audio recordings, descriptions, images, and walk routes.

By publishing content on Bembe, artists grant Bembe a non-exclusive, worldwide, royalty-free license to display, distribute, stream, and promote their content on the platform and in marketing materials. This license continues for as long as the content remains published on the platform.

Artists may remove their content at any time, which will terminate this license (except for any copies already purchased by users).

Users may not copy, redistribute, or commercially exploit any content from the platform without explicit permission from the artist.`,
      },
      {
        heading: "4. Payments and Fees",
        body: `Bembe uses Stripe Connect to process payments. When a walk is sold:

- Bembe charges a 12% platform fee on each transaction.
- Stripe charges its standard processing fees (approximately 2.9% + $0.30 per transaction).
- The remaining amount is deposited directly to the artist's connected Stripe account.

Artists are responsible for any taxes owed on their earnings. Bembe does not withhold taxes on behalf of artists.

Tips sent to artists follow the same fee structure. Subscription payments are processed monthly through Stripe.`,
      },
      {
        heading: "5. Walk Purchases and Access",
        body: `When you purchase a walk, you receive a personal, non-transferable license to access and play that walk's content. Free walks are available to all registered users.

Gifted walks may be redeemed by the recipient through a unique gift code. Each gift code may be redeemed once.

We strive to keep all purchased walks available, but we cannot guarantee perpetual access if an artist removes their content or the platform ceases operation.`,
      },
      {
        heading: "6. Refunds",
        body: `Please see our Refund Policy at /refunds for details on our refund practices. In general:

- Walk purchases may be refunded within 24 hours if the walk has not been started.
- Gift walk refunds are available before the gift is redeemed.
- Subscription refunds are handled on a prorated basis.

All refund requests should be sent to hola@bembe.pr.`,
      },
      {
        heading: "7. Prohibited Conduct",
        body: `You agree not to:

- Upload content that infringes on intellectual property rights of others.
- Use the platform for harassment, hate speech, or illegal activity.
- Attempt to reverse-engineer, hack, or disrupt the platform.
- Create fake accounts or manipulate reviews and ratings.
- Scrape or automated-download content from the platform.
- Use the platform to distribute malware or spam.
- Misrepresent your identity or affiliation with any person or organization.`,
      },
      {
        heading: "8. Location Services",
        body: `Bembe uses GPS and location data to provide the walk experience. Location data is used only during active walks to trigger audio at the correct stops. See our Privacy Policy for details on how location data is handled.

You may disable location services at any time, though this will affect the walk experience.`,
      },
      {
        heading: "9. Limitation of Liability",
        body: `Bembe is provided "as is" without warranties of any kind, express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components.

To the maximum extent permitted by law, Bembe shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.

Our total liability for any claim arising from these terms or your use of the platform shall not exceed the amount you paid to Bembe in the 12 months preceding the claim.

Bembe is not responsible for physical safety during walks. Users walk at their own risk and should exercise caution, obey traffic laws, and be aware of their surroundings.`,
      },
      {
        heading: "10. Modifications to Terms",
        body: `We may update these Terms of Service from time to time. We will notify registered users of material changes via email or in-app notification. Continued use of the platform after changes constitutes acceptance of the updated terms.`,
      },
      {
        heading: "11. Governing Law",
        body: `These Terms of Service are governed by and construed in accordance with the laws of the Commonwealth of Puerto Rico. Any disputes arising from these terms shall be resolved in the courts of Puerto Rico.`,
      },
      {
        heading: "12. Contact",
        body: `If you have questions about these Terms of Service, contact us at:

Email: hola@bembe.pr`,
      },
    ],
  },
  es: {
    title: "Terminos de Servicio",
    lastUpdated: "Ultima actualizacion: 9 de marzo de 2026",
    sections: [
      {
        heading: "1. Sobre Bembe",
        body: `Bembe ("nosotros", "nuestro") es un marketplace de caminatas de arte en audio que conecta a artistas en Puerto Rico con personas que desean experimentar la cultura de la isla a traves de caminatas inmersivas guiadas por GPS. Nuestra plataforma esta disponible en bembe.vercel.app y dominios relacionados.

Al acceder o usar Bembe, aceptas estos Terminos de Servicio. Si no estas de acuerdo, por favor no uses la plataforma.`,
      },
      {
        heading: "2. Cuentas de Usuario",
        body: `Para usar ciertas funciones de Bembe, debes crear una cuenta. Te comprometes a:

- Proveer informacion precisa y completa durante el registro.
- Mantener tus credenciales de acceso seguras y confidenciales.
- Notificarnos inmediatamente de cualquier acceso no autorizado a tu cuenta.
- Ser responsable de toda la actividad que ocurra bajo tu cuenta.

Puedes registrarte como Patron (oyente/caminante), Artista (creador de contenido), o ambos. Nos reservamos el derecho de suspender o terminar cuentas que violen estos terminos.`,
      },
      {
        heading: "3. Propiedad del Contenido y Licencias",
        body: `Los artistas retienen todos los derechos de propiedad intelectual sobre el contenido que crean y suben a Bembe, incluyendo grabaciones de audio, descripciones, imagenes y rutas de caminatas.

Al publicar contenido en Bembe, los artistas otorgan a Bembe una licencia no exclusiva, mundial y libre de regalias para mostrar, distribuir, transmitir y promover su contenido en la plataforma y en materiales de marketing. Esta licencia continua mientras el contenido permanezca publicado en la plataforma.

Los artistas pueden remover su contenido en cualquier momento, lo cual terminara esta licencia (excepto por copias ya compradas por usuarios).

Los usuarios no pueden copiar, redistribuir o explotar comercialmente ningun contenido de la plataforma sin permiso explicito del artista.`,
      },
      {
        heading: "4. Pagos y Tarifas",
        body: `Bembe usa Stripe Connect para procesar pagos. Cuando se vende una caminata:

- Bembe cobra una tarifa de plataforma del 12% por cada transaccion.
- Stripe cobra sus tarifas estandar de procesamiento (aproximadamente 2.9% + $0.30 por transaccion).
- El monto restante se deposita directamente en la cuenta Stripe conectada del artista.

Los artistas son responsables de los impuestos correspondientes a sus ganancias. Bembe no retiene impuestos en nombre de los artistas.

Las propinas enviadas a artistas siguen la misma estructura de tarifas. Los pagos de suscripcion se procesan mensualmente a traves de Stripe.`,
      },
      {
        heading: "5. Compras de Caminatas y Acceso",
        body: `Al comprar una caminata, recibes una licencia personal e intransferible para acceder y reproducir el contenido de esa caminata. Las caminatas gratuitas estan disponibles para todos los usuarios registrados.

Las caminatas regaladas pueden ser canjeadas por el destinatario mediante un codigo de regalo unico. Cada codigo de regalo puede ser canjeado una vez.

Nos esforzamos por mantener todas las caminatas compradas disponibles, pero no podemos garantizar acceso perpetuo si un artista remueve su contenido o la plataforma cesa operaciones.`,
      },
      {
        heading: "6. Reembolsos",
        body: `Consulta nuestra Politica de Reembolsos en /refunds para detalles sobre nuestras practicas de reembolso. En general:

- Las compras de caminatas pueden ser reembolsadas dentro de 24 horas si la caminata no ha sido iniciada.
- Los reembolsos de caminatas regaladas estan disponibles antes de que el regalo sea canjeado.
- Los reembolsos de suscripciones se manejan de forma prorrateada.

Todas las solicitudes de reembolso deben enviarse a hola@bembe.pr.`,
      },
      {
        heading: "7. Conducta Prohibida",
        body: `Te comprometes a no:

- Subir contenido que infrinja derechos de propiedad intelectual de otros.
- Usar la plataforma para acoso, discurso de odio o actividades ilegales.
- Intentar realizar ingenieria inversa, hackear o interrumpir la plataforma.
- Crear cuentas falsas o manipular resenas y calificaciones.
- Extraer o descargar automaticamente contenido de la plataforma.
- Usar la plataforma para distribuir malware o spam.
- Tergiversar tu identidad o afiliacion con cualquier persona u organizacion.`,
      },
      {
        heading: "8. Servicios de Ubicacion",
        body: `Bembe usa GPS y datos de ubicacion para proveer la experiencia de caminata. Los datos de ubicacion se usan solo durante caminatas activas para activar el audio en las paradas correctas. Consulta nuestra Politica de Privacidad para detalles sobre como se manejan los datos de ubicacion.

Puedes desactivar los servicios de ubicacion en cualquier momento, aunque esto afectara la experiencia de caminata.`,
      },
      {
        heading: "9. Limitacion de Responsabilidad",
        body: `Bembe se provee "tal cual" sin garantias de ningun tipo, expresas o implicitas. No garantizamos que la plataforma sera ininterrumpida, libre de errores o libre de componentes daninos.

En la maxima medida permitida por la ley, Bembe no sera responsable por danos indirectos, incidentales, especiales, consecuentes o punitivos que surjan de tu uso de la plataforma.

Nuestra responsabilidad total por cualquier reclamo que surja de estos terminos o tu uso de la plataforma no excedera el monto que pagaste a Bembe en los 12 meses anteriores al reclamo.

Bembe no es responsable de la seguridad fisica durante las caminatas. Los usuarios caminan bajo su propio riesgo y deben ejercer precaucion, obedecer las leyes de transito y estar atentos a su entorno.`,
      },
      {
        heading: "10. Modificaciones a los Terminos",
        body: `Podemos actualizar estos Terminos de Servicio periodicamente. Notificaremos a los usuarios registrados de cambios materiales por correo electronico o notificacion en la aplicacion. El uso continuado de la plataforma despues de los cambios constituye aceptacion de los terminos actualizados.`,
      },
      {
        heading: "11. Ley Aplicable",
        body: `Estos Terminos de Servicio se rigen e interpretan de acuerdo con las leyes del Estado Libre Asociado de Puerto Rico. Cualquier disputa que surja de estos terminos sera resuelta en los tribunales de Puerto Rico.`,
      },
      {
        heading: "12. Contacto",
        body: `Si tienes preguntas sobre estos Terminos de Servicio, contactanos en:

Correo electronico: hola@bembe.pr`,
      },
    ],
  },
};

export default function TermsPage() {
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
