# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "shared-web-jekyll"
  spec.version       = "0.0.0"
  spec.authors       = ["ReenigneArcher"]

  spec.summary       = "Example of using shared-web in a Jekyll site."

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_data)}i) }

  spec.add_runtime_dependency "jekyll", ">= 3.9.3"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.4"
  spec.add_runtime_dependency "kramdown-parser-gfm", "~> 1.1"
  spec.add_runtime_dependency "kramdown", "~> 2.3"
  spec.add_runtime_dependency "webrick", "~> 1.8"

  spec.add_development_dependency "jekyll-remote-theme", "~> 0.4"
end
