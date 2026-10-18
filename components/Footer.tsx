import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-8 md:px-10">
      <div className="mx-auto flex max-w-[1500px] flex-wrap justify-between gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Designed and built by me with Next.js</span>
      </div>
    </footer>
  );
}
