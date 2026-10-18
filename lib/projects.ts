// Single source of truth for the work section and the case-study pages.
// Only facts from the previous portfolio and from Gautam's own notes are used.
// Anything marked `review: true` is a conservative description that needs his confirmation.

export type Project = {
  slug: string;
  n: string;
  title: string;
  kicker: string;
  summary: string;
  role: string;
  tags: string[];
  status: string;
  theme: "dark" | "paper";
  panelClass: string;
  links: { label: string; href: string }[];
  story: { heading: string; body: string }[];
  review?: boolean;
};

export const projects: Project[] = [
  {
    slug: "accountbiz",
    n: "01",
    title: "Accountbiz",
    kicker: "Flagship product",
    summary:
      "Accounting and billing software for businesses: vouchers, ledgers, GST invoicing, inventory and reports, with the posting rules kept in one place.",
    role: "Owner, product lead and developer",
    tags: ["Node.js", "Express", "SQL Server", "Tailwind CSS", "Expo", "Electron"],
    status: "Actively developed",
    theme: "dark",
    panelClass: "bg-graphite",
    links: [{ label: "Open live app", href: "https://accountbiz-app.vercel.app/" }],
    story: [
      {
        heading: "The product",
        body: "Accountbiz covers the everyday accounting workflow: voucher entry (sales, purchase, receipt, payment, contra, journal, credit and debit notes, quotations, orders and delivery notes), ledgers, GST, inventory and ledger reports.",
      },
      {
        heading: "One voucher engine",
        body: "Rather than putting accounting logic in each screen, voucher rules live in a single engine. Database work runs in transactions that roll back on failure, and every query is scoped to the tenant that owns the data.",
      },
      {
        heading: "Around the ledger",
        body: "E-way bill support, QR codes on bills, print and PDF settings, payment reminders, labels, document scanning to pre-fill vouchers, voice invoicing, and an admin dashboard that collects queries raised by users.",
      },
      {
        heading: "Reaching other systems",
        body: "The AccountBiz Connector is a desktop sync agent (Electron) for exchanging data between TallyPrime and SQL Server, so existing records do not have to be re-entered.",
      },
    ],
    review: true,
  },
  {
    slug: "crm-erp-modernization",
    n: "02",
    title: "CRM / ERP Modernization",
    kicker: "Legacy to web",
    summary:
      "Taking a legacy business application and rebuilding its workflows as a modern, web-based system.",
    role: "Developer",
    tags: ["Legacy modernization", "Web application", "API design"],
    status: "Case study",
    theme: "dark",
    panelClass: "bg-ink grid-lines",
    links: [],
    story: [
      {
        heading: "Starting point",
        body: "A business application built on older technology, tied to the machines it ran on and hard to reach from anywhere else.",
      },
      {
        heading: "Approach",
        body: "Move the workflows to a web interface backed by an API, so the same business data can be used from a browser or a phone.",
      },
      {
        heading: "Architecture",
        body: "The diagram contrasts the legacy shape (a desktop client talking straight to its data) with the modern shape (clients going through an API layer). It is a simplified illustration, not a screenshot of a specific system.",
      },
    ],
    review: true,
  },
  {
    slug: "react-native-apps",
    n: "03",
    title: "React Native Applications",
    kicker: "Mobile",
    summary:
      "Two mobile apps: one for clients, and one that connects to a legacy system so existing data is available on a phone.",
    role: "Mobile developer",
    tags: ["React Native", "Expo", "REST APIs"],
    status: "Case study",
    theme: "dark",
    panelClass:
      "bg-graphite bg-[radial-gradient(ellipse_at_50%_0%,rgba(198,255,61,0.12),transparent_60%)]",
    links: [],
    story: [
      {
        heading: "Two apps, one idea",
        body: "The client app is the customer-facing experience. The legacy-connected app reads from and writes to the existing system, so people can use their data away from a desk.",
      },
      {
        heading: "Why it matters",
        body: "Both are React Native apps, so most of the approach (navigation, data fetching, component structure) is shared between them.",
      },
    ],
    review: true,
  },
  {
    slug: "clip-css",
    n: "04",
    title: "Clip-CSS",
    kicker: "Component library",
    summary:
      "A React, Tailwind and CSS component library: prebuilt components for building websites faster.",
    role: "Creator and developer",
    tags: ["React", "Tailwind CSS", "CSS"],
    status: "Live",
    theme: "dark",
    panelClass: "bg-black",
    links: [
      { label: "Visit Clip-CSS", href: "https://clipcss.sidth.tech/" },
      { label: "GitHub", href: "https://github.com/siddharthpraja" },
    ],
    story: [
      {
        heading: "What it is",
        body: "Clip-CSS offers prebuilt components to help create a website faster. The available groups on the site are Buttons, Navbars, Hero sections and Products, with more marked as coming soon.",
      },
      {
        heading: "The playground",
        body: "The playground on this page is a small demo made for this portfolio to show how a component preview and its code can sit side by side. It is not Clip-CSS's own API.",
      },
    ],
  },
  {
    slug: "qresume",
    n: "05",
    title: "Qresume",
    kicker: "Web app",
    summary: "A quick resume-creating web app with templates for resumes, cover letters and resignation letters.",
    role: "Creator and developer",
    tags: ["Next.js", "React", "Tailwind CSS"],
    status: "Live",
    theme: "paper",
    panelClass: "",
    links: [
      { label: "Visit Qresume", href: "https://qresume.sidth.tech/" },
      { label: "GitHub", href: "https://github.com/siddharthpraja" },
    ],
    story: [
      {
        heading: "The workflow",
        body: "From the dashboard you choose what to create (resume, cover letter or resignation letter), pick a template such as Venture, Aspire, Elevate or Nexus, and keep track of jobs and applications.",
      },
      {
        heading: "Screens",
        body: "The screenshot shows the real dashboard on desktop and mobile.",
      },
    ],
  },
];

export const alsoBuilt = {
  title: "Search Soul",
  note: "A missing-person locator for Mumbai, built with Next.js and PocketBase.",
  href: "https://searchsoul.vercel.app/",
  github: "https://github.com/siddharthpraja/Missingapp.git",
};

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
