## Context

The Angular app currently serves `index.html` with a minimal `<head>`: charset, title ("Snake"), viewport, and a `<link rel="icon">` pointing to `favicon.ico`. Two image assets already exist in `public/` — `favicon.png` and `link-visual.png` — but are not referenced anywhere in the HTML. No structured metadata is present for search engines or social platforms.

## Goals / Non-Goals

**Goals:**
- Switch the browser tab icon from `favicon.ico` to `favicon.png`
- Add an Apple Touch Icon for iOS home-screen bookmarks
- Add Open Graph meta tags for rich link previews on LinkedIn, Facebook, Slack, Discord
- Add Twitter/X Card meta tags for rich tweet previews
- Add core SEO meta tags: `description`, `author`, `theme-color`, `robots`
- Keep all changes confined to `src/App/src/index.html`

**Non-Goals:**
- Dynamic per-route meta tags (no Angular `Meta` service integration)
- Structured data / JSON-LD schema markup
- Multilingual `hreflang` tags
- Sitemap or `robots.txt` generation
- Changing or creating any image assets

## Decisions

### D1 — Static tags in `index.html` vs. Angular `Meta` service

**Decision**: Use static `<meta>` tags in `index.html`.

**Rationale**: This is a single-page app with one logical "page" (the game). Dynamic per-route metadata is unnecessary complexity. Static tags in `index.html` are picked up by social crawlers (which do not execute JavaScript) and by search engines, whereas Angular `Meta` service writes tags after JS execution — crawlers may not see them.

**Alternative considered**: Angular `Meta` service in `AppComponent`. Rejected because Open Graph crawlers typically do not run JavaScript; static tags are universally reliable.

### D2 — `favicon.png` replaces `favicon.ico` entirely

**Decision**: Remove the `favicon.ico` `<link>` and replace it with `favicon.png` (`type="image/png"`). Keep `favicon.ico` in `public/` (undeclared) for browsers that auto-request it.

**Rationale**: `favicon.png` is a higher-quality asset already committed to `public/`. Modern browsers prefer PNG. The `.ico` file need not be deleted — browsers fall back to it automatically for legacy support.

### D3 — Absolute URL strategy for OG image

**Decision**: Use a root-relative path (`/link-visual.png`) for the `og:image` and `twitter:image` values in the static file; document in the spec that a deployment-time absolute URL is required by the OG spec.

**Rationale**: The absolute deployment URL is not known at build time in this repo. A root-relative path works for local dev and most crawlers. If an absolute URL is needed later, it can be injected via the `env.js` mechanism or a CI substitution step. This is out of scope for this change.

### D4 — Twitter Card type

**Decision**: Use `summary_large_image` card type.

**Rationale**: `link-visual.png` is a landscape preview image designed for social sharing; `summary_large_image` displays it prominently. `summary` (small image) would waste the asset.

## Risks / Trade-offs

- **[Risk] OG image path is root-relative, not absolute** → The OG spec requires absolute URLs for images. Most crawlers (LinkedIn, Slack) resolve relative URLs correctly, but some may not. _Mitigation_: document the limitation; an absolute URL override via `env.js` can be added in a follow-up.
- **[Risk] Title is generic ("Multi-Player Snake")** → A more specific title improves SEO but may not reflect the final brand name. _Mitigation_: the title is a placeholder; the team can update it after branding is confirmed.
- **[Trade-off] Single static description** → All visitors see the same description regardless of game state. Acceptable for a single-page game app.
