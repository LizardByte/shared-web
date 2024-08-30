import {
    describe,
    expect,
    it,
} from '@jest/globals';

const rankingSorter = require('../src/js/ranking-sorter');

describe('rankingSorter', () => {
  const testCases = [
    {
      description: 'should sort by firstKey descending and secondKey ascending',
      data: [
        { key1: 1, key2: 2 },
        { key1: 2, key2: 1 },
        { key1: 1, key2: 1 }
      ],
      expected: [
        { key1: 2, key2: 1 },
        { key1: 1, key2: 1 },
        { key1: 1, key2: 2 }
      ]
    },
    {
      description: 'should return 1 when firstKey values are equal and secondKey of first object is greater',
      data: [
        { key1: 1, key2: 2 },
        { key1: 1, key2: 1 }
      ],
      expected: 1,
      compare: true
    },
    {
      description: 'should return 0 when both firstKey and secondKey values are equal',
      data: [
        { key1: 1, key2: 1 },
        { key1: 1, key2: 1 }
      ],
      expected: 0,
      compare: true
    }
  ];

  testCases.forEach(({ description, data, expected, compare }) => {
    it(description, () => {
      if (compare) {
        const result = rankingSorter('key1', 'key2')(data[0], data[1]);
        expect(result).toBe(expected);
      } else {
        const sorted = data.sort(rankingSorter('key1', 'key2'));
        expect(sorted).toEqual(expected);
      }
    });
  });
});
