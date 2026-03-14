import {
    describe,
    expect,
    it,
    jest,
    beforeEach,
    afterEach
} from '@jest/globals';

// We need to mock the module BEFORE importing the module that uses it
jest.mock('../src/js/load-script', () => {
    return function(url, callback) {
        if (callback) setTimeout(callback, 0);
        return true;
    };
});

const initCrowdIn = require('../src/js/crowdin');

describe('initCrowdIn', () => {
    beforeEach(() => {
        // Mock DOM elements
        globalThis.document.body.innerHTML = `
            <div id="crowdin-language-picker">
                <div class="cr-picker-button"></div>
                <div class="cr-picker-submenu"></div>
                <div class="cr-selected"></div>
            </div>

            <!-- Sphinx sidebar -->
            <div class="sidebar-sticky"></div>
        `;

        // Mock console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Mock window.proxyTranslator
        globalThis.window.proxyTranslator = {
            init: jest.fn()
        };

        // Use fake timers to control setTimeout
        jest.useFakeTimers();

        // Reset fetch interceptor flag so each test starts clean
        delete globalThis._crowdinMirrorInstalled;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        delete globalThis.window.proxyTranslator;
        delete globalThis._crowdinMirrorInstalled;
    });

    it('should validate project parameter', () => {
        initCrowdIn('InvalidProject');
        expect(console.error).toHaveBeenCalledWith('Invalid project. Must be "LizardByte" or "LizardByte-docs"');
    });

    it('should validate platform parameter', () => {
        initCrowdIn('LizardByte', 'invalidPlatform');
        expect(console.error).toHaveBeenCalledWith('Invalid UI. Must be "sphinx", or null');
    });

    it('should initialize proxyTranslator with LizardByte settings', () => {
        initCrowdIn();

        // Simulate script loading
        jest.runAllTimers();

        expect(globalThis.proxyTranslator.init).toHaveBeenCalledWith(
            expect.objectContaining({
                baseUrl: "http://localhost",
                distribution: "458f881791aebba1d4dde491bw4",
                defaultLanguage: "en"
            })
        );
    });

    it('should initialize proxyTranslator with LizardByte-docs settings', () => {
        initCrowdIn('LizardByte-docs');

        // Simulate script loading
        jest.runAllTimers();

        expect(globalThis.proxyTranslator.init).toHaveBeenCalledWith(
            expect.objectContaining({
                baseUrl: "http://localhost",
                distribution: "d6c830ba4b41106fefe5d391bw4",
                defaultLanguage: "en"
            })
        );
    });

    it('should not apply styling when platform is null', () => {
        initCrowdIn('LizardByte', null);

        // Simulate script loading and run the setTimeout from UI styling
        jest.runAllTimers();

        // Verify that no styling was applied
        const button = document.getElementsByClassName('cr-picker-button')[0];
        expect(button.classList.contains('btn')).toBe(false);
    });

    it('should apply sphinx styling', () => {
        initCrowdIn('LizardByte', 'sphinx');

        // Simulate script loading and UI styling timeout
        jest.runAllTimers();

        const container = document.getElementById('crowdin-language-picker');
        const sidebar = document.getElementsByClassName('sidebar-sticky')[0];

        expect(container.classList.contains('cr-position-bottom-left')).toBe(false);
        expect(container.style.position).toBe('relative');
        expect(sidebar.contains(container)).toBe(true);
    });
});

describe('Crowdin fetch interceptor', () => {
    const CROWDIN_CDN = 'https://distributions.crowdin.net';
    const MIRROR = 'https://cdn.jsdelivr.net/gh/LizardByte/i18n@dist';

    beforeEach(() => {
        // Reset interceptor state so each test gets a fresh install
        delete globalThis._crowdinMirrorInstalled;

        // Install a controllable mock fetch
        globalThis.fetch = jest.fn().mockResolvedValue({ ok: true });

        // Minimal DOM + proxyTranslator stub so initCrowdIn callback doesn't crash
        globalThis.window.proxyTranslator = { init: jest.fn() };
        globalThis.document.body.innerHTML = '';

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        delete globalThis._crowdinMirrorInstalled;
        delete globalThis.window.proxyTranslator;
    });

    it('should redirect Crowdin CDN fetch calls to the GitHub Pages mirror', async () => {
        // Save mock before initCrowdIn wraps globalThis.fetch
        const mockFetch = globalThis.fetch;

        initCrowdIn();
        jest.runAllTimers();

        const testUrl = `${CROWDIN_CDN}/458f881791aebba1d4dde491bw4/manifest.json`;
        await globalThis.fetch(testUrl);

        // The wrapper should have called the underlying mock with the mirrored URL.
        // The interceptor uses URL parsing, so the path is taken from parsed.pathname.
        expect(mockFetch).toHaveBeenCalled();
        const calledUrl = mockFetch.mock.calls[0][0];
        expect(calledUrl).toBe(`${MIRROR}/458f881791aebba1d4dde491bw4/manifest.json`);
    });

    it('should preserve query string when redirecting', async () => {
        const mockFetch = globalThis.fetch;

        initCrowdIn();
        jest.runAllTimers();

        const testUrl = `${CROWDIN_CDN}/458f881791aebba1d4dde491bw4/languages.json?timestamp=1234`;
        await globalThis.fetch(testUrl);

        const calledUrl = mockFetch.mock.calls[0][0];
        expect(calledUrl).toBe(`${MIRROR}/458f881791aebba1d4dde491bw4/languages.json?timestamp=1234`);
    });

    it('should not redirect non-Crowdin fetch calls', async () => {
        const mockFetch = globalThis.fetch;

        initCrowdIn();
        jest.runAllTimers();

        const externalUrl = 'https://example.com/data.json';
        await globalThis.fetch(externalUrl);

        const calledUrl = mockFetch.mock.calls[0][0];
        expect(calledUrl).toBe(externalUrl);
    });

    it('should not redirect a lookalike hostname (incomplete-URL-sanitisation guard)', async () => {
        // A URL whose hostname merely starts with the CDN hostname must NOT be
        // redirected – this is the exact bypass that CodeQL flags when using
        // startsWith() instead of exact hostname comparison.
        const mockFetch = globalThis.fetch;

        initCrowdIn();
        jest.runAllTimers();

        const lookalike = 'https://distributions.crowdin.net.evil.com/steal';
        await globalThis.fetch(lookalike);

        const calledUrl = mockFetch.mock.calls[0][0];
        expect(calledUrl).toBe(lookalike);
    });

    it('should install the interceptor only once (idempotent)', () => {
        initCrowdIn();
        const fetchAfterFirst = globalThis.fetch;
        jest.runAllTimers();

        // Calling initCrowdIn again must NOT wrap fetch a second time
        initCrowdIn();
        jest.runAllTimers();

        expect(globalThis.fetch).toBe(fetchAfterFirst);
    });
});
