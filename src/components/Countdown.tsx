"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";

function nextDeadline() {
  let d = new Date(CONFIG.deadline.date);
  while (d.getTime() < Date.now()) d.setFullYear(d.getFullYear() + 1);
  return d;
}

export default function Countdown() {
  const [t, setT] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  useEffect(() => {
    const tick = () => {
      const ms = nextDeadline().getTime() - Date.now();
      setT([
        Math.floor(ms / 864e5),
        Math.floor(ms / 36e5) % 24,
        Math.floor(ms / 6e4) % 60,
        Math.floor(ms / 1e3) % 60,
      ]);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const labels = ["Days", "Hrs", "Min", "Sec"];
  return (
    <aside className="count">
      <div className="eyebrow mono">Next deadline</div>
      <h4>{CONFIG.deadline.label}</h4>
      <div className="cd">
        {labels.map((l, i) => (
          <div key={l}><b>{String(t[i]).padStart(2, "0")}</b><span>{l}</span></div>
        ))}
      </div>
      <p className="mono" style={{ color: "var(--ink-3)", margin: 0 }}>Files opened after this date carry real refusal risk.</p>
      <button className="lnk js-open-contact" style={{ marginTop: ".9rem" }}>Ask about your file <span className="arw">→</span></button>
    </aside>
  );
}
