## ADDED Requirements

### Requirement: Open Graph basic tags present
The `index.html` `<head>` SHALL contain the following Open Graph meta tags:
- `og:type` with value `website`
- `og:title` with the app's display name
- `og:description` with a short description of the app
- `og:url` with a root-relative or absolute URL of the page

#### Scenario: OG tags are present in HTML source
- **WHEN** a web crawler reads the raw HTML of the app
- **THEN** it SHALL find `og:type`, `og:title`, `og:description`, and `og:url` meta tags in the `<head>`

### Requirement: Open Graph image tag present
The `index.html` `<head>` SHALL contain an `og:image` meta tag whose content references `link-visual.png` from `public/`.

#### Scenario: Social platform renders preview image
- **WHEN** a user shares the app URL on LinkedIn, Facebook, or Slack
- **THEN** the platform's link preview SHALL display the image from `link-visual.png`

#### Scenario: OG image alt text provided
- **WHEN** the HTML is inspected
- **THEN** there SHALL be an `og:image:alt` tag with a non-empty description of the preview image

### Requirement: Open Graph site name tag present
The `index.html` `<head>` SHALL contain an `og:site_name` meta tag with the name of the application.

#### Scenario: Site name visible in link preview
- **WHEN** a platform that supports `og:site_name` renders a link card
- **THEN** the site name SHALL be displayed alongside the title and description
