import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Journey } from "@/components/Journey";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a software developer who moved from accounting into code, and owns the Accountbiz accounting software.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <PageShell
        kicker="About"
        title={<>The human <span className="font-serif font-normal italic text-lime">behind the code.</span></>}
        intro="I build full-stack applications, mobile experiences and business systems. I started from the accounting side, which is why the software I write cares about ledgers, vouchers and GST."
      >
        <div className="grid gap-10 md:grid-cols-2">
          <p className="leading-relaxed text-muted">
            Accountbiz is my main product: accounting and billing software I own, design and develop. I have also worked on modernizing a legacy CRM/ERP
            application into a web application, built React Native apps, and made two public tools, Clip-CSS and Qresume.
          </p>
          <p className="leading-relaxed text-muted">
            Prefer a story? The interactive version has a small robot telling this in Hinglish.{" "}
            <Link href="/story" className="font-semibold text-fg underline decoration-lime underline-offset-4">Watch the story</Link>.
          </p>
        </div>
      </PageShell>
      <Journey />
    </>
  );
}
