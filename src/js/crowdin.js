const loadScript = require('./load-script');

/**
 * jsDelivr CDN URL serving Crowdin distribution files from the crowdin-dist
 * git branch.  jsDelivr unconditionally sets Access-Control-Allow-Origin: *,
 * so cross-origin fetch() calls succeed without any browser plugin.
 * The branch is refreshed daily by the "Sync Crowdin Distribution" workflow.
 * Structure mirrors https://distributions.crowdin.net/<hash>/… exactly.
 * @type {string}
 */
const CROWDIN_DIST_MIRROR = 'https://cdn.jsdelivr.net/gh/LizardByte/i18n@dist';
const CROWDIN_PLATFORM_STYLING_MAX_ATTEMPTS = 100;
const CROWDIN_PLATFORM_STYLING_RETRY_DELAY_MS = 50;
const CROWDIN_INLINE_ELEMENT_SELECTOR = [
    'a',
    'abbr',
    'b',
    'cite',
    'code',
    'del',
    'em',
    'i',
    'ins',
    'kbd',
    'mark',
    'q',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'time',
    'u',
    'var',
].join(',');

/**
 * Records whitespace that separates text from inline elements before Crowdin translates the page.
 * @returns {Array<{
 *     node: Text,
 *     leading: boolean,
 *     trailing: boolean,
 *     previousInline: Element|null,
 *     nextInline: Element|null,
 *     whitespaceOnly: boolean
 * }>} Recorded text-node boundaries.
 */
function _captureCrowdinWhitespaceBoundaries() {
    const boundaries = [];
    const walker = document.createTreeWalker(document.body, globalThis.NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node !== null) {
        const previousIsInline = node.previousSibling instanceof globalThis.Element &&
            node.previousSibling.matches(CROWDIN_INLINE_ELEMENT_SELECTOR);
        const nextIsInline = node.nextSibling instanceof globalThis.Element &&
            node.nextSibling.matches(CROWDIN_INLINE_ELEMENT_SELECTOR);
        const leading = previousIsInline && /^\s/.test(node.data);
        const trailing = nextIsInline && /\s$/.test(node.data);

        if (leading || trailing) {
            boundaries.push({
                node,
                leading,
                trailing,
                previousInline: previousIsInline ? node.previousSibling : null,
                nextInline: nextIsInline ? node.nextSibling : null,
                whitespaceOnly: /^\s*$/.test(node.data),
            });
        }

        node = walker.nextNode();
    }

    return boundaries;
}

/**
 * Finds the current text node for a boundary after Crowdin changes the DOM.
 * @param {Object} boundary Recorded whitespace boundary.
 * @returns {Text|null} Current or recreated text node.
 */
function _resolveCrowdinWhitespaceNode(boundary) {
    if (boundary.node.isConnected) return boundary.node;

    const previousReplacement = boundary.previousInline?.nextSibling;
    if (previousReplacement instanceof globalThis.Text && previousReplacement.isConnected) {
        boundary.node = previousReplacement;
        return boundary.node;
    }
    const nextReplacement = boundary.nextInline?.previousSibling;
    if (nextReplacement instanceof globalThis.Text && nextReplacement.isConnected) {
        boundary.node = nextReplacement;
        return boundary.node;
    }
    if (!boundary.whitespaceOnly) return null;

    const replacement = document.createTextNode('');
    if (boundary.previousInline?.isConnected) {
        boundary.previousInline.after(replacement);
    } else if (boundary.nextInline?.isConnected) {
        boundary.nextInline.before(replacement);
    } else {
        return null;
    }

    boundary.node = replacement;
    return boundary.node;
}

/**
 * Restores whitespace that Crowdin removed from translated text-node boundaries.
 * @param {Array<Object>} boundaries Recorded text-node boundaries.
 */
