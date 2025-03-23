shared-web Sphinx sample
========================

This is a sample project for Sphinx with Furo theme. This project allows you to visualize how the
widgets appear in Sphinx documentation.

Widgets
-------

CrowdIn
~~~~~~~

Add the following to the Sphinx configuration file to enable the CrowdIn language selector:

.. code-block:: python

   html_css_files = [
       'https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin-furo-css.css',
   ]
   html_js_files = [
       'https://cdn.jsdelivr.net/npm/@lizardbyte/shared-web@latest/dist/crowdin.js',
       'js/crowdin.js',  # initialize crowdin language selector
   ]

Then create a file named ``js/crowdin.js`` located in the ``html_static_path`` directory, with the following content:

.. code-block:: javascript

   window.initCrowdIn('LizardByte-docs', 'sphinx')
