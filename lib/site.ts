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
  { href: "/#work", label: "Work", n: "02" },
  { href: "/#engineering", label: "Engineering", n: "03" },
  { href: "/#journey", label: "Journey", n: "04" },
  { href: "/#accountbiz", label: "Accountbiz", n: "05" },
  { href: "/#contact", label: "Contact", n: "06" },
];
