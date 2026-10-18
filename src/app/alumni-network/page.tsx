// app/alumni-network/page.tsx
import type { Metadata } from "next";
import AlumniSection from "@components/Alumni";
import { getAlumniData } from "@lib/alumniFetcher";

export const metadata: Metadata = {
  title: "Alumni Network",
  description:
    "Explore the global alumni network of the School of Information Technology, RGPV Bhopal. Meet graduates making an impact across industry, academia, and research.",
  openGraph: {
    title: "Alumni Network | SOIT RGPV",
    description:
      "Celebrating the achievements and journeys of SoIT graduates inspiring the next generation of technologists.",
    url: "https://soitrgpv.ac.in/alumni-network",
  },
};

// Revalidate every hour — stays fast, auto-updates when alumni are approved.
export const revalidate = 3600;

export default async function AlumniNetworkPage() {
  try {
    const alumni = await getAlumniData();
    return <AlumniSection initialAlumni={alumni} />;
  } catch (error) {
    console.error("[AlumniNetworkPage] Failed to load alumni data:", error);
    // Graceful fallback — renders the component in empty state
    return <AlumniSection initialAlumni={[]} />;
  }
}