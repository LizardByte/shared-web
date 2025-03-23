/**
 * Format a number to a human-readable string.
 * @param {number} num The number to format.
 * @param {number} decimalPlaces The number of decimal places to include in the formatted string.
 * @returns {string} The formatted number as a string with suffix (k, M, etc.).
 */
function formatNumber(num, decimalPlaces = 1) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimalPlaces) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimalPlaces) + 'k';
    } else {
        return num.toString()
    }
}

// Expose to the global scope
if (typeof window !== 'undefined') {
    window.formatNumber = formatNumber;
}

module.exports = formatNumber;
