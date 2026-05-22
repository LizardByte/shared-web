const fs = require('node:fs');
const path = require('node:path');

const exampleDir = path.resolve(__dirname, '..');
const targetDir = path.join(exampleDir, 'build', 'html', 'rustdoc');
const docDir = path.join(targetDir, 'doc');
const sharedWebDist = path.join(exampleDir, 'node_modules', '@lizardbyte', 'shared-web', 'dist');
const sharedWebAssets = [
    'crowdin.js',
    'crowdin-rustdoc-css.css',
];

function findHtmlDirectories(dir) {
    const directories = new Set();
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            findHtmlDirectories(entryPath).forEach((htmlDir) => directories.add(htmlDir));
            return;
        }

        if (entry.isFile() && entry.name.endsWith('.html')) {
            directories.add(dir);
        }
    });

    return directories;
}

fs.mkdirSync(docDir, { recursive: true });

findHtmlDirectories(docDir).forEach((htmlDir) => {
    sharedWebAssets.forEach((asset) => {
        fs.copyFileSync(path.join(sharedWebDist, asset), path.join(htmlDir, asset));
    });
});
