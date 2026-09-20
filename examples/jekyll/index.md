---
layout: "page"
title: "shared-web Jekyll sample"
---

This is a sample project for Jekyll with Beautiful-Jekyll theme. This project allows you to visualize how the
widgets appear in a Jekyll site.

This will be automatically enabled in our
[LizardByte.github.io](https://github.com/LizardByte/LizardByte.github.io) repo.

## CrowdIn

Create an initializer at `assets/js/crowdin-init.js`:

```javascript
globalThis.initCrowdIn('LizardByte-docs', 'jekyll');
```

Then load the CrowdIn assets from either jsDelivr or the installed npm package.

### jsDelivr

```yaml
site-css:
  - href: "https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin-bootstrap-css.css"
site-js:
  - href: "https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin.js"
  - "/assets/js/crowdin-init.js"
```

Replace `latest` with a published package version for immutable URLs.

### npm

Install the package:

```bash
npm install --save-dev @lizardbyte/shared-web --ignore-scripts
```

Copy these package files into `assets/shared-web` as part of the site build:

- `node_modules/@lizardbyte/shared-web/dist/crowdin.js`
- `node_modules/@lizardbyte/shared-web/dist/crowdin-bootstrap-css.css`

Then use the copied assets in `_config.yml`:

```yaml
site-css:
  - "/assets/shared-web/crowdin-bootstrap-css.css"
site-js:
  - "/assets/shared-web/crowdin.js"
  - "/assets/js/crowdin-init.js"
```

This sample's `build.js` demonstrates the copy step.
