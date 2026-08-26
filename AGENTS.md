# AGENTS.md

Portfolio for Rakib (study abroad executive, Dhaka). Currently one static HTML file; being converted to full-stack.

## Non-negotiable rules

- **UI must match the original exactly.** `rakib-portfolio (1).html` is the source of truth for design. When porting to Next.js/Tailwind, reproduce the UI pixel-for-pixel: same colors, spacing, fonts, animations, and behavior. Do not "improve", restyle, or reflow anything.
- **Commit and push after every feature.** Push to `origin/main` (`https://github.com/Nidan73/rakib-bhais-portfolio.git`) once a feature works. Do not batch multiple features into one commit.
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
- Repo has no package.json yet; nothing to install until scaffolding is added.
- No lint/test/typecheck configured yet. Once Next.js is scaffolded, run `npm run lint` and `npx tsc --noEmit` before every push.
