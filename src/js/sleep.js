/**
 * Sleep for a given amount of time.
 * @param ms The time to sleep in milliseconds
 * @returns {Promise<unknown>} A promise that resolves after the given time
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Expose to the global scope
if (typeof window !== 'undefined') {
    window.sleep = sleep;
}

module.exports = sleep;
