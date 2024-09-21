/**
 * Load a script asynchronously, and add it to the DOM. Optionally, call a callback when the script has loaded.
 * @param url The URL of the script to load.
 * @param callback An optional callback to call when the script has loaded.
 */
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = () => {
        if (callback) callback(null, script);
    };

    script.onerror = () => {
        if (callback) callback(new Error(`Failed to load script: ${url}`));
    };

    document.head.appendChild(script);
}

// Expose to the global scope
if (typeof window !== 'undefined') {
    window.loadScript = loadScript;
}

module.exports = loadScript;
