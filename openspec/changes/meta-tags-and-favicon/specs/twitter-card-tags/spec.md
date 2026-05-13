## ADDED Requirements

### Requirement: Twitter Card type declared
The `index.html` `<head>` SHALL contain a `<meta name="twitter:card" content="summary_large_image">` tag.

#### Scenario: X/Twitter renders large image card
- **WHEN** a user shares the app URL on X/Twitter
- **THEN** the tweet card SHALL use the `summary_large_image` layout showing the preview image prominently

### Requirement: Twitter title and description tags present
The `index.html` `<head>` SHALL contain `twitter:title` and `twitter:description` meta tags.

#### Scenario: Twitter card shows title and description
- **WHEN** X/Twitter fetches the page metadata for a shared link
- **THEN** the card SHALL display the app title and description from `twitter:title` and `twitter:description`

### Requirement: Twitter image tag present
The `index.html` `<head>` SHALL contain a `twitter:image` meta tag whose content references `link-visual.png` from `public/`.

#### Scenario: Twitter card shows preview image
- **WHEN** a user shares the app URL on X/Twitter
- **THEN** the tweet card SHALL display the image from `link-visual.png`

#### Scenario: Twitter image alt text provided
- **WHEN** the HTML is inspected
- **THEN** there SHALL be a `twitter:image:alt` tag with a non-empty description of the image
