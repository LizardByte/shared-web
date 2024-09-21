/**
 * Sorts an array of objects by two keys in descending order.
 * @param firstKey The primary key to sort by.
 * @param secondKey The secondary key to sort by, in case the first key is equal.
 * @returns {(function(*, *): (number))|*} The sorting function.
 */
function rankingSorter(firstKey, secondKey) {
    return function(a, b) {
        if (a[firstKey] > b[firstKey]) {
            return -1;
        } else if (a[firstKey] < b[firstKey]) {
            return 1;
        }
        else {
            if (a[secondKey] > b[secondKey]) {
                return 1;
            } else if (a[secondKey] < b[secondKey]) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}

// Expose to the global scope
if (typeof window !== 'undefined') {
    window.rankingSorter = rankingSorter;
}

module.exports = rankingSorter;
