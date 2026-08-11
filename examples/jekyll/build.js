const fs = require('node:fs');
const path = require('node:path');

const exampleDir = __dirname;
const outputRoot = process.env.READTHEDOCS_OUTPUT || path.join(exampleDir, 'build');
const assetDir = path.join(outputRoot, 'html', 'jekyll', 'assets', 'shared-web');
const sharedWebDist = path.join(exampleDir, 'node_modules', '@lizardbyte', 'shared-web', 'dist');
const sharedWebAssets = [
    'crowdin.js',
    'crowdin-bootstrap-css.css',
];

fs.mkdirSync(assetDir, { recursive: true });

sharedWebAssets.forEach((asset) => {
    fs.copyFileSync(path.join(sharedWebDist, asset), path.join(assetDir, asset));
});
