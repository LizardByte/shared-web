# shared-web Doxygen sample

This is a sample project for Doxygen with Dockle. It allows you to visualize how shared-web widgets appear in
Doxygen documentation while Dockle owns the generated Doxyfile and theme.

## Widgets

You can load the shared assets from jsDelivr or install the npm package. You may
need to adjust local paths depending on your project structure.

### CrowdIn

Use either jsDelivr or an installed copy of `@lizardbyte/shared-web`.

#### jsDelivr

Add the remote assets and initializer to the authored page:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin-dockle-css.css"
>
<script src="https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin.js"></script>
<script>initCrowdIn('LizardByte-docs', 'dockle');</script>
```

Replace `latest` with a published package version for immutable URLs.

#### npm

Install the package:

```bash
npm install --save-dev @lizardbyte/shared-web --ignore-scripts
```

Doxygen's native extra-asset hooks require local files, so point `dockle.toml`
at the installed package:

```toml
[targets.doxygen]
extra_files = ["node_modules/@lizardbyte/shared-web/dist/crowdin.js"]
extra_stylesheets = ["node_modules/@lizardbyte/shared-web/dist/crowdin-dockle-css.css"]
```

Then initialize CrowdIn in the authored page:

```html
<script src="crowdin.js"></script>
<script type="text/javascript">
  initCrowdIn('LizardByte-docs', 'dockle');
</script>
```

@htmlonly
<script src="crowdin.js"></script>
<script>initCrowdIn('LizardByte-docs', 'dockle');</script>
@endhtmlonly
