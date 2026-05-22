/**
 * @jest-environment node
 */

import {
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

const exposedModules = [
    ['formatNumber', '../src/js/format-number'],
    ['initCrowdIn', '../src/js/crowdin'],
    ['levenshteinDistance', '../src/js/levenshtein-distance'],
    ['loadScript', '../src/js/load-script'],
    ['rankingSorter', '../src/js/ranking-sorter'],
    ['sleep', '../src/js/sleep'],
];

describe('global browser exposure', () => {
    it.each(exposedModules)('should not expose %s when window is unavailable', (globalName, modulePath) => {
        jest.resetModules();

        const moduleExport = require(modulePath);

        expect(globalThis.window).toBeUndefined();
        expect(moduleExport).toBeDefined();
        expect(globalThis[globalName]).toBeUndefined();
    });
});
