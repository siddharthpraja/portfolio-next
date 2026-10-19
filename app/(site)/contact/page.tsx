import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Gautam Prajapati on WhatsApp, LinkedIn, GitHub or Instagram to discuss a project.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-14">
      <Contact />
    </div>
  );
}
