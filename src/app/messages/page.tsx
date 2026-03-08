"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface MockConversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv-1",
    name: "Luna Rivera",
    avatar: "LR",
    lastMessage: "Me encanta tu nueva caminata por Santurce! Cuando la publicas?",
    timestamp: "2:30 PM",
    unread: 2,
  },
  {
    id: "conv-2",
    name: "Carlos Vega",
    avatar: "CV",
    lastMessage: "Gracias por el tip! Significa mucho para mi como artista.",
    timestamp: "11:15 AM",
    unread: 0,
  },
  {
    id: "conv-3",
    name: "Sofia Marquez",
    avatar: "SM",
    lastMessage: "Podemos coordinar para la caminata en Ponce este sabado?",
    timestamp: "Yesterday",
    unread: 1,
  },
  {
    id: "conv-4",
    name: "Diego Torres",
    avatar: "DT",
    lastMessage: "El mural quedo increible. Tienes que verlo en persona.",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: "conv-5",
    name: "Mia Fontana",
    avatar: "MF",
    lastMessage: "Hola! Vi tu perfil y me gustaria hacer una caminata contigo.",
    timestamp: "Mar 5",
    unread: 0,
  },
];

export default function MessagesPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bembe-sand/95 backdrop-blur-sm border-b border-bembe-night/10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-bembe-night/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">{t.messages.title}</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bembe-night/40" />
            <input
              type="text"
              placeholder={t.messages.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-bembe-night/10 text-sm focus:outline-none focus:ring-2 focus:ring-bembe-teal/30"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-3xl mx-auto">
        {filtered.length > 0 ? (
          <ul className="divide-y divide-bembe-night/5">
            {filtered.map((conversation) => (
              <li key={conversation.id}>
                <Link
                  href={`/messages/${conversation.id}`}
                  className="flex items-center gap-3 px-4 py-4 hover:bg-white/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-bembe-teal to-bembe-coral flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {conversation.avatar}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3
                        className={`text-sm font-semibold truncate ${
                          conversation.unread > 0
                            ? "text-bembe-night"
                            : "text-bembe-night/80"
                        }`}
                      >
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-bembe-night/40 flex-shrink-0 ml-2">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${
                          conversation.unread > 0
                            ? "text-bembe-night/70 font-medium"
                            : "text-bembe-night/50"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="flex-shrink-0 ml-2 w-5 h-5 rounded-full bg-bembe-coral text-white text-[10px] font-bold flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-bembe-night/20" />
            <p className="font-medium text-bembe-night/60">
              {t.messages.empty}
            </p>
            <p className="text-sm mt-1 text-bembe-night/40">
              {t.messages.empty_desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
