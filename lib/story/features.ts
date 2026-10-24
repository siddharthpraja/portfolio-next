import type { Beat, Chapter } from "./types";

// Accountbiz "Watch now" scripts. DATA ONLY: edit the Hinglish (h) and English (e) lines here.
// Each feature plays as one short chapter: pain (office in chaos) then fix (office calm).
type L = [h: string, e: string];
type Feature = { slug: string; title: string; pain: L; fix: [L, L] };

export const features: Feature[] = [
  { slug: "voucher-entry", title: "Fast voucher entry",
    pain: ["Ek sale post karne mein paanch screen aur mouse ki ladai.", "Posting one sale takes five screens and a mouse fight."],
    fix: [["Enter dabao, agla field. Ctrl+S dabao, post ho gaya.", "Press Enter for the next field, Ctrl+S to post."],
          ["Debit credit barabar na ho, toh server hi mana kar deta hai.", "If debit doesn't equal credit, the server refuses."]] },
  { slug: "gst-split", title: "Automatic GST split",
    pain: ["CGST-SGST ya IGST? Sab andaza lagate hain, aur galat nikalta hai.", "CGST+SGST or IGST? Everyone guesses and gets it wrong."],
    fix: [["Accountbiz place of supply aur branch ka state compare karta hai.", "Accountbiz compares place of supply with your branch state."],
          ["Same state toh CGST plus SGST, alag state toh IGST. Server bhi check karta hai.", "Same state: CGST+SGST. Other state: IGST. The server checks too."]] },
  { slug: "gst-returns", title: "GSTR-1, 2B and 3B",
    pain: ["Month end pe exports, mismatch dhoondhna, aur portal se dua.", "Month-end means exports, hunting mismatches and praying at the portal."],
    fix: [["GSTR-1 har galat voucher ko saaf wajah ke saath dikhata hai.", "GSTR-1 lists every problem voucher with a plain reason."],
          ["GSTR-2B purchase match karta hai, aur GSTR-3B sirf ek number batata hai: cash mein kitna tax dena hai.", "GSTR-2B matches purchases; GSTR-3B shows one number: tax to pay in cash."]] },
  { slug: "eway-bill", title: "E-way bill in the voucher",
    pain: ["Vehicle number checkpost pe yaad aata hai, desk pe nahi.", "The missing vehicle number is found at the checkpost, not at the desk."],
    fix: [["Voucher ke andar e-way bill ka block hai. 12 digit number, gaadi aur transporter check hote hain.", "An e-way block inside the voucher checks the 12-digit number, vehicle and transporter."],
          ["Valid-up-to distance se suggest hota hai, aur invoice pe print bhi hota hai.", "Valid-up-to is suggested from distance and prints on the invoice."]] },
  { slug: "live-stock", title: "Live stock",
    pain: ["Sheet bolti hai chalis, shelf pe bachhe barah, aur customer ko chahiye bees.", "Sheet says 40, shelf has 12, the customer wants 20."],
    fix: [["Stock ek number nahi hai. Har movement jodkar on-hand nikalta hai, isliye drift nahi hota.", "On-hand is the sum of every movement, so it can't drift."],
          ["Zero ke neeche bechna band, aur do log ek hi piece do baar nahi bech sakte.", "Selling below zero is blocked, and two users can't oversell."]] },
  { slug: "invoice-qr", title: "Invoices with QR",
    pain: ["Invoice word mein copy, logo khisak gaya, aur customer ke paas pay karne ka rasta nahi.", "Invoice copied into a document, logo shifted, no easy way to pay."],
    fix: [["Tally jaisa tax invoice apne aap banta hai, logo, stamp aur QR ke saath.", "A Tally-style tax invoice with your logo, stamp and QR."],
          ["Font, size, margin ek baar set karo, preview dekho, phir share karo.", "Set font, size and margins once, preview, then share."]] },
  { slug: "scan-bill", title: "Scan any bill",
    pain: ["Kagaz ka bill aaya, aur koi chaudah line type kar raha hai.", "A paper bill arrives and someone types all 14 lines."],
    fix: [["Bill ki photo lo. Device pe hi padha jata hai, koi third-party API nahi.", "Photograph the bill. It is read on the device, no third-party API."],
          ["Review karo, aur purchase entry pehle se bhari hui khulti hai.", "Review it and the purchase entry opens pre-filled."]] },
  { slug: "ask-ai", title: "Ask AI",
    pain: ["Kaun sabse zyada udhaar rakhta hai? Report, export, pivot... itna sab.", "Who owes me most? A report, an export and a pivot."],
    fix: [["Seedha poochho: top das customers is saal.", "Just ask: top ten customers this year."],
          ["AI sirf query describe karta hai. Read-only check ke baad chalta hai, password ya key kabhi nahi dikhte.", "The AI only describes a query. It runs read-only; passwords and keys are out of reach."]] },
  { slug: "voice-invoice", title: "Invoice by voice or chat",
    pain: ["Customer ka phone aaya, do minute mein invoice chahiye.", "A customer calls and needs an invoice in two minutes."],
    fix: [["Bolo: Sharma Traders ko das Rice ka sales invoice.", "Say: sales invoice for Sharma Traders, 10 Rice."],
          ["Pichhla rate, ledger aur tax khud lagta hai. Sirf jo kam hai woh poochta hai, aur save se pehle preview.", "It reuses last rate, ledger and tax, asks only what's missing, previews before saving."]] },
  { slug: "reminders", title: "Reminders and sharing",
    pain: ["Payment ke peeche haath se bhaagna, aur phir bhool jaana.", "Chasing payments by hand, then forgetting."],
    fix: [["Outstanding SMS roz, har do din, ya hafte mein repeat hota hai.", "Outstanding SMS repeats daily, every 2 days or weekly."],
          ["Outstanding zero hote hi band, aur bill PDF ke saath email bhi ek step mein.", "It stops at nil, and any bill emails as a PDF in one step."]] },
  { slug: "roles-approvals", title: "Roles and approvals",
    pain: ["Koi bhi kuch bhi post kar sakta hai, aur pata nahi kisne badla.", "Anyone can post anything and nobody knows who changed it."],
    fix: [["Top management, Approver aur Creator, sabko apna hissa.", "Top management, Approver and Creator each get their own part."],
          ["Creator draft banata hai, Approver post karta hai, aur har kadam history mein.", "Creators draft, Approvers post, every step is in history."]] },
  { slug: "reports", title: "Financial reports",
    pain: ["Balance sheet ke liye accountant aur poora weekend chahiye.", "The balance sheet needs an accountant and a weekend."],
    fix: [["Balance Sheet, P and L, Trial Balance aur Cash Flow, Tally ke layout mein.", "Balance Sheet, P&L, Trial Balance and Cash Flow in Tally layout."],
          ["Kisi bhi group pe click karo, ledgers khul jaate hain, charts ke saath.", "Click any group to see its ledgers, with charts."]] },
];

export const getFeature = (slug: string) => features.find((f) => f.slug === slug);

export function featureChapter(f: Feature): Chapter {
  const say = (id: string, l: L, b: Omit<Beat, "id" | "text" | "en">): Beat => ({ id, text: l[0], en: l[1], ...b });
  return {
    id: f.slug, n: 1, title: f.title, subtitle: "The pain, then the fix", env: "office", music: "office",
    start: [0, 1], basis: `Accountbiz feature: ${f.title}.`,
    beats: [
      say("pain", f.pain, { emotion: "nervous", gesture: "tremble", shot: "mid", sfx: "glitch", set: ["papersLoop"], title: true }),
      say("fix1", f.fix[0], { emotion: "happy", gesture: "celebrate", shot: "close", sfx: "sparkle", clear: ["papersLoop"] }),
      say("fix2", f.fix[1], { emotion: "proud", gesture: "point", shot: "mid", target: [2, 1.2, 0] }),
      { id: "end", emotion: "happy", gesture: "faceCamera", shot: "mid", sfx: "chime", set: ["end"], hold: true, pause: 800 },
    ],
  };
}
