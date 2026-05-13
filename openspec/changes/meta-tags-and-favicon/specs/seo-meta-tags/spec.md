## ADDED Requirements

### Requirement: Meta description tag present
The `index.html` `<head>` SHALL contain a `<meta name="description">` tag with a concise, non-empty description of the application.

#### Scenario: Search engine indexes description
- **WHEN** a search engine crawls the page
- **THEN** it SHALL find a `description` meta tag with a meaningful summary of the app

### Requirement: Author meta tag present
The `index.html` `<head>` SHALL contain a `<meta name="author">` tag identifying the creator or team.

#### Scenario: Author is declared in HTML
- **WHEN** the HTML is inspected
- **THEN** there SHALL be an `author` meta tag with a non-empty value

### Requirement: Theme color meta tag present
The `index.html` `<head>` SHALL contain a `<meta name="theme-color">` tag specifying the app's primary brand color, so that supporting browsers (Android Chrome, Edge) tint their UI chrome to match.

#### Scenario: Browser tints UI chrome
- **WHEN** a user opens the app on Android Chrome
- **THEN** the browser address bar SHALL be tinted with the color declared in `theme-color`

### Requirement: Robots meta tag present
The `index.html` `<head>` SHALL contain a `<meta name="robots" content="index, follow">` tag to explicitly allow search engines to index the page and follow its links.

#### Scenario: Search engine is permitted to index
- **WHEN** a search engine crawler reads the page
- **THEN** it SHALL find `robots` meta tag with `index, follow` and proceed to index the page
