// Skill categories for the Skills page and the Developer Lab chapter.
// `projects` links a skill to project slugs (lib/projects.ts) ONLY where the
// project's own copy or tags already name it. There are deliberately no
// proficiency scores. Skills without a mapped project simply list none.

export type Skill = { name: string; note: string; projects: string[] };
export type SkillGroup = { id: string; title: string; line: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "fullstack",
    title: "Full-stack",
    line: "From the database to the interface, in one codebase I can reason about.",
    skills: [
      { name: "React", note: "Component work in the CRM/ERP modernization, Clip-CSS and Qresume.", projects: ["crm-erp-modernization", "clip-css", "qresume"] },
      { name: "Next.js", note: "Qresume is built with Next.js.", projects: ["qresume"] },
      { name: "Node.js", note: "Accountbiz's server runs on Node.js.", projects: ["accountbiz"] },
      { name: "Express.js", note: "Accountbiz's API layer.", projects: ["accountbiz"] },
      { name: "JavaScript", note: "Across every project.", projects: ["accountbiz", "crm-erp-modernization", "clip-css", "qresume"] },
      { name: "HTML", note: "Markup for the web interfaces.", projects: ["clip-css", "qresume"] },
      { name: "CSS", note: "Clip-CSS is a CSS and component library.", projects: ["clip-css"] },
      { name: "Tailwind CSS", note: "Styling for Accountbiz, Clip-CSS and Qresume.", projects: ["accountbiz", "clip-css", "qresume"] },
      { name: "Prisma", note: "Listed skill; no current project page names it.", projects: [] },
      { name: "MVC architecture", note: "Separating routes, logic and data in server code.", projects: ["accountbiz"] },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    line: "Apps that share their API with the web product.",
    skills: [
      { name: "React Native", note: "Two apps: a client app and one connected to a legacy system.", projects: ["react-native-apps"] },
      { name: "Cross-platform apps", note: "One codebase for mobile targets, built with Expo.", projects: ["react-native-apps", "accountbiz"] },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    line: "Schemas and queries built around transactions and data ownership.",
    skills: [
      { name: "MongoDB", note: "Part of the CRM/ERP modernization stack.", projects: ["crm-erp-modernization"] },
      { name: "Microsoft SQL Server", note: "Accountbiz's database, and used in the CRM/ERP work.", projects: ["accountbiz", "crm-erp-modernization"] },
      { name: "SQL Server Management Studio", note: "Day-to-day database maintenance.", projects: ["crm-erp-modernization"] },
      { name: "SQLite", note: "Listed skill; no project page claims it today.", projects: [] },
      { name: "PocketBase", note: "Backs Search Soul, a project listed under 'also built'.", projects: [] },
    ],
  },
  {
    id: "ai",
    title: "AI and automation",
    line: "AI used where it removes typing, and jobs that remove remembering.",
    skills: [
      { name: "AI API integration", note: "Accountbiz can scan a document to pre-fill a voucher.", projects: ["accountbiz"] },
      { name: "Conversational interfaces", note: "Voice invoicing in Accountbiz.", projects: ["accountbiz"] },
      { name: "Workflow automation", note: "Payment reminders and the desktop sync agent.", projects: ["accountbiz"] },
    ],
  },
  {
    id: "business",
    title: "Business",
    line: "The accounting side is the reason the software exists.",
    skills: [
      { name: "Accounting workflows", note: "Vouchers, ledgers and reports.", projects: ["accountbiz"] },
      { name: "Billing", note: "Invoicing and print/PDF settings.", projects: ["accountbiz"] },
      { name: "GST-related processes", note: "GST handling and e-way bill support.", projects: ["accountbiz"] },
      { name: "Project coordination", note: "Leading product decisions on Accountbiz.", projects: ["accountbiz"] },
      { name: "Product thinking", note: "Deciding what to build and who it serves.", projects: ["accountbiz"] },
    ],
  },
];
