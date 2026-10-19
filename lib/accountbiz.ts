// Accountbiz feature status. Statuses are only as confirmed as this file says.
// "implemented" items mirror the product description in lib/projects.ts (from Gautam's notes).
// Move an item between lists, or add to `inDevelopment` / `ideas`, only when Gautam confirms it.

export type FeatureStatus = "implemented" | "in-development" | "idea";

export const accountbizFeatures: Record<FeatureStatus, string[]> = {
  implemented: [
    "Voucher entry: sales, purchase, receipt, payment, contra, journal, credit and debit notes, quotations, orders, delivery notes",
    "Ledgers and ledger reports",
    "GST and e-way bill support",
    "Inventory",
    "QR codes on bills, print and PDF settings",
    "Payment reminders and labels",
    "Document scanning to pre-fill vouchers",
    "Voice invoicing",
    "Admin dashboard for user queries",
    "AccountBiz Connector: desktop sync agent between TallyPrime and SQL Server",
  ],
  "in-development": [],
  idea: [],
};

export const statusLabel: Record<FeatureStatus, string> = {
  implemented: "Built",
  "in-development": "In development",
  idea: "Future idea",
};

export const accountbizLiveUrl = "https://accountbiz-app.vercel.app/";
