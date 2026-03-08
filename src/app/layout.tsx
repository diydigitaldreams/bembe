import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "Bembe — Puerto Rico's Living Art Museum",
  description:
    "Discover Puerto Rico through the eyes of local artists. Audio walks, stories, and cultural experiences that turn the island into an open-air museum.",
  keywords: [
    "Puerto Rico",
    "art walks",
    "cultural tourism",
    "local artists",
    "Boricua",
    "art experiences",
  ],
  openGraph: {
    title: "Bembe — Puerto Rico's Living Art Museum",
    description:
      "Audio art walks created by local Puerto Rican artists. Discover the island like never before.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A7A6D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
