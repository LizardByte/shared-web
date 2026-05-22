const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const exampleDir = path.resolve(__dirname, '..');
const readTheDocsOutput = process.env.READTHEDOCS_OUTPUT ?
    path.resolve(process.env.READTHEDOCS_OUTPUT) :
    path.join(exampleDir, 'build');
const targetDir = path.join(readTheDocsOutput, 'html', 'rustdoc');
const docDir = path.join(targetDir, 'doc');
const sharedWebDist = path.join(exampleDir, 'node_modules', '@lizardbyte', 'shared-web', 'dist');

const cargoResult = spawnSync('cargo', ['doc', '--no-deps', '--target-dir', targetDir], {
    stdio: 'inherit',
});

if (cargoResult.status !== 0) {
    process.exit(cargoResult.status || 1);
}

fs.mkdirSync(docDir, { recursive: true });

[
    'crowdin.js',
    'crowdin-rustdoc-css.css',
].forEach((asset) => {
    fs.copyFileSync(path.join(sharedWebDist, asset), path.join(docDir, asset));
});
