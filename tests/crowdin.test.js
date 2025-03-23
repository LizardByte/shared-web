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
        global.document.body.innerHTML = `
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
        global.window.proxyTranslator = {
            init: jest.fn()
        };

        // Use fake timers to control setTimeout
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        delete global.window.proxyTranslator;
    });

    it('should validate project parameter', () => {
        initCrowdIn('InvalidProject');
        expect(console.error).toHaveBeenCalledWith('Invalid project. Must be "LizardByte" or "LizardByte-docs"');
    });

    it('should validate platform parameter', () => {
        initCrowdIn('LizardByte', 'invalidPlatform');
        expect(console.error).toHaveBeenCalledWith('Invalid UI. Must be "bootstrap", "sphinx", or null');
    });

    it('should initialize proxyTranslator with LizardByte settings', () => {
        initCrowdIn();

        // Simulate script loading
        jest.runAllTimers();

        expect(window.proxyTranslator.init).toHaveBeenCalledWith(
            expect.objectContaining({
                baseUrl: "https://app.lizardbyte.dev",
                distribution: "0913bb75b61f0b26247ffa91bw4",
                defaultLanguage: "en"
            })
        );
    });

    it('should initialize proxyTranslator with LizardByte-docs settings', () => {
        initCrowdIn('LizardByte-docs');

        // Simulate script loading
        jest.runAllTimers();

        expect(window.proxyTranslator.init).toHaveBeenCalledWith(
            expect.objectContaining({
                baseUrl: "https://docs.lizardbyte.dev",
                distribution: "fb3b3d5c18de9bc717d96b91bw4",
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

    it('should apply bootstrap styling', () => {
        initCrowdIn('LizardByte', 'bootstrap');

        // Simulate script loading and UI styling timeout
        jest.runAllTimers();

        const button = document.getElementsByClassName('cr-picker-button')[0];
        const menu = document.getElementsByClassName('cr-picker-submenu')[0];
        const selected = document.getElementsByClassName('cr-selected')[0];

        expect(button.classList.contains('btn')).toBe(true);
        expect(button.classList.contains('btn-outline-light')).toBe(true);
        expect(menu.classList.contains('bg-dark')).toBe(true);
        expect(selected.classList.contains('text-white')).toBe(true);
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
