import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "AlternHub — L'OS des alternants",
    template: "%s | AlternHub",
  },
  description:
    "Gérez, optimisez et accélérez votre parcours professionnel en alternance. Missions, compétences, CV et rapports IA en un seul endroit.",
  keywords: ["alternance", "apprentissage", "stage", "compétences", "CV", "rapport"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
