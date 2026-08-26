"use client";

import { useEffect, useRef } from "react";
import { CONFIG } from "@/lib/config";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+&·";

export default function SplitFlapBoard() {
  const flapsRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const flapsEl = flapsRef.current;
    if (!flapsEl) return;
    let boardIdx = 0;

    function renderFlaps(text: string) {
      const width = Math.max(...CONFIG.boardLines.map((l) => l.length));
      flapsEl!.innerHTML = "";
      for (let i = 0; i < width; i++) {
        const s = document.createElement("span");
        const ch = text[i] || " ";
        s.className = "flap" + (ch === " " ? " sp" : "");
        s.textContent = ch === " " ? "\u00A0" : ch;
        flapsEl!.appendChild(s);
      }
    }
    function flipTo(text: string) {
      const cells = Array.from(flapsEl!.querySelectorAll<HTMLElement>(".flap"));
      cells.forEach((cell, i) => {
        const target = text[i] || " ";
        let spins = 4 + (i % 5) * 2;
        const tick = () => {
          if (spins-- > 0) {
            cell.classList.remove("sp");
            cell.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            cell.classList.remove("turn"); void cell.offsetWidth; cell.classList.add("turn");
            setTimeout(tick, 52);
          } else {
            cell.textContent = target === " " ? "\u00A0" : target;
            cell.classList.toggle("sp", target === " ");
            cell.classList.remove("turn"); void cell.offsetWidth; cell.classList.add("turn");
          }
        };
        setTimeout(tick, i * 22);
      });
    }
    function cycleBoard() {
      boardIdx = (boardIdx + 1) % CONFIG.boardLines.length;
      flipTo(CONFIG.boardLines[boardIdx]);
      if (idxRef.current)
        idxRef.current.textContent =
          String(boardIdx + 1).padStart(2, "0") + " / " + String(CONFIG.boardLines.length).padStart(2, "0");
    }

    renderFlaps(CONFIG.boardLines[0]);
    flipTo(CONFIG.boardLines[0]);
    if (idxRef.current) idxRef.current.textContent = "01 / " + String(CONFIG.boardLines.length).padStart(2, "0");
    let timer: ReturnType<typeof setInterval> | undefined;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      timer = setInterval(cycleBoard, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="board" id="board" aria-hidden="true">
      <div className="board-hd mono"><span>Departures — Currently working on</span><span ref={idxRef}>01 / 05</span></div>
      <div className="flaps" ref={flapsRef}></div>
      <div className="board-rows">
        <div className="brow"><span>Dhaka <b>→</b> Dublin</span><span>Sept intake</span><span className="tag-live">Placing</span></div>
        <div className="brow"><span>Dhaka <b>→</b> London</span><span>Jan intake</span><span className="tag-soon">Filing</span></div>
        <div className="brow"><span>Dhaka <b>→</b> Manchester</span><span>Jan intake</span><span className="tag-soon">Filing</span></div>
      </div>
    </div>
  );
}
