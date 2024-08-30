let quoteCache = null;

/**
 * Fetch a random quote from our API.
 * @returns {Promise<*>} A promise that resolves with a random quote
 */
async function fetchRandomQuote() {
    if (!quoteCache) {
        const response = await fetch('https://app.lizardbyte.dev/uno/random-quotes/games.json');
        quoteCache = await response.json();
    }
    return quoteCache[Math.floor(Math.random() * quoteCache.length)];
}

/**
 * Reset the quote cache.
 */
function resetQuoteCache() {
    quoteCache = null;
}

module.exports = {
    fetchRandomQuote,
    resetQuoteCache,
};
