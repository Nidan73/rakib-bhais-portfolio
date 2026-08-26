"use client";

import { useEffect } from "react";
import { CONFIG, STAMPS, initialGot } from "@/lib/config";

/* eslint-disable */

declare const google: any;

const MEM: Record<string, any> = {};
const K = { posts: "rk_posts_v1", likes: "rk_mylikes_v1", stamps: "rk_stamps_v1", admin: "rk_admin_v1" };

const Store = {
  async get(key: string, shared = true): Promise<any> {
    try { const v = localStorage.getItem(key); if (v !== null) return JSON.parse(v); } catch (e) {}
    return MEM[key] !== undefined ? MEM[key] : null;
  },
  async set(key: string, val: any, _shared = true): Promise<boolean> {
    MEM[key] = val;
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) {}
    return false;
  },
};

export default function SiteScripts() {
  useEffect(() => {
    const $ = ((s: string, r: ParentNode = document) => r.querySelector(s)) as any;
    const $$ = (s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as any[];
    const esc = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c: string) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);
    const para = (s: string) => esc(s).split(/\n{2,}/).map((p: string) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
    const fdate = (d: string | Date) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    let toastT: ReturnType<typeof setTimeout>;
    function toast(msg: string, kind = "") {
      const el = $("#toast");
      el.textContent = msg;
      el.className = "toast on " + kind;
      clearTimeout(toastT);
      toastT = setTimeout(() => { el.className = "toast " + kind; }, 3200);
    }

    /* ---------------- overlays ---------------- */
    let lastFocus: Element | null = null;
    function openOv(id: string) {
      lastFocus = document.activeElement;
      $("#" + id).classList.add("on");
      document.body.style.overflow = "hidden";
      const f = $("#" + id).querySelector("input,button,textarea,a");
      if (f) setTimeout(() => (f as HTMLElement).focus(), 60);
    }
    function closeOv() {
      $$(".ov.on").forEach((o) => o.classList.remove("on"));
      document.body.style.overflow = "";
      if (lastFocus) (lastFocus as HTMLElement).focus();
    }
    const onCloseClick = (e: MouseEvent) => { if ((e.target as Element).closest("[data-close]")) closeOv(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeOv(); };
    document.addEventListener("click", onCloseClick);
    document.addEventListener("keydown", onKey);

    /* ---------------- journal ---------------- */
    let POSTS: any[] = [], MYLIKES: any = {}, editingId: string | null = null, pendingImg = "";

    async function loadPosts() {
      const saved = await Store.get(K.posts, true);
      POSTS = Array.isArray(saved) && saved.length ? saved : CONFIG.seedPosts.map((p) =>
        ({ ...p, likes: 0, comments: [] }));
      MYLIKES = (await Store.get(K.likes, false)) || {};
      renderFeed();
    }
    async function savePosts() {
      const ok = await Store.set(K.posts, POSTS, true);
      if (!ok) toast("Saved in memory only — this device has storage disabled", "bad");
    }

    function renderFeed() {
      const f = $("#feed");
      if (!POSTS.length) {
        f.innerHTML = `<div class="empty"><p style="margin:0 0 .6rem">No entries yet.</p>
          <button class="lnk" id="firstPost">Sign in and write the first one <span class="arw">→</span></button></div>`;
        return;
      }
      f.innerHTML = POSTS.map((p) => `
        <article class="post" data-id="${esc(p.id)}">
          ${p.img ? `<img class="post-img" src="${p.img}" alt="">` : ""}
          <div class="post-body">
            <div class="mono" style="color:var(--ink-3)">${esc(p.tag || "Note")} · ${fdate(p.d)}</div>
            <h3>${esc(p.t)}</h3>
            <p class="post-ex">${esc(p.b)}</p>
            <div class="post-foot">
              <button class="react js-like${MYLIKES[p.id] ? " on" : ""}" data-id="${esc(p.id)}">
                <span class="hrt">${MYLIKES[p.id] ? "●" : "○"}</span> ${p.likes || 0}</button>
              <button class="react js-open-post" data-id="${esc(p.id)}">✎ ${(p.comments || []).length}</button>
              <button class="lnk js-open-post" data-id="${esc(p.id)}" style="margin-left:auto;font-size:.68rem">Read <span class="arw">→</span></button>
              <button class="react admin-only js-edit" data-id="${esc(p.id)}">Edit</button>
            </div>
          </div>
        </article>`).join("");
    }

    async function toggleLike(id: string) {
      const p = POSTS.find((x) => x.id === id); if (!p) return;
      const on = !MYLIKES[id];
      MYLIKES[id] = on || undefined;
      if (!on) delete MYLIKES[id];
      p.likes = Math.max(0, (p.likes || 0) + (on ? 1 : -1));
      await Store.set(K.likes, MYLIKES, false);
      await savePosts();
      renderFeed();
      const btn = $(`.js-like[data-id="${CSS.escape(id)}"]`);
      if (btn && on) { btn.classList.add("pop"); setTimeout(() => btn.classList.remove("pop"), 360); }
      if (on) { stamp(5); toast("Reaction saved"); }
    }

    function openPost(id: string) {
      const p = POSTS.find((x) => x.id === id); if (!p) return;
      $("#postBody").innerHTML = `
        ${p.img ? `<img src="${p.img}" alt="" style="width:100%;border:1px solid var(--ink);margin-bottom:1.1rem">` : ""}
        <div class="eyebrow mono">${esc(p.tag || "Note")} · ${fdate(p.d)}</div>
        <h2 style="font-size:clamp(2rem,6vw,3rem);margin-bottom:1rem">${esc(p.t)}</h2>
        ${para(p.b)}
        <hr class="rule" style="margin:1.6rem 0">
        <div class="mono" style="color:var(--ink-3);margin-bottom:1rem">Comments (${(p.comments || []).length})</div>
        <div id="cmtList">${(p.comments || []).length
          ? p.comments.map((c: any) => `<div class="cmt"><b>${esc(c.n)}</b><time>${fdate(c.d)}</time><p>${esc(c.b)}</p></div>`).join("")
          : `<p style="color:var(--ink-3)">No comments yet. Yours would be the first.</p>`}</div>
        <div class="field" style="margin-top:1.2rem"><label for="cn">Your name</label>
          <input id="cn" placeholder="Name"></div>
        <div class="field" style="margin-top:.7rem"><label for="cb">Comment</label>
          <textarea id="cb" style="min-height:90px" placeholder="Keep it useful."></textarea></div>
        <button class="btn" id="cSend" data-id="${esc(p.id)}" style="margin-top:.9rem">Post comment <span class="arw">→</span></button>`;
      openOv("ovPost");
      stamp(4);
    }

    async function addComment(id: string) {
      const n = ($("#cn") as HTMLInputElement).value.trim(), b = ($("#cb") as HTMLTextAreaElement).value.trim();
      if (!n || !b) { toast("Name and comment are both required", "bad"); return; }
      const p = POSTS.find((x) => x.id === id); if (!p) return;
      p.comments = p.comments || [];
      p.comments.push({ n: n.slice(0, 60), b: b.slice(0, 900), d: new Date().toISOString() });
      await savePosts();
      openPost(id);
      renderFeed();
      stamp(5);
      toast("Comment posted", "good");
    }

    function openCompose(id: string | null) {
      editingId = id || null; pendingImg = "";
      const p = id ? POSTS.find((x) => x.id === id) : null;
      $("#composeTitle").textContent = p ? "Edit post" : "New post";
      ($("#c-title") as HTMLInputElement).value = p ? p.t : "";
      ($("#c-tag") as HTMLInputElement).value = p ? (p.tag || "") : "";
      ($("#c-body") as HTMLTextAreaElement).value = p ? p.b : "";
      pendingImg = p ? (p.img || "") : "";
      const th = $("#thumb") as HTMLImageElement;
      th.hidden = !pendingImg; th.src = pendingImg || "";
      ($("#delPostBtn") as HTMLElement).hidden = !p;
      openOv("ovCompose");
    }

    function readImage(file?: File) {
      if (!file || !file.type.startsWith("image/")) { toast("That is not an image file", "bad"); return; }
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 1200, sc = Math.min(1, max / img.width);
          const cv = document.createElement("canvas");
          cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
          cv.getContext("2d")!.drawImage(img, 0, 0, cv.width, cv.height);
          pendingImg = cv.toDataURL("image/jpeg", 0.72);
          const th = $("#thumb") as HTMLImageElement; th.src = pendingImg; th.hidden = false;
          toast("Photo ready — publish to save it");
        };
        img.src = fr.result as string;
      };
      fr.readAsDataURL(file);
    }

    async function publish() {
      const t = ($("#c-title") as HTMLInputElement).value.trim(), b = ($("#c-body") as HTMLTextAreaElement).value.trim();
      if (!t || !b) { toast("A post needs a title and a body", "bad"); return; }
      if (editingId) {
        const p = POSTS.find((x) => x.id === editingId)!;
        Object.assign(p, { t, b, tag: ($("#c-tag") as HTMLInputElement).value.trim(), img: pendingImg });
      } else {
        POSTS.unshift({ id: "p" + Date.now(), t, b, tag: ($("#c-tag") as HTMLInputElement).value.trim(),
          img: pendingImg, d: new Date().toISOString(), likes: 0, comments: [] });
      }
      await savePosts(); renderFeed(); closeOv();
      toast(editingId ? "Post updated" : "Published", "good");
      editingId = null;
    }

    async function deletePost() {
      if (!editingId) return;
      POSTS = POSTS.filter((p) => p.id !== editingId);
      await savePosts(); renderFeed(); closeOv();
      toast("Post deleted"); editingId = null;
    }

    /* ---------------- Google sign-in ---------------- */
    function decodeJwt(token: string) {
      const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(atob(part).split("").map((c) =>
        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
      return JSON.parse(json);
    }
    async function onGoogleCredential(res: any) {
      try {
        const u = decodeJwt(res.credential);
        if (!CONFIG.ownerEmail) { $("#pwErr").textContent = "Set ownerEmail in CONFIG first"; return; }
        if (String(u.email).toLowerCase() !== CONFIG.ownerEmail.toLowerCase()) {
          $("#pwErr").textContent = "That Google account is not the owner account"; return;
        }
        await setAdmin(true, u.name || u.email);
        closeOv();
        toast("Signed in as " + (u.name || u.email), "good");
      } catch (e) {
        $("#pwErr").textContent = "Could not read the Google response";
      }
    }
    function initGoogle() {
      const wrap = $("#gWrap");
      if (!CONFIG.googleClientId) {
        wrap.innerHTML = `<p class="mono" style="color:var(--ink-3);text-align:center;margin:0">
          Google sign-in not set up yet — add googleClientId in CONFIG</p>`;
        return;
      }
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.defer = true;
      s.onload = () => {
        try {
          google.accounts.id.initialize({ client_id: CONFIG.googleClientId, callback: onGoogleCredential });
          google.accounts.id.renderButton($("#gBtn"), { theme: "outline", size: "large", text: "signin_with", width: 280 });
        } catch (e) {
          wrap.innerHTML = `<p class="mono" style="color:var(--stamp);text-align:center;margin:0">Google sign-in failed to start</p>`;
        }
      };
      s.onerror = () => { wrap.innerHTML = `<p class="mono" style="color:var(--stamp);text-align:center;margin:0">Could not reach Google — use the passphrase</p>`; };
      document.head.appendChild(s);
    }

    async function setAdmin(on: boolean, who?: any) {
      document.body.classList.toggle("is-admin", !!on);
      await Store.set(K.admin, on ? (who || 1) : 0, false);
      $("#adminBtn").innerHTML = on
        ? `Signed in${who && who !== 1 ? " as " + esc(String(who).split(" ")[0]) : ""} — manage posts <span class="arw">→</span>`
        : 'Sign in to post <span class="arw">→</span>';
      ($("#logoutGo") as HTMLElement).hidden = !on;
    }

    /* ---------------- boarding pass ---------------- */
    let got = [...initialGot];

    function stampRows() {
      const nextI = got.findIndex((g) => !g);
      return STAMPS.map((s, i) => `
        <button class="prow${got[i] ? " done" : ""}${i === nextI ? " next" : ""}" data-goto="${s.go}">
          <span class="pmark">${got[i] ? "✓" : i + 1}</span>
          <span><b>${esc(s.l)}</b><span>${esc(s.how)}</span></span>
          <span class="go">${got[i] ? "Stamped" : i === nextI ? "Do this →" : "Go →"}</span>
        </button>`).join("");
    }
    function renderStamps() {
      const html = stampRows();
      const g = $("#stampGrid"), p = $("#passList");
      if (g) g.innerHTML = html;
      if (p) p.innerHTML = html;
      const n = got.filter(Boolean).length;
      $("#passN").textContent = n + "/6";
      $("#passFill").style.width = (n / 6 * 100) + "%";
      $("#passBtn").classList.toggle("full", n === 6);
      const left = 6 - n;
      const nx = STAMPS[got.findIndex((x) => !x)];
      $("#lockMsg").textContent = left
        ? `${left} stamp${left > 1 ? "s" : ""} to go — next: ${nx.how.toLowerCase()}`
        : "Unlocked. The brief is yours to keep.";
      $("#briefWrap").classList.toggle("locked", left > 0);
    }

    function flyStamp(label: string) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const chip = $("#passBtn").getBoundingClientRect();
      const el = document.createElement("div");
      el.className = "fly";
      el.textContent = label;
      document.body.appendChild(el);
      const w = el.offsetWidth, h = el.offsetHeight;
      const sx = window.innerWidth / 2 - w / 2, sy = window.innerHeight * 0.52;
      const tx = chip.left + chip.width / 2 - w / 2, ty = chip.top + chip.height / 2 - h / 2;
      el.style.left = sx + "px"; el.style.top = sy + "px";
      el.animate([
        { transform: "scale(1.5) rotate(-14deg)", opacity: 0 },
        { transform: "scale(1) rotate(-6deg)", opacity: 1, offset: .22 },
        { transform: `translate(${tx - sx}px,${ty - sy}px) scale(.35) rotate(6deg)`, opacity: 0 }
      ], { duration: 1000, easing: "cubic-bezier(.4,0,.2,1)" }).onfinish = () => el.remove();
      const pass = $("#passBtn");
      setTimeout(() => { pass.classList.add("hit"); setTimeout(() => pass.classList.remove("hit"), 560); }, 780);
    }

    function stamp(i: number) {
      if (got[i]) return;
      got[i] = 1;
      Store.set(K.stamps, got, false);
      renderStamps();
      flyStamp(STAMPS[i].l);
      const n = got.filter(Boolean).length;
      if (n === 6) toast("Six stamps — the brief is unlocked", "good");
      else toast(`Stamped: ${STAMPS[i].l} · ${n} of 6`);
    }

    async function coachMark() {
      if (await Store.get("rk_coach", false)) return;
      const c = document.createElement("div");
      c.className = "coach";
      c.innerHTML = `<p><b>This fills as you read.</b> Six stamps unlocks my one-page brief — what I do, how I charge, and what I need before a first call.</p>
        <button id="coachOk">Got it</button>`;
      document.body.appendChild(c);
      const kill = () => { c.remove(); Store.set("rk_coach", 1, false); };
      (c.querySelector("#coachOk") as HTMLElement).onclick = kill;
      setTimeout(() => { if (document.body.contains(c)) kill(); }, 11000);
    }

    /* ---------------- contact form ---------------- */
    function fail(id: string, msg: string) {
      const f = $("#" + id).closest(".field");
      f.classList.add("bad");
      $(`.err[data-for="${id}"]`).textContent = msg;
    }
    function clearErrors() {
      $$(".field").forEach((f) => f.classList.remove("bad"));
      $$(".err").forEach((e) => e.textContent = "");
    }
    async function submitForm(e: Event) {
      e.preventDefault();
      clearErrors();
      const v = (id: string) => ($("#" + id) as HTMLInputElement).value.trim();
      let bad = false;
      if (v("f-name").length < 2) { fail("f-name", "Tell me your name"); bad = true; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v("f-email"))) { fail("f-email", "Check this email address"); bad = true; }
      if (!v("f-topic")) { fail("f-topic", "Pick one"); bad = true; }
      if (!v("f-stage")) { fail("f-stage", "Pick one"); bad = true; }
      if (v("f-msg").length < 15) { fail("f-msg", "At least a sentence, please"); bad = true; }
      if (bad) { const b = $(".field.bad input,.field.bad select,.field.bad textarea"); if (b) (b as HTMLElement).focus(); toast("Fix the marked fields", "bad"); return; }

      const btn = $("#sendBtn");
      btn.disabled = true; btn.innerHTML = 'Sending…';
      const data = { name: v("f-name"), email: v("f-email"), topic: v("f-topic"), stage: v("f-stage"), message: v("f-msg") };

      try {
        if (CONFIG.formEndpoint) {
          const body = new URLSearchParams({ ...data, source: location.hostname || "local" });
          try {
            const r = await fetch(CONFIG.formEndpoint, { method: "POST", body });
            if (!r.ok) throw new Error("bad response");
          } catch (netErr) {
            await fetch(CONFIG.formEndpoint, { method: "POST", mode: "no-cors", body });
          }
          ($("#contactForm") as HTMLFormElement).reset();
          toast("Message sent. You will hear back within a working day.", "good");
        } else {
          const body = `Name: ${data.name}%0AEmail: ${data.email}%0ATopic: ${data.topic}%0AStage: ${data.stage}%0A%0A${encodeURIComponent(data.message)}`;
          window.location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("Enquiry: " + data.topic)}&body=${body}`;
          toast("No form service connected — opening your email app");
        }
      } catch (err) {
        toast("Could not send. Email me directly instead.", "bad");
      } finally {
        btn.disabled = false; btn.innerHTML = 'Send message <span class="arw">→</span>';
      }
    }

    /* ---------------- scroll reveal + nav spy ---------------- */
    function observeAll() {
      const rev = new IntersectionObserver((es) => es.forEach((x) => {
        if (x.isIntersecting) { x.target.classList.add("in"); rev.unobserve(x.target); }
      }), { threshold: .12 });
      $$(".rise").forEach((el) => rev.observe(el));

      const secs = ["work", "stories", "voices", "journal", "brief", "contact"];
      const spy = new IntersectionObserver((es) => es.forEach((x) => {
        if (!x.isIntersecting) return;
        const id = (x.target as HTMLElement).id;
        $$("#nav a").forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + id)));
        if (id === "work") stamp(1);
        if (id === "voices") stamp(3);
      }), { threshold: .4 });
      secs.forEach((id) => { const el = $("#" + id); if (el) spy.observe(el); });
    }

    /* ---------------- wiring ---------------- */
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      const story = t.closest("[data-story]");
      if (story) { openStory(+story.getAttribute("data-story")!); return; }
      const like = t.closest(".js-like");
      if (like) { toggleLike((like as HTMLElement).dataset.id!); return; }
      const op = t.closest(".js-open-post");
      if (op) { openPost((op as HTMLElement).dataset.id!); return; }
      const ed = t.closest(".js-edit");
      if (ed) { openCompose((ed as HTMLElement).dataset.id!); return; }
      if (t.closest(".js-open-contact")) { closeOv(); $("#contact").scrollIntoView({ behavior: "smooth" }); return; }
      if (t.closest("#cSend")) { addComment(t.closest("#cSend")!.getAttribute("data-id")!); return; }
      if (t.closest("#firstPost")) { openOv("ovLogin"); return; }
      const goto = t.closest("[data-goto]");
      if (goto) { closeOv(); const el = $(goto.getAttribute("data-goto")!); if (el) el.scrollIntoView({ behavior: "smooth" }); return; }
    };
    document.addEventListener("click", onClick);

    function openStory(i: number) {
      const s = CONFIG.stories[i];
      $("#storyHdLabel").textContent = s.r;
      $("#storyBody").innerHTML = `
        <div class="eyebrow mono">${esc(s.m)}</div>
        <h2 style="font-size:clamp(2rem,6vw,3rem);margin-bottom:1rem">${esc(s.t)}</h2>
        ${para(s.b)}
        <button class="btn js-open-contact" style="margin-top:1rem">Talk about your case <span class="arw">→</span></button>`;
      openOv("ovStory");
      stamp(2);
    }

    /* ---------------- boot ---------------- */
    loadPosts();
    Store.get(K.stamps, false).then((s) => { if (Array.isArray(s)) { got = s; } renderStamps(); });
    Store.get(K.admin, false).then((a) => setAdmin(!!a, a));
    initGoogle();
    setTimeout(coachMark, 1600);
    renderStamps();
    observeAll();

    ($("#menuBtn") as HTMLElement).onclick = () => openOv("ovMenu");
    ($("#allStories") as HTMLElement).onclick = () => openOv("ovStories");
    ($("#passBtn") as HTMLElement).onclick = () => openOv("ovPass");
    ($("#passToBrief") as HTMLElement).onclick = () => { closeOv(); $("#brief").scrollIntoView({ behavior: "smooth" }); };
    ($("#printBrief") as HTMLElement).onclick = () => window.print();
    ($("#newPost") as HTMLElement).onclick = () => openCompose(null);
    ($("#adminBtn") as HTMLElement).onclick = () => document.body.classList.contains("is-admin") ? openCompose(null) : openOv("ovLogin");
    ($("#adminBtn2") as HTMLElement).onclick = () => openOv("ovLogin");
    ($("#publishBtn") as HTMLElement).onclick = publish;
    ($("#delPostBtn") as HTMLElement).onclick = deletePost;
    $("#contactForm").addEventListener("submit", submitForm);

    ($("#loginGo") as HTMLElement).onclick = async () => {
      const em = ($("#oe") as HTMLInputElement).value.trim().toLowerCase();
      const pwv = ($("#pw") as HTMLInputElement).value;
      const emailOk = em === String(CONFIG.ownerEmail || "").toLowerCase();
      const passOk = pwv === CONFIG.ownerPass;
      if (emailOk && passOk) {
        await setAdmin(true, CONFIG.ownerEmail);
        ($("#oe") as HTMLInputElement).value = ""; ($("#pw") as HTMLInputElement).value = ""; $("#pwErr").textContent = "";
        closeOv(); toast("Signed in — you can post now", "good");
      } else {
        $("#pwErr").textContent = "Email or password is wrong";
        ($("#pw") as HTMLInputElement).value = ""; ($("#pw") as HTMLInputElement).focus();
      }
    };
    ["#oe", "#pw"].forEach((s) => $(s).addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") ($("#loginGo") as HTMLElement).click();
    }));
    ($("#logoutGo") as HTMLElement).onclick = async () => { await setAdmin(false); closeOv(); toast("Signed out"); };

    const drop = $("#drop"), file = $("#c-file") as HTMLInputElement;
    file.addEventListener("change", () => readImage(file.files?.[0]));
    (["dragenter", "dragover"] as const).forEach((ev) => drop.addEventListener(ev, (e: Event) => {
      e.preventDefault(); drop.classList.add("over");
    }));
    (["dragleave", "drop"] as const).forEach((ev) => drop.addEventListener(ev, (e: Event) => {
      e.preventDefault(); drop.classList.remove("over");
    }));
    drop.addEventListener("drop", (e: DragEvent) => readImage(e.dataTransfer?.files[0]));

    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", () => {
      if (a.closest(".ov")) setTimeout(closeOv, 10);
    }));

    return () => {
      document.removeEventListener("click", onCloseClick);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
