"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { useI18n } from "@/lib/i18n/context";

const content = {
  en: {
    title: "Refund Policy",
    lastUpdated: "Last updated: March 9, 2026",
    sections: [
      {
        heading: "1. Walk Purchases",
        body: `We want you to love every walk you experience on Bembe. If you are unsatisfied with a purchased walk, you may request a refund under the following conditions:

- Refund requests must be made within 24 hours of purchase.
- The walk must not have been started (no stops played).
- Refunds are issued to the original payment method via Stripe.

If a walk has technical issues that prevent playback (missing audio, broken GPS triggers), contact us and we will issue a full refund regardless of time elapsed.`,
      },
      {
        heading: "2. Gift Walks",
        body: `Gift walk purchases may be refunded if the gift has not yet been redeemed by the recipient. Once a gift code has been redeemed, the purchase is non-refundable.

If you purchased a gift and the recipient has not received or redeemed it, contact us at hola@bembe.pr with your order details.`,
      },
      {
        heading: "3. Subscriptions",
        body: `Artist subscriptions are billed monthly. You may cancel your subscription at any time.

- If you cancel within the first 7 days of your initial subscription, you may request a full refund.
- After the first 7 days, cancellations take effect at the end of the current billing period. No partial refunds are issued for the remaining days in a billing cycle.
- If you were charged after canceling, contact us for a full refund of the erroneous charge.`,
      },
      {
        heading: "4. Tips",
        body: `Tips sent to artists are voluntary and non-refundable. Tips are sent directly to the artist's account and cannot be reversed once processed.`,
      },
      {
        heading: "5. Processing Time",
        body: `Approved refunds are processed within 5-10 business days. The refund will appear on your statement depending on your bank or credit card provider, which may take an additional 1-2 billing cycles.`,
      },
      {
        heading: "6. How to Request a Refund",
        body: `To request a refund, send an email to hola@bembe.pr with:

- Your account email address.
- The walk or subscription in question.
- The reason for your refund request.
- Your order confirmation or transaction ID (if available).

We aim to respond to all refund requests within 2 business days.`,
      },
      {
        heading: "7. Disputes",
        body: `If you believe a charge was made in error or without your authorization, please contact us at hola@bembe.pr before filing a dispute with your bank. We are committed to resolving issues quickly and fairly.`,
      },
      {
        heading: "8. Contact",
        body: `For any questions about our refund policy:

Email: hola@bembe.pr`,
      },
    ],
  },
  es: {
    title: "Politica de Reembolsos",
    lastUpdated: "Ultima actualizacion: 9 de marzo de 2026",
    sections: [
      {
        heading: "1. Compras de Caminatas",
        body: `Queremos que disfrutes cada caminata que experimentes en Bembe. Si no estas satisfecho con una caminata comprada, puedes solicitar un reembolso bajo las siguientes condiciones:

- Las solicitudes de reembolso deben hacerse dentro de las 24 horas posteriores a la compra.
- La caminata no debe haber sido iniciada (ninguna parada reproducida).
- Los reembolsos se emiten al metodo de pago original a traves de Stripe.

Si una caminata tiene problemas tecnicos que impiden la reproduccion (audio faltante, activadores GPS danados), contactanos y emitiremos un reembolso completo sin importar el tiempo transcurrido.`,
      },
      {
        heading: "2. Caminatas de Regalo",
        body: `Las compras de caminatas de regalo pueden ser reembolsadas si el regalo aun no ha sido canjeado por el destinatario. Una vez que un codigo de regalo ha sido canjeado, la compra no es reembolsable.

Si compraste un regalo y el destinatario no lo ha recibido o canjeado, contactanos a hola@bembe.pr con los detalles de tu orden.`,
      },
      {
        heading: "3. Suscripciones",
        body: `Las suscripciones de artistas se cobran mensualmente. Puedes cancelar tu suscripcion en cualquier momento.

- Si cancelas dentro de los primeros 7 dias de tu suscripcion inicial, puedes solicitar un reembolso completo.
- Despues de los primeros 7 dias, las cancelaciones toman efecto al final del periodo de facturacion actual. No se emiten reembolsos parciales por los dias restantes en un ciclo de facturacion.
- Si se te cobro despues de cancelar, contactanos para un reembolso completo del cargo erroneo.`,
      },
      {
        heading: "4. Propinas",
        body: `Las propinas enviadas a artistas son voluntarias y no reembolsables. Las propinas se envian directamente a la cuenta del artista y no pueden ser revertidas una vez procesadas.`,
      },
      {
        heading: "5. Tiempo de Procesamiento",
        body: `Los reembolsos aprobados se procesan dentro de 5-10 dias habiles. El reembolso aparecera en tu estado de cuenta dependiendo de tu banco o proveedor de tarjeta de credito, lo cual puede tomar 1-2 ciclos de facturacion adicionales.`,
      },
      {
        heading: "6. Como Solicitar un Reembolso",
        body: `Para solicitar un reembolso, envia un correo electronico a hola@bembe.pr con:

- Tu correo electronico de cuenta.
- La caminata o suscripcion en cuestion.
- La razon de tu solicitud de reembolso.
- Tu confirmacion de orden o ID de transaccion (si esta disponible).

Nuestro objetivo es responder a todas las solicitudes de reembolso dentro de 2 dias habiles.`,
      },
      {
        heading: "7. Disputas",
        body: `Si crees que se realizo un cargo por error o sin tu autorizacion, por favor contactanos a hola@bembe.pr antes de presentar una disputa con tu banco. Estamos comprometidos a resolver los problemas de manera rapida y justa.`,
      },
      {
        heading: "8. Contacto",
        body: `Para cualquier pregunta sobre nuestra politica de reembolsos:

Correo electronico: hola@bembe.pr`,
      },
    ],
  },
};

export default function RefundsPage() {
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
