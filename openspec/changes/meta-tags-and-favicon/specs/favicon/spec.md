## ADDED Requirements

### Requirement: PNG favicon declared in HTML
The `index.html` `<head>` SHALL contain a `<link rel="icon" type="image/png" href="favicon.png">` tag pointing to the `favicon.png` asset in `public/`.

#### Scenario: Browser renders PNG tab icon
- **WHEN** a user opens the app in a modern browser
- **THEN** the browser tab SHALL display the icon from `favicon.png`

#### Scenario: Legacy favicon.ico left undeclared
- **WHEN** the browser requests `/favicon.ico` automatically (legacy behavior)
- **THEN** the server SHALL serve the existing `favicon.ico` file without error, even though it is not explicitly linked in `<head>`

### Requirement: Apple Touch Icon declared in HTML
The `index.html` `<head>` SHALL contain a `<link rel="apple-touch-icon" href="favicon.png">` tag so that iOS users who add the app to their home screen see the correct icon.

#### Scenario: iOS home-screen bookmark shows correct icon
- **WHEN** a user on iOS saves the app to their home screen
- **THEN** the home-screen icon SHALL be the image from `favicon.png`

### Requirement: Old favicon.ico link removed
The `<link rel="icon" type="image/x-icon" href="favicon.ico">` tag that previously existed in `index.html` SHALL be removed and replaced by the PNG favicon link.

#### Scenario: No duplicate favicon links
- **WHEN** the HTML is inspected
- **THEN** there SHALL be exactly one `<link rel="icon">` tag, and it SHALL reference `favicon.png`
