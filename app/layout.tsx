import React from "react";
import { Metadata } from "next";
import { EB_Garamond, Lato, Lora, Montserrat, Nunito, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";
import client from "@/tina/__generated__/client";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

// EB Garamond — heading font matching the original crumbsofsanity.com
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

// Lora — body serif matching the original crumbsofsanity.com
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

// Montserrat — UI / navigation labels
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Keep Playfair loaded so the legacy TinaCMS "playfair" option still renders
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Crumbs of Sanity",
  description: "A blog about life, learning, and everything in between.",
};

/** Map a hex color (e.g. "#2a5db0") to a CSS custom-property override string */
function hexToCustomProp(hex: string, prop: string): string {
  // Pass the hex value directly — browsers support hex in custom properties
  return `${prop}: ${hex};`;
}

/** Map headingFont token → CSS font-family value */
function headingFontStack(token?: string | null): string {
  switch (token) {
    case "georgia":
      return `Georgia, "Times New Roman", serif`;
    case "serif":
      return "serif";
    case "sans":
      return "ui-sans-serif, system-ui, sans-serif";
    case "playfair":
      return `var(--font-playfair), "Playfair Display", Georgia, serif`;
    case "garamond":
    default:
      return `var(--font-eb-garamond), "EB Garamond", Georgia, serif`;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch brand theme from TinaCMS content (falls back gracefully if unavailable)
  let theme: Record<string, string | null | undefined> = {};
  try {
    const { data } = await client.queries.global({ relativePath: "index.json" });
    theme = (data?.global?.theme as Record<string, string | null | undefined>) ?? {};
  } catch {
    // During static builds or if TinaCMS isn't running, use CSS defaults
  }

  const primaryColor = theme.primaryColor ?? "#a93e33";
  const accentColor  = theme.accentColor  ?? "#e0e6cf";
  const headingFont  = headingFontStack(theme.headingFont);

  // Build inline CSS variable overrides — these take precedence over styles.css defaults
  // when an editor changes a value in the TinaCMS admin panel.
  const themeVars = [
    hexToCustomProp(primaryColor, "--brand-primary"),
    hexToCustomProp(primaryColor, "--primary"),
    hexToCustomProp(accentColor,  "--accent"),
    `--font-heading: ${headingFont};`,
  ].join(" ");

  return (
    <html
      lang="en"
      className={cn(ebGaramond.variable, lora.variable, montserrat.variable, playfair.variable, nunito.variable, lato.variable)}
      style={{ ["--brand-primary" as string]: primaryColor } as React.CSSProperties}
    >
      <head>
        {/* Inline theme override — keeps CSS vars in sync with TinaCMS admin values */}
        <style>{`:root { ${themeVars} }`}</style>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
