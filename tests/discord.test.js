import {
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

const { initDiscord, randomQuote } = require('../src/js/discord');
const loadScript = require('../src/js/load-script');
const { fetchRandomQuote } = require('../src/js/random-quote');

jest.mock('../src/js/load-script');
jest.mock('../src/js/random-quote');

describe('initDiscord', () => {
    it('should load the script and get a random quote', () => {
        jest.useFakeTimers();
        const mockCrate = {
            notify: jest.fn()
        };
        global.Crate = jest.fn(() => mockCrate);

        loadScript.mockImplementation((url, callback) => {
            callback();
        });

        fetchRandomQuote.mockResolvedValue({
            quote: 'Test quote',
            quote_safe: 'Test quote safe'
        });

        initDiscord();

        expect(global.Crate).toHaveBeenCalledWith({
            server: '804382334370578482',
            channel: '804383092822900797',
            defer: false,
        });

        // advance timers
        jest.advanceTimersByTime(7 * 60 * 1000);

        expect(fetchRandomQuote).toHaveBeenCalled();
    });
});

describe('randomQuote', () => {
    it('should notify the user with the quote', () => {
        const mockCrate = {
            notify: jest.fn()
        };

        randomQuote({quote_safe: 'Test quote'}, mockCrate);
        expect(mockCrate.notify).toHaveBeenCalledWith('Test quote');
    });
});
