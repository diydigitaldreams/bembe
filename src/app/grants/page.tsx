"use client";

import Link from "next/link";
import { ChevronLeft, FileText, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function GrantsPage() {
  const { locale } = useI18n();
  const es = locale === "es";

  return (
    <div className="min-h-screen bg-bembe-sand">
      <div className="sticky top-0 z-10 bg-bembe-sand/95 backdrop-blur-sm border-b border-bembe-night/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-bembe-night/5">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">
            {es ? "Asistente de Becas" : "Grant Assistant"}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <FileText className="w-12 h-12 text-bembe-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-bembe-night mb-3">
            {es
              ? "Ayuda con Solicitudes de Becas"
              : "Grant Application Assistance"}
          </h2>
          <p className="text-bembe-night/60 mb-6 max-w-md mx-auto">
            {es
              ? "Recibe orientacion para solicitar becas de arte y cultura en Puerto Rico. Conocemos las fundaciones locales y sus requisitos."
              : "Get guidance on applying for arts and culture grants in Puerto Rico. We know the local foundations and their requirements."}
          </p>
          <a
            href="mailto:grants@bembe.pr?subject=Grant%20Assistance"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bembe-gold text-bembe-night font-semibold hover:bg-bembe-gold/90 transition"
          >
            <Mail className="w-4 h-4" />
            {es ? "Contactar para Ayuda" : "Contact for Help"}
          </a>
        </div>
      </div>
    </div>
  );
}
