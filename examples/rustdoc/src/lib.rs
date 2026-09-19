//! # shared-web rustdoc sample
//!
//! This is a sample crate for rustdoc. It demonstrates how the shared-web
//! CrowdIn language selector appears in Rust API documentation.
//!
//! ## Widgets
//!
//! ### CrowdIn
//!
//! Use either jsDelivr or an installed copy of `@lizardbyte/shared-web` in a
//! rustdoc HTML hook such as `rustdoc/shared-web.html`.
//!
//! #### jsDelivr
//!
//! Load the published assets directly in the hook:
//!
//! ```html
//! <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin-dockle-css.css">
//! <script src="https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin.js"></script>
//! <script>globalThis.initCrowdIn('LizardByte-docs', 'dockle');</script>
//! ```
//!
//! Replace `latest` with a published package version for immutable URLs.
//!
//! #### npm
//!
//! Install the package:
//!
//! ```text
//! npm install --save-dev @lizardbyte/shared-web --ignore-scripts
//! ```
//!
//! Have Dockle copy the installed assets beside every generated rustdoc page:
//!
//! ```toml
//! [targets.rustdoc]
//! extra_files = [
//!     "node_modules/@lizardbyte/shared-web/dist/crowdin.js",
//!     "node_modules/@lizardbyte/shared-web/dist/crowdin-dockle-css.css",
//! ]
//! ```
//!
//! Then use the copied asset names in the hook:
//!
//! ```html
//! <link rel="stylesheet" href="crowdin-dockle-css.css">
//! <script src="crowdin.js"></script>
//! <script>globalThis.initCrowdIn('LizardByte-docs', 'dockle');</script>
//! ```
//!
//! #### Cargo configuration
//!
//! Configure Cargo to pass the hook to rustdoc:
//!
//! ```toml
//! [build]
//! rustdocflags = [
//!     "--html-after-content",
//!     "rustdoc/shared-web.html",
//! ]
//! ```

/// Returns a greeting for the provided project name.
///
/// # Examples
///
/// ```
/// let greeting = shared_web_rustdoc_example::greeting("shared-web");
/// assert_eq!(greeting, "Hello, shared-web!");
/// ```
pub fn greeting(project: &str) -> String {
    format!("Hello, {project}!")
}

/// Example metadata rendered by rustdoc.
#[derive(Debug, Eq, PartialEq)]
pub struct Widget {
    /// Human-readable widget name.
    pub name: String,
    /// Whether the widget is enabled in the rendered page.
    pub enabled: bool,
}
