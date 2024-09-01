/* global Crate */
// Crate is not defined... can we use npm version?
// https://github.com/widgetbot-io/crate/issues/26

const loadScript = require('./load-script');
const { fetchRandomQuote } = require('./random-quote');

function randomQuote(quote, crate) {
    let the_quote = quote['quote_safe'] || quote['quote'];
    crate.notify(the_quote);
}

function initDiscord() {
    loadScript('https://cdn.jsdelivr.net/npm/@widgetbot/crate@3', function() {
        let widgetbot = new Crate({
            server: '804382334370578482',
            channel: '804383092822900797',
            defer: false,
        });

        // get random video game quotes and notify the user on Widgetbot after 7 minutes
        fetchRandomQuote().then(quote => {
            setTimeout(() => {
                if (widgetbot) {
                    randomQuote(quote, widgetbot);
                }
            }, 7 * 60 * 1000);
        });
    });
}

module.exports = {
    initDiscord,
    randomQuote,
};
