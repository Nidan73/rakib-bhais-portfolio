"use client";

import { useEffect, useState } from "react";

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function DhakaClock() {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      // Dhaka is GMT+6 regardless of where the visitor is sitting
      const now = new Date(Date.now() + (6 * 60 + new Date().getTimezoneOffset()) * 60000);
      setT({ h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="clockwrap" title="Dhaka time, GMT+6">
      <svg className="cface" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="12" x2="12" y2="7.5" transform={`rotate(${(t.h % 12) * 30 + t.m * 0.5} 12 12)`}></line>
        <line x1="12" y1="12" x2="12" y2="5.5" transform={`rotate(${t.m * 6 + t.s * 0.1} 12 12)`}></line>
        <line className="sh" x1="12" y1="13.6" x2="12" y2="4.5" transform={`rotate(${t.s * 6} 12 12)`}></line>
      </svg>
      <span id="clock">{pad(t.h)}<i>:</i>{pad(t.m)}<i>:</i>{pad(t.s)}</span>
      <span>Dhaka</span>
    </span>
  );
}
