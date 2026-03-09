"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { useI18n } from "@/lib/i18n/context";
import {
  ChevronLeft,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  MessageCircle,
  Send,
  X,
  Loader2,
  Bot,
  User,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function GrantChatModal({
  open,
  onClose,
  es,
}: {
  open: boolean;
  onClose: () => void;
  es: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: es
        ? "¡Hola! Soy el asistente de becas de Bembé. Puedo ayudarte a encontrar becas de arte y cultura en Puerto Rico, explicar requisitos, y guiarte en el proceso de solicitud. ¿En qué te puedo ayudar?"
        : "Hi! I'm the Bembé grant assistant. I can help you find arts and culture grants in Puerto Rico, explain requirements, and guide you through the application process. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/grants/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, locale: es ? "es" : "en" }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: es
            ? "Lo siento, hubo un error. Por favor intenta de nuevo."
            : "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-bembe-night/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-bembe-gold/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-bembe-gold" />
            </div>
            <div>
              <h3 className="font-bold text-bembe-night text-sm">
                {es ? "Asistente de Becas" : "Grant Assistant"}
              </h3>
              <p className="text-xs text-bembe-night/50">
                {es ? "Impulsado por IA" : "AI-powered"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bembe-night/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-bembe-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-bembe-gold" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-bembe-teal text-white"
                    : "bg-bembe-night/5 text-bembe-night"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="h-7 w-7 rounded-full bg-bembe-teal/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-bembe-teal" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-full bg-bembe-gold/20 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-bembe-gold" />
              </div>
              <div className="bg-bembe-night/5 rounded-2xl px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-bembe-night/40" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-bembe-night/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                es ? "Pregunta sobre becas..." : "Ask about grants..."
              }
              className="flex-1 rounded-xl border border-bembe-night/10 px-4 py-2.5 text-sm focus:outline-none focus:border-bembe-gold focus:ring-1 focus:ring-bembe-gold/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-10 w-10 rounded-xl bg-bembe-gold text-white flex items-center justify-center hover:bg-bembe-gold/90 transition disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const GRANT_SECTIONS = {
  en: [
    {
      title: "National Endowment for the Arts (NEA)",
      desc: "Federal grants for artistic excellence. The NEA funds projects in every artistic discipline including visual arts, music, dance, theater, and media arts. Puerto Rico-based artists and organizations are eligible for most programs.",
      amount: "$10,000 – $100,000",
      deadline: "Various — check NEA.gov",
    },
    {
      title: "Instituto de Cultura Puertorriqueña (ICP)",
      desc: "Puerto Rico's primary cultural institution offers grants and support for artists preserving and promoting Puerto Rican culture. Programs include visual arts exhibitions, music production, and cultural heritage projects.",
      amount: "Varies by program",
      deadline: "Rolling applications",
    },
    {
      title: "Fundación Puertorriqueña de las Humanidades",
      desc: "Supports humanities-based projects including oral history, documentary work, and cultural preservation. Ideal for artists working on community stories, heritage walks, and educational content.",
      amount: "$1,000 – $15,000",
      deadline: "Quarterly cycles",
    },
    {
      title: "Fondos Flamboyán para las Artes",
      desc: "Dedicated to supporting emerging and mid-career artists in Puerto Rico. Offers project grants, professional development funding, and residency support for creative professionals across disciplines.",
      amount: "$2,500 – $25,000",
      deadline: "Annual cycle — typically spring",
    },
    {
      title: "Municipal Cultural Programs",
      desc: "Many municipalities in Puerto Rico have their own cultural programs and small grants for local artists. Check with your local municipality's cultural affairs office for neighborhood-specific opportunities.",
      amount: "$500 – $5,000",
      deadline: "Varies by municipality",
    },
  ],
  es: [
    {
      title: "National Endowment for the Arts (NEA)",
      desc: "Becas federales para excelencia artística. El NEA financia proyectos en todas las disciplinas artísticas incluyendo artes visuales, música, danza, teatro y artes mediáticas. Artistas y organizaciones de Puerto Rico son elegibles.",
      amount: "$10,000 – $100,000",
      deadline: "Varias — consulta NEA.gov",
    },
    {
      title: "Instituto de Cultura Puertorriqueña (ICP)",
      desc: "La principal institución cultural de Puerto Rico ofrece becas y apoyo para artistas que preservan y promueven la cultura puertorriqueña. Incluye exhibiciones de artes visuales, producción musical y proyectos de patrimonio.",
      amount: "Varía por programa",
      deadline: "Solicitudes continuas",
    },
    {
      title: "Fundación Puertorriqueña de las Humanidades",
      desc: "Apoya proyectos basados en humanidades incluyendo historia oral, documentales y preservación cultural. Ideal para artistas trabajando en historias comunitarias, caminatas patrimoniales y contenido educativo.",
      amount: "$1,000 – $15,000",
      deadline: "Ciclos trimestrales",
    },
    {
      title: "Fondos Flamboyán para las Artes",
      desc: "Dedicado a apoyar artistas emergentes y de carrera media en Puerto Rico. Ofrece becas de proyecto, fondos para desarrollo profesional y apoyo de residencias para profesionales creativos.",
      amount: "$2,500 – $25,000",
      deadline: "Ciclo anual — típicamente primavera",
    },
    {
      title: "Programas Culturales Municipales",
      desc: "Muchos municipios en Puerto Rico tienen sus propios programas culturales y pequeñas becas para artistas locales. Consulta con la oficina de asuntos culturales de tu municipio para oportunidades específicas.",
      amount: "$500 – $5,000",
      deadline: "Varía por municipio",
    },
  ],
};

export default function GrantsPage() {
  const { locale } = useI18n();
  const es = locale === "es";
  const [chatOpen, setChatOpen] = useState(false);

  const sections = es ? GRANT_SECTIONS.es : GRANT_SECTIONS.en;

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-bembe-night/50 hover:text-bembe-night transition mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            {es ? "Inicio" : "Home"}
          </Link>
          <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl mb-3">
            {es
              ? "Becas y Fondos para Artistas en Puerto Rico"
              : "Grants & Funding for Artists in Puerto Rico"}
          </h1>
          <p className="text-lg text-bembe-night/60 leading-relaxed">
            {es
              ? "Puerto Rico tiene un ecosistema rico de oportunidades de financiamiento para artistas y creadores culturales. Aquí encontrarás los principales programas de becas disponibles."
              : "Puerto Rico has a rich ecosystem of funding opportunities for artists and cultural creators. Here are the main grant programs available to you."}
          </p>
        </div>

        {/* Grant cards */}
        <div className="space-y-5 mb-12">
          {sections.map((grant, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-bembe-night/5"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-bembe-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="h-5 w-5 text-bembe-gold" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-bembe-night mb-2">
                    {grant.title}
                  </h2>
                  <p className="text-sm text-bembe-night/60 leading-relaxed mb-3">
                    {grant.desc}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-bembe-night/50">
                      <DollarSign className="w-3.5 h-3.5 text-bembe-gold" />
                      {grant.amount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-bembe-night/50">
                      <Calendar className="w-3.5 h-3.5 text-bembe-teal" />
                      {grant.deadline}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips section */}
        <div className="bg-bembe-teal/5 rounded-2xl p-6 mb-12 border border-bembe-teal/10">
          <h2 className="text-xl font-bold text-bembe-night mb-4">
            {es ? "Consejos para tu solicitud" : "Application Tips"}
          </h2>
          <div className="space-y-3">
            {(es
              ? [
                  "Empieza temprano — la mayoría de las becas requieren documentos que toman tiempo conseguir.",
                  "Incluye muestras de trabajo de alta calidad (fotos, videos, audio).",
                  "Escribe una narrativa clara sobre el impacto comunitario de tu proyecto.",
                  "Pide cartas de apoyo de organizaciones comunitarias locales.",
                  "Prepara un presupuesto detallado y realista.",
                ]
              : [
                  "Start early — most grants require documents that take time to gather.",
                  "Include high-quality work samples (photos, videos, audio).",
                  "Write a clear narrative about your project's community impact.",
                  "Get support letters from local community organizations.",
                  "Prepare a detailed, realistic budget.",
                ]
            ).map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-bembe-teal shrink-0 mt-0.5" />
                <p className="text-sm text-bembe-night/70">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — Grant Assistant */}
        <div className="bg-gradient-to-br from-bembe-gold to-yellow-500 rounded-2xl p-8 text-center shadow-lg">
          <MessageCircle className="w-10 h-10 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {es ? "¿Necesitas ayuda?" : "Need help?"}
          </h2>
          <p className="text-white/80 mb-5 max-w-md mx-auto">
            {es
              ? "Nuestro asistente de becas con IA puede ayudarte a encontrar la beca perfecta, entender requisitos y preparar tu solicitud."
              : "Our AI-powered grant assistant can help you find the right grant, understand requirements, and prepare your application."}
          </p>
          <button
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-bembe-night font-semibold shadow-lg hover:bg-white/90 transition"
          >
            <Bot className="w-5 h-5" />
            {es
              ? "Usar el Asistente de Becas"
              : "Use the Grant Assistant"}
          </button>
        </div>
      </div>

      <GrantChatModal open={chatOpen} onClose={() => setChatOpen(false)} es={es} />
    </div>
  );
}
