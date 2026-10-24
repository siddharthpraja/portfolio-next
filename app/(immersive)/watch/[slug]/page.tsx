import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WatchExperience } from "@/components/watch/WatchExperience";
import { features, getFeature } from "@/lib/story/features";

export const generateStaticParams = () => features.map((f) => ({ slug: f.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = getFeature((await params).slug);
  return f ? { title: `${f.title}: the pain and the fix | Accountbiz`, description: f.pain[1], alternates: { canonical: `/watch/${f.slug}` } } : {};
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = getFeature(slug);
  if (!f) notFound();
  return (
    <>
      <WatchExperience slug={slug} />
      <div className="sr-only"><h1>{f.title}</h1><p>Pain: {f.pain[1]}</p><p>Fix: {f.fix[0][1]} {f.fix[1][1]}</p></div>
    </>
  );
}
