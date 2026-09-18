# shared-web Doxygen sample

This is a sample project for Doxygen with Dockle. It allows you to visualize how shared-web widgets appear in
Doxygen documentation while Dockle owns the generated Doxyfile and theme.

## Widgets

You can include widgets in your Doxygen documentation by adding the following to
`dockle.toml`. You may need to adjust the paths depending on your project structure.

### CrowdIn

`dockle.toml`:
```toml
[targets.doxygen]
extra_files = ["dist/crowdin.js"]
extra_stylesheets = ["dist/crowdin-doxygen-css.css"]
```

Authored page:
```html
<script src="crowdin.js"></script>
<script type="text/javascript">
  initCrowdIn('LizardByte-docs', null);
</script>
```

@htmlonly
<script src="crowdin.js"></script>
<script>initCrowdIn('LizardByte-docs', null);</script>
@endhtmlonly

<details style="display: none;">
  <summary></summary>
  [TOC]
</details>
