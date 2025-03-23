# shared-web Doxygen sample

This is a sample project for Doxygen with doxygen-awesome-css theme. This project allows you to visualize how the
widgets appear in Doxygen documentation.

This will be automatically enabled in our [doxyconfig](https://github.com/LizardByte/doxyconfig) repo.

## Widgets

You can include widgets in your Doxygen documentation by adding the following to your
Doxyfile (or Doxygen configuration file). You may need to adjust the paths depending on your project structure.

### CrowdIn

Doxyfile:
```doxygen
HTML_EXTRA_FILES += ../node_modules/@lizardbyte/shared-web/dist/crowdin.js
HTML_EXTRA_STYLESHEET += ../node_modules/@lizardbyte/shared-web/dist/crowdin-doxygen-css.css
```

header.html:
```html
<!--LIZARDBYTE/SHARED-WEB START-->
<script type="text/javascript" src="$relpath^crowdin.js"></script>
<script type="text/javascript">
    initCrowdIn('LizardByte-docs', null);
</script>
```

<details style="display: none;">
  <summary></summary>
  [TOC]
</details>
