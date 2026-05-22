//! # shared-web rustdoc sample
//!
//! This is a sample crate for rustdoc. It demonstrates how the shared-web
//! CrowdIn language selector appears in Rust API documentation.
//!
//! ## Widgets
//!
//! ### CrowdIn
//!
//! Install `@lizardbyte/shared-web`, then create the rustdoc HTML hook at
//! `rustdoc/shared-web.html` in your crate root. The crate root is the
//! directory that contains `Cargo.toml`, so this example stores the hook at
//! `examples/rustdoc/rustdoc/shared-web.html`.
//!
//! The hook loads `crowdin.js` and `crowdin-rustdoc-css.css` from the same
//! directory as each generated HTML page. The example build script copies
//! those two files beside every generated `.html` file.
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
//! When adapting this outside the example, copy `crowdin.js` and
//! `crowdin-rustdoc-css.css` from `node_modules/@lizardbyte/shared-web/dist`
//! beside each generated rustdoc HTML page, or adjust the hook paths to point
//! at a location that every generated page can reach.

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