function _restoreCrowdinWhitespaceBoundaries(boundaries) {
    boundaries.forEach((boundary) => {
        const node = _resolveCrowdinWhitespaceNode(boundary);
        if (node === null) return;

        if (boundary.leading && !/^\s/.test(node.data)) {
            node.data = ' ' + node.data;
        }
        if (boundary.trailing && !/\s$/.test(node.data)) {
            node.data += ' ';
        }
    });
}

/**
 * Creates the Website Translator callback and observes later translation mutations.
 * @param {Array<Object>} boundaries Recorded text-node boundaries.
 * @returns {Function} Website Translator callback.
 */
function _createCrowdinTranslationCallback(boundaries) {
    const translationObserver = new globalThis.MutationObserver(restoreAndObserve);

    function restoreAndObserve() {
        translationObserver.disconnect();
        _restoreCrowdinWhitespaceBoundaries(boundaries);
        translationObserver.observe(document.body, {
            characterData: true,
            childList: true,
            subtree: true,
        });
    }

    return restoreAndObserve;
}

/**
 * Monkey-patches globalThis.fetch to redirect Crowdin distribution requests to
 * the self-hosted GitHub Pages mirror.
 *
 * Must be called BEFORE proxy-translator.js is loaded so that every fetch()
 * the script makes is already intercepted.
 *
 * Idempotent – installs the interceptor at most once per page.
 */
function _installCrowdinFetchInterceptor() {
    if (typeof globalThis.fetch !== 'function') return;
    if (globalThis._crowdinMirrorInstalled) return;
    globalThis._crowdinMirrorInstalled = true;

    const _origFetch = globalThis.fetch.bind(globalThis);

    globalThis.fetch = function crowdinMirrorFetch(url, options) {
        if (typeof url === 'string') {
            let parsed;
            try {
                parsed = new URL(url);
            } catch {
                // Not a valid absolute URL – pass through unchanged.
            }
            // Use exact hostname comparison to avoid prefix-match bypasses
            // (e.g. distributions.crowdin.net.evil.com) that would be flagged
            // by incomplete URL sanitisation checks.
            if (parsed?.protocol === 'https:' && parsed.hostname === 'distributions.crowdin.net') {
                const mirroredUrl = CROWDIN_DIST_MIRROR + parsed.pathname + parsed.search + parsed.hash;
                return _origFetch(mirroredUrl, options);
            }
        }
        return _origFetch(url, options);
    };
}

/**
 * Re-attempts platform styling while Crowdin inserts the language picker.
 * @param {string} platform - UI platform ('sphinx' or 'rustdoc').
 * @param {number} attempt - Current retry count.
 */
function _retryCrowdinPlatformStyling(platform, attempt) {
    if (attempt >= CROWDIN_PLATFORM_STYLING_MAX_ATTEMPTS) {
        return;
    }

    globalThis.setTimeout(function() {
        _applyCrowdinPlatformStyling(platform, attempt + 1);
    }, CROWDIN_PLATFORM_STYLING_RETRY_DELAY_MS);
}

/**
 * Applies platform-specific placement after the Crowdin picker exists.
 * @param {string} platform - UI platform ('sphinx' or 'rustdoc').
 * @param {number} attempt - Current retry count.
 */
function _applyCrowdinPlatformStyling(platform, attempt = 0) {
    const container = document.getElementById('crowdin-language-picker');

    if (platform === 'sphinx') {
        const button = document.getElementsByClassName('cr-picker-button')[0];
        const sidebar = document.getElementsByClassName('sidebar-sticky')[0];

        if (container === null || button === undefined || sidebar === undefined) {
            _retryCrowdinPlatformStyling(platform, attempt);
            return;
        }

        container.classList.remove('cr-position-bottom-left');
        container.style.width = button.offsetWidth + 10 + 'px';
        container.style.position = 'relative';
        container.style.left = '10px';
        container.style.bottom = '10px';

        // move button to related pages
        sidebar.appendChild(container);
        return;
    }

    const sidebar = document.querySelector('.sidebar .sidebar-elems') || document.querySelector('.sidebar');

    if (container === null || sidebar === null) {
        _retryCrowdinPlatformStyling(platform, attempt);
        return;
    }

    container.classList.remove('cr-position-bottom-left');
    container.classList.add('rustdoc-crowdin-picker');
    container.style.position = 'static';
    container.style.left = 'auto';
    container.style.bottom = 'auto';

    sidebar.appendChild(container);
}

