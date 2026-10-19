export const site = {
  name: "Gautam Prajapati",
  title: "Software Developer · Project Manager · Accountbiz Owner",
  description:
    "I build full-stack applications, mobile experiences, and intelligent business systems that solve real-world problems.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sidth.tech",
  // Add an address here and a mailto link appears in the Contact section.
  email: "",
  links: {
    linkedin: "https://www.linkedin.com/in/gautam-prajapati-5b59a5236/",
    whatsapp: "https://api.whatsapp.com/send?phone=918080429365",
    instagram: "https://www.instagram.com/sidth.tech/",
    github: "https://github.com/siddharthpraja",
  },
};

export const nav = [
  { href: "/story", label: "Story", n: "01" },
  { href: "/projects", label: "Projects", n: "02" },
  { href: "/skills", label: "Skills", n: "03" },
  { href: "/experience", label: "Experience", n: "04" },
  { href: "/about", label: "About", n: "05" },
  { href: "/contact", label: "Contact", n: "06" },
];

/** Every crawlable page; used by the sitemap. */
export const pages = [
  { path: "/", priority: 1 },
  { path: "/story", priority: 0.9 },
  { path: "/about", priority: 0.7 },
  { path: "/projects", priority: 0.9 },
  { path: "/skills", priority: 0.7 },
  { path: "/experience", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

/** Contact links that exist. Email appears only when `site.email` is set. */
export function contactLinks() {
  return [
    ...(site.email ? [{ label: "Email", href: `mailto:${site.email}` }] : []),
    { label: "WhatsApp", href: site.links.whatsapp },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
    { label: "Instagram", href: site.links.instagram },
  ];
}
