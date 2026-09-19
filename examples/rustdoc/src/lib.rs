//! # shared-web rustdoc sample
//!
//! This is a sample crate for rustdoc. It demonstrates how the shared-web
//! CrowdIn language selector appears in Rust API documentation.
//!
//! ## Widgets
//!
//! ### CrowdIn
//!
//! Install `@lizardbyte/shared-web` with npm, then create the rustdoc HTML
//! hook at `rustdoc/shared-web.html` in your crate root. The crate root is the
//! directory that contains `Cargo.toml`, so this example stores the hook at
//! `examples/rustdoc/rustdoc/shared-web.html`.
//!
//! The hook loads `crowdin.js` and `crowdin-dockle-css.css` from the same
//! directory as each generated HTML page. Dockle copies those files beside
//! every generated `.html` file from `[targets.rustdoc].extra_files`.
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
//! ```toml
//! [targets.rustdoc]
//! extra_files = [
//!     "node_modules/@lizardbyte/shared-web/dist/crowdin.js",
//!     "node_modules/@lizardbyte/shared-web/dist/crowdin-dockle-css.css",
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
