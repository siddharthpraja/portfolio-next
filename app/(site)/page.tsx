import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Engineering } from "@/components/Engineering";
import { Journey } from "@/components/Journey";
import { AccountbizSection } from "@/components/AccountbizSection";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Engineering />
      <Journey />
      <AccountbizSection />
      <Contact />
    </>
  );
}
