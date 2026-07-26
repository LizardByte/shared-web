<div align="center">
  <img
    src="https://raw.githubusercontent.com/LizardByte/.github/refs/heads/master/branding/logos/logo.svg"
    alt="LizardByte icon"
    width="256"
  />
  <h1 align="center">shared-web</h1>
  <h4 align="center">Shared web assets for LizardByte projects.</h4>
</div>

<div align="center">
  <a href="https://github.com/LizardByte/shared-web"><img src="https://img.shields.io/github/stars/lizardbyte/shared-web.svg?logo=github&style=for-the-badge" alt="GitHub stars"></a>
  <a href="https://www.npmjs.com/package/@lizardbyte/shared-web"><img src="https://img.shields.io/npm/dm/%40lizardbyte%2Fshared-web.svg?style=for-the-badge&logo=npm&label=npm%20downloads/m" alt="NPM Monthly Downloads"></a>
  <a href="https://www.npmjs.com/package/@lizardbyte/shared-web"><img src="https://img.shields.io/npm/v/%40lizardbyte%2Fshared-web.svg?style=for-the-badge&logo=npm&label=npm%20version" alt="NPM Version"></a>
  <a href="https://github.com/LizardByte/shared-web/actions/workflows/_ci-node.yml?query=branch%3Amaster"><img src="https://img.shields.io/github/actions/workflow/status/lizardbyte/shared-web/_ci-node.yml.svg?branch=master&label=CI&logo=github&style=for-the-badge" alt="CI"></a>
  <a href="https://codecov.io/gh/LizardByte/shared-web"><img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fapp.lizardbyte.dev%2Fdashboard%2Fshields%2Fcodecov%2Fshared-web.json&style=for-the-badge&logo=codecov" alt="Codecov"></a>
  <a href="https://sonarcloud.io/project/overview?id=LizardByte_shared-web"><img src="https://img.shields.io/sonar/quality_gate/LizardByte_shared-web.svg?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge&logo=sonarqubecloud&label=sonarcloud" alt="SonarCloud"></a>
</div>

# Overview

Common web assets for use in LizardByte projects.

## CDN

Published package assets are available through [jsDelivr](https://www.jsdelivr.com/).
For example, a language icon can be embedded directly:

```html
<img
  src="https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/language-icons/JavaScript.svg"
  alt="JavaScript"
  width="32"
  height="32"
/>
```

Replace `latest` with a published package version for an immutable URL. URL-encode
icon filenames that contain spaces or other reserved characters.

## Installation

### Install via NPM registry

1. Add the dependency to your package.json file:
   ```bash
   npm install @lizardbyte/shared-web --ignore-scripts
   ```

### Install via GitHub Package Registry

1. Add a `.npmrc` file to the root of your project with the following contents.
   ```
   //npm.pkg.github.com/:_authToken=TOKEN
   @lizardbyte:registry=https://npm.pkg.github.com
   ```

   Replace `TOKEN` with a valid GitHub token with read access to the package registry.

   See
   [Authenticating with a personal access token](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token)
   for more information or alternative methods of authentication.

2. Add the dependency to your package.json file:
   ```bash
   npm install @lizardbyte/shared-web --ignore-scripts
   ```
