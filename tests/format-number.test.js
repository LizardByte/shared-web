import {
    describe,
    expect,
    test,
} from '@jest/globals';

const formatNumber = require('../src/js/format-number');

describe('formatNumber function', () => {
    test.each([
        [1234567, 1, '1.2M'],  // 1.2 million
        [1234567, 2, '1.23M'],  // 1.23 million
        [1234, 1, '1.2k'],  // 1.2 thousand
        [1234, 2, '1.23k'],  // 1.23 thousand
        [123, 1, '123.0'],  // 123 with 1 decimal place
        [123, 2, '123.00'],  // 123 with 2 decimal places
    ])('formats %i with %i decimal places as %s', (num, decimalPlaces, expected) => {
        expect(formatNumber(num, decimalPlaces)).toBe(expected);
    });

    test('defaults to 1 decimal place if not provided', () => {
        expect(formatNumber(1234567)).toBe('1.2M');
        expect(formatNumber(1234)).toBe('1.2k');
        expect(formatNumber(123)).toBe('123.0');
    });
});
