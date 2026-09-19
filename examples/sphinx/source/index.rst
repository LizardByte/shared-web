shared-web Sphinx sample
========================

This is a Sphinx project built and themed by Dockle. It allows you to visualize how the widgets appear in Sphinx
documentation.

Widgets
-------

CrowdIn
~~~~~~~

Add the following to ``dockle.toml`` to enable the CrowdIn language selector without maintaining ``conf.py``:

.. code-block:: toml

   [targets.sphinx]
   static_paths = ["docs/_static"]
   extra_stylesheets = ["https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin-dockle-css.css"]
   extra_javascript = ["https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin.js", "js/crowdin.js"]

Then create ``js/crowdin.js`` in an authored static directory:

.. code-block:: javascript

   window.initCrowdIn('LizardByte-docs', 'dockle')

Whitespace restoration example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The translated block below intentionally places each item on its own syntax-highlighted line. It provides a visual
regression check that CrowdIn preserves line breaks between adjacent inline elements.

.. code-block:: markdown

   - [x] This is a complete item
   - [ ] This is an incomplete item
