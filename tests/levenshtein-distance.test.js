import {
    describe,
    expect,
    test,
} from '@jest/globals';

const levenshteinDistance = require('../src/js/levenshtein-distance');

describe('levenshteinDistance', () => {
  const testCases = [
    { a: 'test', b: 'test', expected: 100 },
    { a: 'abc', b: 'xyz', expected: 0 },
    { a: 'kitten', b: 'sitting', expected: 57.14 },
    { a: 'flaw', b: 'lawn', expected: 50 },
    { a: '', b: 'nonempty', expected: 8 },
    { a: 'nonempty', b: '', expected: 8 }
  ];

  test.each(testCases)(
    'should return $expected when comparing "$a" and "$b"',
    ({ a, b, expected }) => {
      const result = levenshteinDistance(a, b);
      expect(result).toBeCloseTo(expected, 2);
    }
  );
});
