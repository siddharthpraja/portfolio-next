"use client";
import Image from "next/image";
import { useState } from "react";

// Standard double-entry posting for each voucher type.
const vouchers = [
  { name: "Sales", dr: "Customer", cr: "Sales + GST payable" },
  { name: "Purchase", dr: "Purchase + GST input", cr: "Supplier" },
  { name: "Receipt", dr: "Cash / Bank", cr: "Customer" },
  { name: "Payment", dr: "Supplier / Expense", cr: "Cash / Bank" },
  { name: "Contra", dr: "Bank (deposit)", cr: "Cash" },
  { name: "Journal", dr: "Any ledger", cr: "Any ledger" },
];

export function AccountbizVisual() {
  const [i, setI] = useState(0);
  const v = vouchers[i];
  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-line bg-surface">
        <Image
          src="/images/accountbiz.webp"
          alt="Accountbiz sales dashboard on a laptop and a phone, showing sales, growth and per-sale figures with bar and donut charts"
          width={1116}
          height={534}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="h-auto w-full"
        />
        <p className="border-t border-line px-4 py-2 font-mono text-[11px] text-muted">Sales dashboard, earlier version</p>
      </div>

      <div className="border border-line bg-surface p-4">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">How a voucher posts</p>
        <div role="tablist" aria-label="Voucher type" className="flex flex-wrap gap-2">
          {vouchers.map((x, k) => (
            <button
              key={x.name}
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              data-cursor
              className={`px-3 py-1.5 font-mono text-xs transition-colors ${k === i ? "bg-lime text-ink" : "border border-line text-muted hover:text-fg"}`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <dl key={v.name} className="mt-4 grid grid-cols-[3rem_1fr] gap-y-2 font-mono text-sm">
          <dt className="text-accent">Dr</dt><dd>{v.dr}</dd>
          <dt className="text-accent">Cr</dt><dd>{v.cr}</dd>
        </dl>
      </div>
    </div>
  );
}
