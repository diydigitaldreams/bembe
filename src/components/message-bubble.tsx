"use client";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isSent: boolean;
  senderName?: string;
}

export default function MessageBubble({
  message,
  timestamp,
  isSent,
  senderName,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isSent
            ? "bg-bembe-teal text-white rounded-br-md"
            : "bg-white text-bembe-night rounded-bl-md border border-bembe-night/5"
        }`}
      >
        {senderName && !isSent && (
          <p className="text-xs font-semibold text-bembe-teal mb-1">
            {senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed">{message}</p>
        <p
          className={`text-[10px] mt-1 ${
            isSent ? "text-white/60" : "text-bembe-night/40"
          }`}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
}
