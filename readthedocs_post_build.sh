#!/usr/bin/env bash
set -euo pipefail

echo "baseurl: projects/shared-web/${READTHEDOCS_VERSION}/jekyll" >> examples/jekyll/_config.yml
pushd examples/jekyll
npm ci --ignore-scripts
npm run build
popd
