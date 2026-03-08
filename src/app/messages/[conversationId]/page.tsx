"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useParams } from "next/navigation";
import MessageBubble from "@/components/message-bubble";

interface MockMessage {
  id: string;
  body: string;
  isSent: boolean;
  timestamp: string;
  senderName: string;
}

const MOCK_PARTICIPANTS: Record<string, string> = {
  "conv-1": "Luna Rivera",
  "conv-2": "Carlos Vega",
  "conv-3": "Sofia Marquez",
  "conv-4": "Diego Torres",
  "conv-5": "Mia Fontana",
};

const MOCK_MESSAGES: Record<string, MockMessage[]> = {
  "conv-1": [
    {
      id: "m1",
      body: "Hola! Vi tu caminata por Santurce en el mapa.",
      isSent: false,
      timestamp: "2:15 PM",
      senderName: "Luna Rivera",
    },
    {
      id: "m2",
      body: "Que bueno! Si, estoy trabajando en una nueva ruta por la Calle Cerra.",
      isSent: true,
      timestamp: "2:20 PM",
      senderName: "You",
    },
    {
      id: "m3",
      body: "Me encanta tu nueva caminata por Santurce! Cuando la publicas?",
      isSent: false,
      timestamp: "2:30 PM",
      senderName: "Luna Rivera",
    },
  ],
  "conv-2": [
    {
      id: "m1",
      body: "Acabo de terminar tu caminata por Old San Juan. Increible!",
      isSent: true,
      timestamp: "10:45 AM",
      senderName: "You",
    },
    {
      id: "m2",
      body: "Te deje un tip porque de verdad me encanto la narracion en La Perla.",
      isSent: true,
      timestamp: "10:46 AM",
      senderName: "You",
    },
    {
      id: "m3",
      body: "Gracias por el tip! Significa mucho para mi como artista.",
      isSent: false,
      timestamp: "11:15 AM",
      senderName: "Carlos Vega",
    },
  ],
  "conv-3": [
    {
      id: "m1",
      body: "Hola Sofia! Estoy planeando una caminata en Ponce.",
      isSent: true,
      timestamp: "9:00 AM",
      senderName: "You",
    },
    {
      id: "m2",
      body: "Que chevere! Yo conozco muy bien el area del centro historico.",
      isSent: false,
      timestamp: "9:30 AM",
      senderName: "Sofia Marquez",
    },
    {
      id: "m3",
      body: "Podemos coordinar para la caminata en Ponce este sabado?",
      isSent: false,
      timestamp: "9:45 AM",
      senderName: "Sofia Marquez",
    },
  ],
};

// Default messages for any conversation ID not in the map
const DEFAULT_MESSAGES: MockMessage[] = [
  {
    id: "m1",
    body: "Hola! Bienvenido a Bembe.",
    isSent: false,
    timestamp: "12:00 PM",
    senderName: "Artist",
  },
  {
    id: "m2",
    body: "Gracias! Me encanta la plataforma.",
    isSent: true,
    timestamp: "12:05 PM",
    senderName: "You",
  },
];

export default function ConversationPage() {
  const { t } = useI18n();
  const params = useParams();
  const conversationId = params.conversationId as string;

  const participantName =
    MOCK_PARTICIPANTS[conversationId] || "Artist";
  const initialMessages =
    MOCK_MESSAGES[conversationId] || DEFAULT_MESSAGES;

  const [messages, setMessages] = useState<MockMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: MockMessage = {
      id: `m${messages.length + 1}`,
      body: input.trim(),
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      senderName: "You",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bembe-sand">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bembe-sand/95 backdrop-blur-sm border-b border-bembe-night/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/messages"
            className="p-2 -ml-2 rounded-lg hover:bg-bembe-night/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bembe-teal to-bembe-coral flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {participantName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <h1 className="text-base font-semibold">{participantName}</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl w-full mx-auto">
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 bg-bembe-night/5 rounded-full text-xs text-bembe-night/40">
            {t.messages.today}
          </span>
        </div>

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.body}
            timestamp={msg.timestamp}
            isSent={msg.isSent}
            senderName={msg.isSent ? undefined : msg.senderName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-bembe-night/10 bg-bembe-sand/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-end gap-2">
          <input
            type="text"
            placeholder={t.messages.type_message}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 bg-white rounded-xl border border-bembe-night/10 text-sm focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-bembe-teal text-white hover:bg-bembe-teal/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={t.messages.send}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
