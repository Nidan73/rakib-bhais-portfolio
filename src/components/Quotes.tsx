"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";

export default function Quotes() {
  const [qi, setQi] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setQi((n) => (n + 1) % CONFIG.quotes.length), 6500);
    return () => clearInterval(id);
  }, []);

  const show = (n: number) => setQi((n + CONFIG.quotes.length) % CONFIG.quotes.length);

  return (
    <>
      <div className="quote-box">
        {CONFIG.quotes.map((q, i) => (
          <div key={i} className={"quote-blk" + (i === qi ? " on" : "")}>
            <blockquote className="quote">&ldquo;{q.q}&rdquo;</blockquote>
            <div className="qmeta mono">{q.n}<span>{q.r}</span></div>
          </div>
        ))}
      </div>
      <div className="qnav">
        <button className="qarrow" aria-label="Previous quote" onClick={() => show(qi - 1)}>←</button>
        <button className="qarrow" aria-label="Next quote" onClick={() => show(qi + 1)}>→</button>
        <div style={{ display: "flex", gap: ".4rem", marginLeft: ".7rem" }}>
          {CONFIG.quotes.map((_, i) => (
            <button key={i} className={"qdot" + (i === qi ? " on" : "")} aria-label={`Quote ${i + 1}`} onClick={() => show(i)}></button>
          ))}
        </div>
      </div>
    </>
  );
}
