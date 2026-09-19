shared-web Sphinx sample
========================

This is a Sphinx project built and themed by Dockle. It allows you to visualize how the widgets appear in Sphinx
documentation.

Widgets
-------

CrowdIn
~~~~~~~

Use either jsDelivr or an installed copy of ``@lizardbyte/shared-web``. Both options use the same small local
initializer and do not require maintaining ``conf.py``.

jsDelivr
^^^^^^^^

Load the published assets directly from jsDelivr:

.. code-block:: toml

   [targets.sphinx]
   static_paths = ["docs/_static"]
   extra_stylesheets = ["https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin-dockle-css.css"]
   extra_javascript = ["https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin.js", "js/crowdin.js"]

Replace ``latest`` with a published package version for immutable URLs.

npm
^^^

Install the package, then expose its ``dist`` directory as a Sphinx static path:

.. code-block:: bash

   npm install --save-dev @lizardbyte/shared-web --ignore-scripts

.. code-block:: toml

   [targets.sphinx]
   static_paths = [
     "docs/_static",
     "node_modules/@lizardbyte/shared-web/dist",
   ]
   extra_stylesheets = ["crowdin-dockle-css.css"]
   extra_javascript = ["crowdin.js", "js/crowdin.js"]

Initializer
^^^^^^^^^^^

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
