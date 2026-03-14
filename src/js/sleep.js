/**
 * Sleep for a given amount of time.
 * @param {number} ms The time to sleep in milliseconds.
 * @returns {Promise<unknown>} A promise that resolves after the given time.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Expose to the global scope
if (globalThis.window !== undefined) {
    globalThis.sleep = sleep;
}

module.exports = sleep;
