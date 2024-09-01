# shared-web

[![GitHub stars](https://img.shields.io/github/stars/lizardbyte/shared-web.svg?logo=github&style=for-the-badge)](https://github.com/LizardByte/shared-web)
[![GitHub Workflow Status (CI)](https://img.shields.io/github/actions/workflow/status/lizardbyte/shared-web/ci.yml.svg?branch=master&label=CI%20build&logo=github&style=for-the-badge)](https://github.com/LizardByte/shared-web/actions/workflows/CI.yml?query=branch%3Amaster)
[![Codecov](https://img.shields.io/codecov/c/gh/LizardByte/shared-web?token=gWHqqpMAuO&style=for-the-badge&logo=codecov&label=codecov)](https://codecov.io/gh/LizardByte/shared-web)
[![NPM Monthly Downloads](https://img.shields.io/npm/dm/%40lizardbyte%2Fshared-web?style=for-the-badge&logo=npm&label=npm%20downloads/m)](https://www.npmjs.com/package/@lizardbyte/shared-web)
[![NPM Version](https://img.shields.io/npm/v/%40lizardbyte%2Fshared-web?style=for-the-badge&logo=npm&label=npm%20version)](https://www.npmjs.com/package/@lizardbyte/shared-web)
[![GitHub Monthly Downloads](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fipitio.github.io%2Fbackage%2FLizardByte%2Fshared-web%2Fshared-web.json&query=%24.downloads_month&label=github%20downloads/m&style=for-the-badge&logo=github%20actions)](https://github.com/LizardByte/Sunshine/pkgs/npm/shared-web)
[![GitHub Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fipitio.github.io%2Fbackage%2FLizardByte%2Fshared-web%2Fshared-web.json&query=%24.version%5B%3F(%40.latest%3D%3Dtrue)%5D.name&label=gh%20version&style=for-the-badge&logo=github%20actions)](https://github.com/LizardByte/Sunshine/pkgs/npm/shared-web)

Common web assets for use in LizardByte projects.

## Installation

### Install via NPM registry

1. Add the dependency to your package.json file:
   ```bash
   npm install @lizardbyte/shared-web
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
   npm install @lizardbyte/shared-web
   ```
