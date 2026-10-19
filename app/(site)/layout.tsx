import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Cursor />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
