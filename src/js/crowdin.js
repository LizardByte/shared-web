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
 * Initializes Crowdin translation widget based on project and UI platform.
 * @param {string} project - Project name ('LizardByte' or 'LizardByte-docs').
 * @param {string|null} platform - UI platform ('sphinx', or null).
 */
function initCrowdIn(project = 'LizardByte', platform = null) {
    // Input validation
    if (!['LizardByte', 'LizardByte-docs'].includes(project)) {
        console.error('Invalid project. Must be "LizardByte" or "LizardByte-docs"');
        return;
    }
    if (!['sphinx', null].includes(platform)) {
        console.error('Invalid UI. Must be "sphinx", or null');
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
        globalThis.proxyTranslator.init({
            baseUrl: currentBaseUrl,
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

        const container = document.getElementById('crowdin-language-picker');
        const button = document.getElementsByClassName('cr-picker-button')[0];

        if (platform === 'sphinx') {
            container.classList.remove('cr-position-bottom-left')
            container.style.width = button.offsetWidth + 10 + 'px';
            container.style.position = 'relative';
            container.style.left = '10px';
            container.style.bottom = '10px';

            // get rst versions
            const sidebar = document.getElementsByClassName('sidebar-sticky')[0];

            // move button to related pages
            sidebar.appendChild(container);
        }
    });
}

// Expose to the global scope
if (typeof globalThis !== 'undefined' && globalThis.window !== undefined) {
    globalThis.initCrowdIn = initCrowdIn;
}

module.exports = initCrowdIn;
