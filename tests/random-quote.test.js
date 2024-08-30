import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

const { fetchRandomQuote, resetQuoteCache } = require('../src/js/random-quote');

describe('fetchRandomQuote', () => {
    let originalFetch;

    beforeEach(() => {
        // Save the original fetch function
        originalFetch = globalThis.fetch;
        // Clear the quote cache before each test
        jest.resetModules();
        // Reset the quotesCache
        resetQuoteCache();
    });

    afterEach(() => {
        // Restore the original fetch function
        globalThis.fetch = originalFetch;
    });

    it('should fetch and return a random quote', async () => {
        const mockQuotes = [
            { quote: 'Quote 1' },
            { quote: 'Quote 2' },
            { quote: 'Quote 3' }
        ];

        globalThis.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockQuotes)
            })
        );

        const quote = await fetchRandomQuote();
        expect(mockQuotes).toContainEqual(quote);
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should return a cached quote if already fetched', async () => {
        const mockQuotes = [
            { quote: 'Quote 1' },
            { quote: 'Quote 2' },
            { quote: 'Quote 3' }
        ];

        globalThis.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockQuotes)
            })
        );

        // First call to populate the cache
        await fetchRandomQuote();
        // Second call should use the cache
        const quote = await fetchRandomQuote();

        expect(mockQuotes).toContainEqual(quote);
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors gracefully', async () => {
        globalThis.fetch = jest.fn(() =>
            Promise.reject(new Error('Failed to fetch'))
        );

        await expect(fetchRandomQuote()).rejects.toThrow('Failed to fetch');
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
});
