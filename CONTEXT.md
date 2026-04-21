# dashboard-site/ — public dashboard (git-tracked)

## What lives here
Static site served publicly (via the dashboard-site git remote — likely GitHub Pages).

- `index.html` — the whole dashboard: ~5,500 lines, inline CSS + JS, no build step. 5 tabs: Projects · Weekly · Management · Full Cash Flow · Archive.
- `data/*.json` — the feeds the tabs read (copied from `../data/dashboard/` by Skills).

## Publishing flow
1. A Skill generates JSON into `workspace-jade/data/dashboard/`.
2. Skill copies the new JSON into `workspace-jade/dashboard-site/data/`.
3. Skill `git add . && git commit -m "<Skill> <date>" && git push` from within `dashboard-site/`.
4. The remote (GitHub Pages or similar) serves the updated data — no server-side rendering.

## Rules
- **Do not put secrets in `index.html` or `data/`.** Anything in this folder becomes public. Passwords on the dashboard (`Awesome`, `Thisisthepassword123!`) are intentionally in the HTML — they gate pages, they don't protect anything cryptographically.
- **Editing `index.html`** — always test locally by opening the file directly in a browser after edits; malformed JSON/HTML breaks the whole dashboard.
- **Do not commit `eod-raw-*.json`** — those are machine-only. Only the narrative `eod-*.json` goes here.
- **Data files follow the date naming in `data/dashboard/CONTEXT.md`.**
