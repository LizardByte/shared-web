//! # shared-web rustdoc sample
//!
//! This is a sample crate for rustdoc. It demonstrates how the shared-web
//! CrowdIn language selector appears in Rust API documentation.
//!
//! ## Widgets
//!
//! ### CrowdIn
//!
//! Install `@lizardbyte/shared-web`, then add a rustdoc HTML hook file:
//!
//! ```html
//! <!--LIZARDBYTE/SHARED-WEB START-->
//! <script>
//! (function() {
//!     const rustdocVars = document.querySelector('meta[name="rustdoc-vars"]');
//!     const rootPath = rustdocVars ? rustdocVars.dataset.rootPath : '';
//!
//!     const stylesheet = document.createElement('link');
//!     stylesheet.rel = 'stylesheet';
//!     stylesheet.href = rootPath + 'crowdin-rustdoc-css.css';
//!     document.head.appendChild(stylesheet);
//!
//!     const crowdin = document.createElement('script');
//!     crowdin.src = rootPath + 'crowdin.js';
//!     crowdin.onload = function() {
//!         globalThis.initCrowdIn('LizardByte-docs', 'rustdoc');
//!     };
//!     document.head.appendChild(crowdin);
//! }());
//! </script>
//! <!--LIZARDBYTE/SHARED-WEB END-->
//! ```
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
//!
//! Copy `crowdin.js` and `crowdin-rustdoc-css.css` from
//! `node_modules/@lizardbyte/shared-web/dist` into the generated rustdoc root
//! so the hook can load them with rustdoc's page-relative `rootPath`.

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
