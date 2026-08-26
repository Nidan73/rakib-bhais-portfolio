# AGENTS.md

Portfolio for Rakib (study abroad executive, Dhaka). Currently one static HTML file; being converted to full-stack.

## Non-negotiable rules

- **UI must match the original exactly.** `rakib-portfolio (1).html` is the source of truth for design. When porting to Next.js/Tailwind, reproduce the UI pixel-for-pixel: same colors, spacing, fonts, animations, and behavior. Do not "improve", restyle, or reflow anything.
- **Commit and push after every feature.** Push to `origin/main` (`https://github.com/Nidan73/rakib-bhais-portfolio.git`) once a feature works. Do not batch multiple features into one commit.
- **Update this file after every work item that impacted the project.** Add what changed, where it lives, and anything the next session would otherwise have to rediscover (see Current state + Session log).
- **Never add AI co-author.** No `Co-Authored-By` trailers, no AI attribution of any kind in commits.
- Commit messages: short imperative summary, matching existing style (`first commit`).

## Target stack

Full-stack rewrite planned: TypeScript + Next.js (App Router) + Tailwind CSS + shadcn/ui-style component libraries under `components/` and `lib/`. Until scaffolding exists, do not invent paths - create them when the migration starts.

## Source file map (`rakib-portfolio (1).html`)

- `CONFIG` object (~line 794): all editable content - board lines, stories, quotes, stats, deadline, owner credentials. Port this to typed config/data first.
- `:root` CSS variables (~line 19): design tokens (`--surface`, `--board`, `--amber`, `--stamp`, `--visa`). Map these 1:1 to Tailwind theme tokens.
- Fonts: Big Shoulders Display, Newsreader, IBM Plex Mono via Google Fonts.
- Current persistence is localStorage-only (`Store` adapter, key prefix `rk_`). Full-stack migration should replace this with real API routes/db for posts, comments, likes, and contact leads.
- Admin auth is client-side passphrase/Google check today; replace with proper server auth during migration.
- Known placeholders to swap for real values later (content, not UI): phone numbers, contact email, LinkedIn/Facebook URLs, `googleClientId`, `formEndpoint`.

## Gotchas

- Filename contains spaces and parentheses - always quote it in shell commands.
- No lint configured yet (`npm run lint` fails until ESLint is added). Run `npx tsc --noEmit` and `npm run build` before every push.
- Background dev/preview servers hang the bash tool - use `npm run build` and read `.next/server/app/index.html` to verify rendering instead.

## Current state (updated after every feature)

**Done:**
- Next.js 16 (Turbopack default) + React 19.2 + TypeScript 7 (native) + Tailwind 4.3, all at latest majors as of 2026-08-26. App Router, files under `src/`.
- Full UI ported from `rakib-portfolio (1).html`. Original CSS copied verbatim into `src/app/globals.css` - do NOT rewrite it into Tailwind classes; that is how pixel-parity is guaranteed. Markup in `src/app/page.tsx` uses the same class names.
- All interactivity ported verbatim in `src/components/SiteScripts.tsx` (single client component running on mount via getElementById/querySelector): overlays/modals, story + post views, journal likes/comments/compose/edit/delete with image drop, admin auth (Google + passphrase), stamp system + coach mark, contact form validation + mailto fallback, scroll reveal, nav spy.
- Client islands with refs/state (do not duplicate their work in SiteScripts): `SplitFlapBoard`, `Marquee`, `DhakaClock`, `Countdown`, `Quotes`.
- Typed content config in `src/lib/config.ts` (ported from HTML CONFIG object; includes STAMPS, initialGot, fdate).

**Not done yet / next up:**
- Real backend: API routes + db for posts, comments, likes, contact leads (currently localStorage-only via `Store` in SiteScripts.tsx).
- Server-side auth replacing client-side passphrase check (`CONFIG.ownerPass`) - it is readable by anyone; must not ship to production as-is.
- Replace placeholders with real values: phone numbers, contact email, LinkedIn/Facebook URLs, `googleClientId`, `formEndpoint`.
- ESLint setup.

## Session log

- 2026-08-26: Scaffolded Next.js manually (dirname has spaces so create-next-app was unusable); committed original HTML for reference. Ported UI shell + animated hero elements (`69b5fbd`), then all interactivity via SiteScripts (`66acbc5`). Verified by `tsc --noEmit`, `next build`, and diffing prerendered HTML against source IDs/classes.
- 2026-08-26: Upgraded Next 15→16.3.3, TS 5→7.0.2, React→19.2.8, Tailwind→4.3.3 (`e727cce`). No code changes needed; had to `rm -rf .next` because the v15 build cache broke v16 builds with a misleading `_not-found` error - remember this on future major bumps.
