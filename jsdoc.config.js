const config = require("./jsdoc.json");

const canonicalUrl = process.env.READTHEDOCS_CANONICAL_URL;
if (canonicalUrl) {
  config.opts.basePath = new URL(canonicalUrl).pathname;
}

module.exports = config;
