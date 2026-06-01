#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd -- "${script_dir}/.." && pwd -P)"
example_dir="${repo_root}/examples/jekyll"

platforms=(
  ruby
  x86_64-linux
  arm64-darwin
  x86_64-darwin
  x64-mingw-ucrt
  x64-mingw32
  x86-mingw32
)

ruby_version_from_readthedocs() {
  local key line value

  while IFS= read -r line; do
    key="${line%%:*}"
    key="${key//[[:space:]]/}"

    if [[ "${key}" == "ruby" ]]; then
      value="${line#*:}"
      value="${value//\"/}"
      value="${value//\'/}"
      value="${value//[[:space:]]/}"

      if [[ -n "${value}" ]]; then
        printf '%s\n' "${value}"
        return 0
      fi
    fi
  done < "${repo_root}/.readthedocs.yaml"
}

ruby_image_for_docker() {
  local ruby_version

  if [[ -n "${BUNDLE_LOCK_RUBY_IMAGE:-}" ]]; then
    printf '%s\n' "${BUNDLE_LOCK_RUBY_IMAGE}"
    return 0
  fi

  ruby_version="${BUNDLE_LOCK_RUBY_VERSION:-}"
  if [[ -z "${ruby_version}" ]]; then
    ruby_version="$(ruby_version_from_readthedocs)"
  fi

  if [[ -z "${ruby_version}" ]]; then
    return 1
  fi

  printf 'ruby:%s-bookworm\n' "${ruby_version}"
}

update_with_local_bundler() {
  cd "${example_dir}"
  bundle lock --add-platform "${platforms[@]}"
}

update_with_docker() {
  local docker_repo_root="${repo_root}"
  local ruby_image

  ruby_image="$(ruby_image_for_docker)"

  if command -v cygpath >/dev/null 2>&1; then
    docker_repo_root="$(cygpath -w "${repo_root}")"
  fi

  MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' docker run --rm \
    -v "${docker_repo_root}:/work" \
    -w /work/examples/jekyll \
    "${ruby_image}" \
    sh -lc 'bundle lock --add-platform "$@"' sh "${platforms[@]}"
}

if command -v docker >/dev/null 2>&1 && ruby_image_for_docker >/dev/null 2>&1; then
  update_with_docker
elif command -v bundle >/dev/null 2>&1; then
  update_with_local_bundler
else
  echo "Unable to update Gemfile.lock: install Docker or Ruby Bundler first." >&2
  echo "Set BUNDLE_LOCK_RUBY_VERSION or BUNDLE_LOCK_RUBY_IMAGE if Docker cannot infer the Ruby image." >&2
  exit 1
fi

echo "Updated ${example_dir}/Gemfile.lock"
