# shared-web Doxygen sample

This is a sample project for Doxygen with Dockle. It allows you to visualize how shared-web widgets appear in
Doxygen documentation while Dockle owns the generated Doxyfile and theme.

## Widgets

You can include widgets in your Doxygen documentation from the installed npm
package. First add shared-web to the project:

```bash
npm install --save-dev @lizardbyte/shared-web --ignore-scripts
```

Doxygen's native extra-asset hooks require local files, so point `dockle.toml`
at the package under `node_modules`. You may need to adjust the paths depending
on your project structure. Dockle targets that accept web URLs can instead use
the equivalent version-pinned assets from jsDelivr.

### CrowdIn

`dockle.toml`:
```toml
[targets.doxygen]
extra_files = ["node_modules/@lizardbyte/shared-web/dist/crowdin.js"]
extra_stylesheets = ["node_modules/@lizardbyte/shared-web/dist/crowdin-dockle-css.css"]
```

Authored page:
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
