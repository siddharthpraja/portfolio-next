// Only details from Gautam's resume as supplied in the project brief.
// No employer name, dates or metrics are stated here because none were provided.
// Add them in this file when confirmed; the Experience page renders whatever is present.

export type Role = {
  title: string;
  org?: string;
  period?: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const roles: Role[] = [
  {
    title: "Developer — Enterprise CRM/ERP modernization",
    summary:
      "Modernized a legacy VBScript/MySQL business application into a web application using MERN technologies.",
    points: [
      "Developed React components for the new web interface.",
      "Worked with MongoDB and Microsoft SQL Server.",
      "Integrated the new application with the existing business application.",
      "Handled database maintenance.",
      "Worked on enterprise CRM/ERP workflows.",
    ],
    stack: ["React", "MongoDB", "Microsoft SQL Server", "VBScript", "MySQL"],
  },
  {
    title: "Owner and product lead — Accountbiz",
    summary: "Builds and runs Accountbiz, accounting and billing software for businesses.",
    points: [
      "Owns product decisions, development and direction.",
      "Built with Node.js, Express and SQL Server; companion apps with Expo and a desktop sync agent with Electron.",
    ],
    stack: ["Node.js", "Express", "SQL Server", "Expo", "Electron"],
  },
];
