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
const CROWDIN_CODE_BLOCK_CLASS = 'crowdin-ignore-code';
const CROWDIN_PLATFORM_STYLING_MAX_ATTEMPTS = 100;
const CROWDIN_PLATFORM_STYLING_RETRY_DELAY_MS = 50;
const CROWDIN_WHITESPACE_POST_PROCESSOR = 'crowdin-preserve-whitespace';
const CROWDIN_WHITESPACE_RENDERERS = new WeakSet();

/**
 * Preserves source whitespace in translation results before i18nextify records
 * or renders them. Its cleanWhitespace handling only recognizes single-line
 * text; multiline missing keys and translations can lose their boundary spaces.
 * @param {*} value Translated value.
 * @param {string|string[]} key Translation lookup keys.
 * @param {Object} options Translation options, including the source defaultValue.
 * @returns {*} Translation with the source's exact boundary whitespace.
 */
function _preserveCrowdinWhitespace(value, key, options) {
    const source = options?.defaultValue;
    if (typeof value !== 'string' || typeof source !== 'string') return value;
    if (source.trim() === '') return source;

    const leadingWhitespace = source.slice(0, source.length - source.trimStart().length);
    const trailingWhitespace = source.slice(source.trimEnd().length);
    return leadingWhitespace + value.trim() + trailingWhitespace;
}

/**
 * Adds a postprocessor to Crowdin's renderer before its initial translation.
 * Keeping i18nextify's cached translation and DOM text identical avoids the
 * mutation-observer loop caused by repairing whitespace after rendering.
 */
function _installCrowdinWhitespacePreserver() {
    const renderer = globalThis.i18nextify;
    if (CROWDIN_WHITESPACE_RENDERERS.has(renderer)) return;

    renderer.i18next.use({
        type: 'postProcessor',
        name: CROWDIN_WHITESPACE_POST_PROCESSOR,
        process: _preserveCrowdinWhitespace,
    });

    const originalInit = renderer.init;
    renderer.init = function(options, ...args) {
        const postProcess = options.postProcess ?? [];
        const rendererOptions = {
            ...options,
            postProcess: [
                ...(Array.isArray(postProcess) ? postProcess : [postProcess]),
                CROWDIN_WHITESPACE_POST_PROCESSOR,
            ],
        };
        // i18next calls this handler after postprocessing a missing key, so
        // preserve the boundaries of fallback and instant translations too.
        if (typeof options.parseMissingKeyHandler === 'function') {
            const originalHandler = options.parseMissingKeyHandler;
            rendererOptions.parseMissingKeyHandler = function(key, defaultValue, translationOptions) {
                const value = originalHandler.call(this, key, defaultValue, translationOptions);
                return _preserveCrowdinWhitespace(value, key, translationOptions);
            };
        }
        return originalInit.call(this, rendererOptions, ...args);
    };
    CROWDIN_WHITESPACE_RENDERERS.add(renderer);
}

/**
 * Keeps preformatted examples out of Crowdin's text-node rewriting. Syntax
 * highlighters can replace their children after translation starts. Leave their
 * markup and whitespace under the highlighter's control.
 */
function _excludeCrowdinCodeBlocks() {
    document.querySelectorAll('pre, .fragment').forEach((block) => {
        block.classList.add(CROWDIN_CODE_BLOCK_CLASS);
        block.setAttribute('translate', 'no');
    });
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
 * @param {string} platform - UI platform ('dockle' or 'jekyll').
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
 * @param {string} platform - UI platform ('dockle' or 'jekyll').
 * @param {number} attempt - Current retry count.
 */
function _applyCrowdinPlatformStyling(platform, attempt = 0) {
    if (platform === 'jekyll') {
        return;
    }

    const container = document.getElementById('crowdin-language-picker');

    if (container === null) {
        _retryCrowdinPlatformStyling(platform, attempt);
        return;
    }

    container.classList.remove('cr-position-bottom-left');
    container.classList.add('dockle-crowdin-picker');
    // Let the Dockle stylesheet control desktop and mobile positioning.
    container.style.removeProperty('position');
    container.style.removeProperty('left');
    container.style.removeProperty('bottom');
    document.body.appendChild(container);
}

/**
 * Initializes Crowdin translation widget based on project and UI platform.
 * @param {string} project - Project name ('LizardByte' or 'LizardByte-docs').
 * @param {string} platform - UI platform ('dockle' or 'jekyll').
 */
function initCrowdIn(project = 'LizardByte', platform = 'jekyll') {
    // Input validation
    if (!['LizardByte', 'LizardByte-docs'].includes(project)) {
        console.error('Invalid project. Must be "LizardByte" or "LizardByte-docs"');
        return;
    }
    if (!['dockle', 'jekyll'].includes(platform)) {
        console.error('Invalid UI. Must be "dockle" or "jekyll"');
        return;
    }

    // Redirect distribution CDN requests to our self-hosted GitHub Pages mirror
    // before the script is even loaded so every fetch() it makes is intercepted.
    _installCrowdinFetchInterceptor();

    function initializeCrowdin(error) {
        if (error) return;

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
        _excludeCrowdinCodeBlocks();
        _installCrowdinWhitespacePreserver();

        globalThis.proxyTranslator.init({
            baseUrl: currentBaseUrl,
            crawlerIgnoreClasses: [CROWDIN_CODE_BLOCK_CLASS],
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
        _applyCrowdinPlatformStyling(platform);
    }

    function loadCrowdinScript() {
        loadScript('https://website-translator.app.crowdin.net/assets/proxy-translator.js', initializeCrowdin);
    }

    // A pending third-party script delays the browser's load event. Let the
    // documentation finish loading before requesting Crowdin.
    if (document.readyState === 'complete') {
        loadCrowdinScript();
    } else {
        globalThis.addEventListener('load', function() {
            globalThis.setTimeout(loadCrowdinScript, 0);
        }, { once: true });
    }
}

// Expose to the global scope
if (globalThis.window !== undefined) {
    globalThis.initCrowdIn = initCrowdIn;
}

module.exports = initCrowdIn;
