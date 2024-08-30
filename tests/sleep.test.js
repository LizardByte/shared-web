import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';

const sleep = require('../src/js/sleep');

describe('sleep function', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    })

    beforeEach(() => {
        jest.spyOn(global, 'setTimeout');
    });

    test.each([
        [500],  // 0.5 second
        [1000], // 1 second
        [1500], // 1.5 seconds
        [2000], // 2 seconds
        [60000], // 60 seconds
    ])('resolves after %i milliseconds', async (delay) => {
        let delay_value = delay[0];
        const sleepPromise = sleep(delay_value);
        jest.advanceTimersByTime(delay_value);
        await sleepPromise;

        // Allow a small margin of error for the timer
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delay_value);
    });

    afterAll(() => {
        jest.useRealTimers();
    });
});