/**
 * Initializes Crowdin translation widget based on project and UI platform.
 * @param {string} project - Project name ('LizardByte' or 'LizardByte-docs').
 * @param {string|null} platform - UI platform ('sphinx', 'rustdoc', or null).
 */
function initCrowdIn(project = 'LizardByte', platform = null) {
    // Input validation
    if (!['LizardByte', 'LizardByte-docs'].includes(project)) {
        console.error('Invalid project. Must be "LizardByte" or "LizardByte-docs"');
        return;
    }
    if (!['sphinx', 'rustdoc', null].includes(platform)) {
        console.error('Invalid UI. Must be "sphinx", "rustdoc", or null');
        return;
    }

    // Redirect distribution CDN requests to our self-hosted GitHub Pages mirror
    // before the script is even loaded so every fetch() it makes is intercepted.
    _installCrowdinFetchInterceptor();

    loadScript('https://website-translator.app.crowdin.net/assets/proxy-translator.js', function() {
        // Configure base settings based on project
        const projectSettings = {
            'LizardByte': {
                baseUrl: "https://app.lizardbyte.dev",
                distribution: "458f881791aebba1d4dde491bw4",
            },
            'LizardByte-docs': {
                baseUrl: "https://docs.lizardbyte.dev",
                distribution: "d6c830ba4b41106fefe5d391bw4",
            }
        };

        let languageTitles = {
            "bg": "Български (Bulgarian)",
            "cs": "Čeština (Czech)",
            "de": "Deutsch (German)",
            "en": "English",
            "en-GB": "English, United Kingdom",
            "en-US": "English, United States",
            "es-ES": "Español (Spanish)",
            "fr": "Français (French)",
            "hu": "Magyar (Hungarian)",
            "it": "Italiano (Italian)",
            "ja": "日本語 (Japanese)",
            "ko": "한국어 (Korean)",
            "pl": "Polski (Polish)",
            "pt-BR": "Português, Brasileiro (Portuguese, Brazilian)",
            "pt-PT": "Português (Portuguese)",
            "ru": "Русский (Russian)",
            "sv-SE": "svenska (Swedish)",
            "tr": "Türkçe (Turkish)",
            "uk": "Українська (Ukranian)",
            "vi": "Tiếng Việt (Vietnamese)",
            "zh-CN": "简体中文 (Chinese Simplified)",
            "zh-TW": "繁體中文 (Chinese Traditional)",
        };
        // sort languages by name
        languageTitles = Object.fromEntries(Object.entries(languageTitles).sort((a, b) => a[1].localeCompare(b[1])));

        // use this to allow translations to work on PR preview builds
        let currentBaseUrl = globalThis.location.origin;

        // Initialize Crowdin translator
        const whitespaceBoundaries = _captureCrowdinWhitespaceBoundaries();

        globalThis.proxyTranslator.init({
            baseUrl: currentBaseUrl,
            callback: _createCrowdinTranslationCallback(whitespaceBoundaries),
            distribution: projectSettings[project].distribution,
            defaultLanguage: "en",
            languageTitles: languageTitles,
            showDefaultLanguageInUrl: false,
            languageRoutingMethod: "query",
            position: "bottom-left",
            submenuPosition: "top-left",
            poweredBy: false,
        });

        // Apply styling based on UI framework
        if (platform === null) {
            return;
        }

        _applyCrowdinPlatformStyling(platform);
    });
}

// Expose to the global scope
if (globalThis.window !== undefined) {
    globalThis.initCrowdIn = initCrowdIn;
}

module.exports = initCrowdIn;
