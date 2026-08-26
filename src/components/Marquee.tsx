"use client";

import { useEffect, useRef } from "react";
import { CONFIG } from "@/lib/config";

declare global {
  interface Window { _mr?: ReturnType<typeof setTimeout> }
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function buildMarquee() {
      const one = CONFIG.marquee.map((s) => `<span class="marq-item">${s}</span>`).join("");
      let html = one, guard = 0;
      track!.innerHTML = `<div class="marq-set">${html}</div>`;
      while ((track!.firstElementChild as HTMLElement)!.offsetWidth < window.innerWidth * 1.3 && guard++ < 8) {
        html += one; track!.firstElementChild!.innerHTML = html;
      }
      track!.innerHTML = `<div class="marq-set">${html}</div><div class="marq-set">${html}</div>`;
      const px = (track!.firstElementChild as HTMLElement)!.offsetWidth;
      track!.style.animationDuration = Math.max(18, Math.round(px / 42)) + "s";
    }

    buildMarquee();
    const onResize = () => { clearTimeout(window._mr); window._mr = setTimeout(buildMarquee, 300); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(window._mr); };
  }, []);

  return (
    <div className="marq" aria-hidden="true">
      <div className="marq-track" ref={trackRef}></div>
    </div>
  );
}
