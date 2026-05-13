## Why

The Angular app's `index.html` has only the bare minimum metadata: a title, viewport tag, and a reference to `favicon.ico`. This means the tab icon is outdated, there is no rich social-media preview when a link is shared on LinkedIn, X/Twitter, Slack, or similar platforms, and search engines receive no structured description of the page.

## What Changes

- Replace the `<link rel="icon">` reference from `favicon.ico` to `favicon.png` (already present in `public/`)
- Add Open Graph (`og:*`) meta tags using `link-visual.png` as the preview image
- Add Twitter Card meta tags so X/Twitter renders a rich card
- Add a meaningful `<meta name="description">` for SEO
- Add `<meta name="author">` and `<meta name="theme-color">` as complementary tags
- Update the `<title>` to be more descriptive

## Capabilities

### New Capabilities

- `favicon`: Serve `favicon.png` as the browser tab icon (replacing `favicon.ico`), including an Apple Touch Icon reference for iOS home-screen bookmarks
- `open-graph-tags`: Open Graph protocol tags that enable rich link previews on LinkedIn, Facebook, Slack, Discord, and other OG-aware platforms; uses `link-visual.png` as the preview image
- `twitter-card-tags`: Twitter/X Card meta tags for rich tweet previews; uses `summary_large_image` card type with `link-visual.png`
- `seo-meta-tags`: Core SEO meta tags — `description`, `author`, `theme-color`, and `robots` — that complement the social tags and improve search-engine discoverability

### Modified Capabilities

<!-- none -->

## Impact

- `src/App/src/index.html` — all changes are confined to the `<head>` section
- `public/favicon.png` and `public/link-visual.png` are already present; no new assets required
- No Angular component, TypeScript, or SCSS changes needed
- No backend or infrastructure changes
