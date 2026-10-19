import type { Metadata } from "next";
import { StoryExperience } from "@/components/story/StoryExperience";
import { chapters } from "@/lib/story/script";
import { contactLinks, site } from "@/lib/site";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "The Little Bot With A Big Story",
  description: `An interactive 3D story in Hinglish: a small robot tells the story of ${site.name}, from accounting to code to Accountbiz.`,
  alternates: { canonical: "/story" },
  openGraph: { title: `The Little Bot With A Big Story — ${site.name}`, url: `${site.url}/story`, type: "website" },
};

export default function StoryPage() {
  return (
    <>
      <StoryExperience />
      {/* Server-rendered text for crawlers, screen readers and no-JS visitors. Visually hidden: the film is the visible layer. */}
      <div className="sr-only">
        <h1>{site.name}: The Little Bot With A Big Story</h1>
        {chapters.slice(1).map((c) => (
          <section key={c.id}><h2>{`Chapter ${c.n}: ${c.title}`}</h2><p>{c.basis}</p></section>
        ))}
        <h2>Projects</h2>
        <ul>{projects.map((p) => <li key={p.slug}><a href={`/work/${p.slug}`}>{p.title}</a>: {p.summary}</li>)}</ul>
        <h2>Contact</h2>
        <ul>{contactLinks().map((c) => <li key={c.label}><a href={c.href}>{c.label}</a></li>)}</ul>
      </div>
    </>
  );
}
