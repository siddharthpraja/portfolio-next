import type { Metadata } from "next";
import Link from "next/link";
import { features } from "@/lib/story/features";
import { accountbizLiveUrl } from "@/lib/accountbiz";

export const metadata: Metadata = {
  title: "Accountbiz: every voucher balanced, every pain answered",
  description: "Tally-style accounting, GST returns, e-way bills, live stock, AI and approvals. Watch the pain and the fix for each feature.",
  alternates: { canonical: "/accountbiz" },
};

export default function AccountbizPage() {
  return (
    <main id="main" className="min-h-dvh bg-ink px-5 py-16 text-fg md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-8xl">Every voucher balanced. Every pain answered.</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">Accountbiz is Tally-style accounting in your browser. Pick a feature and watch the little bot walk through the pain and the fix.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/watch/${features[0].slug}`} className="grid min-h-12 place-items-center bg-lime px-6 text-sm font-bold text-ink">Watch now</Link>
          <a href={accountbizLiveUrl} target="_blank" rel="noopener noreferrer" className="grid min-h-12 place-items-center border border-fg/50 px-6 text-sm font-semibold hover:border-lime hover:text-lime">Open the app</a>
        </div>
        <ul className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.slug} className="flex flex-col bg-ink p-6">
              <h2 className="text-2xl font-bold tracking-tight">{f.title}</h2>
              <p className="mt-4 border-l-4 border-red-400 pl-3 text-sm text-muted">{f.pain[1]}</p>
              <p className="mt-3 border-l-4 border-lime pl-3 text-sm">{f.fix[0][1]}</p>
              <Link href={`/watch/${f.slug}`} className="mt-6 grid min-h-11 place-items-center self-start bg-lime px-5 text-sm font-bold text-ink">Watch now</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
