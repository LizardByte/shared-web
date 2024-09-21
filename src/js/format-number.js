/**
 * Format a number to a human-readable string
 * @param num The number to format
 * @param decimalPlaces The number of decimal places to include in the formatted string
 * @returns {string}
 */
function formatNumber(num, decimalPlaces = 1) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimalPlaces) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimalPlaces) + 'k';
    } else {
        return num.toFixed(decimalPlaces);
    }
}

// Expose to the global scope
if (typeof window !== 'undefined') {
    window.formatNumber = formatNumber;
}

module.exports = formatNumber;
