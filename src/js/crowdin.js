const loadScript = require('./load-script');

/**
 * Initializes Crowdin translation widget based on project and UI platform.
 * @param {string} project - Project name ('LizardByte' or 'LizardByte-docs').
 * @param {string|null} platform - UI platform ('sphinx', or null).
 */
function initCrowdIn(project = 'LizardByte', platform = null) {
    // Input validation
    if (!['LizardByte', 'LizardByte-docs'].includes(project)) {
        console.error('Invalid project. Must be "LizardByte" or "LizardByte-docs"');
        return;
    }
    if (!['sphinx', null].includes(platform)) {
        console.error('Invalid UI. Must be "sphinx", or null');
        return;
    }

    loadScript('https://proxy-translator.app.crowdin.net/assets/proxy-translator.js', function() {
        // Configure base settings based on project
        const projectSettings = {
            'LizardByte': {
                baseUrl: "https://app.lizardbyte.dev",
                valuesParams: "U2FsdGVkX193b3LJT2/HWNIVSb3D61klmnbJ+dvGjoY2XSu35S3gL3FRLBfiXVk4nRsFlfzaC0R7JrklvnS7Xqz5im/VrO+sGzo3LbebxNIMp8LZe28udpnJcA2I2u8B",
                filePath: "/app.lizardbyte.dev.json",
                distribution: "0913bb75b61f0b26247ffa91bw4",
            },
            'LizardByte-docs': {
                baseUrl: "https://docs.lizardbyte.dev",
                valuesParams: "U2FsdGVkX19eQczbrFgaLYbrEBP8is5CVpC2YSnXxH/sRjWqaBtQOsLZJbSRMepcn3D2sofzZxALb2pvT3MLmM+WG5EpWSF7CzzYsAOJ+k/FpMUJ1PZ1FQmmlKCIWyD7",
                filePath: "/docs.lizardbyte.dev.json",
                distribution: "fb3b3d5c18de9bc717d96b91bw4",
            }
        };

        let languagesData = {
            "bg":{"code":"bg","name":"Bulgarian","twoLettersCode":"bg"},
            "de":{"code":"de","name":"German","twoLettersCode":"de"},
            "en":{"code":"en","name":"English","twoLettersCode":"en"},
            "en-GB":{"code":"en-GB","name":"English, United Kingdom","twoLettersCode":"en"},
            "en-US":{"code":"en-US","name":"English, United States","twoLettersCode":"en"},
            "es-ES":{"code":"es-ES","name":"Spanish","twoLettersCode":"es"},
            "fr":{"code":"fr","name":"French","twoLettersCode":"fr"},
            "it":{"code":"it","name":"Italian","twoLettersCode":"it"},
            "ja":{"code":"ja","name":"Japanese","twoLettersCode":"ja"},
            "ko":{"code":"ko","name":"Korean","twoLettersCode":"ko"},
            "pl":{"code":"pl","name":"Polish","twoLettersCode":"pl"},
            "pt-BR":{"code":"pt-BR","name":"Portuguese, Brazilian","twoLettersCode":"pt"},
            "pt-PT":{"code":"pt-PT","name":"Portuguese","twoLettersCode":"pt"},
            "ru":{"code":"ru","name":"Russian","twoLettersCode":"ru"},
            "sv-SE":{"code":"sv-SE","name":"Swedish","twoLettersCode":"sv"},
            "tr":{"code":"tr","name":"Turkish","twoLettersCode":"tr"},
            "uk":{"code":"uk","name":"Ukrainian","twoLettersCode":"uk"},
            "zh-CN":{"code":"zh-CN","name":"Chinese Simplified","twoLettersCode":"zh"},
            "zh-TW":{"code":"zh-TW","name":"Chinese Traditional","twoLettersCode":"zh"},
        };
        // sort languages by name
        languagesData = Object.fromEntries(Object.entries(languagesData).sort((a, b) => a[1].name.localeCompare(b[1].name)));

        // Initialize Crowdin translator
        window.proxyTranslator.init({
            baseUrl: projectSettings[project].baseUrl,
            appUrl: "https://proxy-translator.app.crowdin.net",
            valuesParams: projectSettings[project].valuesParams,
            distributionBaseUrl: "https://distributions.crowdin.net",
            filePath: projectSettings[project].filePath,
            distribution: projectSettings[project].distribution,
            distributionSeparateFiles: undefined,
            languagesData: languagesData,
            defaultLanguage: "en",
            defaultLanguageTitle: "English",
            languageDetectType: "default",
            poweredBy: false,
            position: "bottom-left",
            submenuPosition: "top-left",
        });

        // Apply styling based on UI framework
        if (platform === null) {
            return;
        }

        const container = document.getElementById('crowdin-language-picker');
        const button = document.getElementsByClassName('cr-picker-button')[0];

        if (platform === 'sphinx') {
            container.classList.remove('cr-position-bottom-left')
            container.style.width = button.offsetWidth + 10 + 'px';
            container.style.position = 'relative';
            container.style.left = '10px';
            container.style.bottom = '10px';

            // get rst versions
            const sidebar = document.getElementsByClassName('sidebar-sticky')[0];

            // move button to related pages
            sidebar.appendChild(container);
        }
    });
}

// Expose to the global scope
if (typeof window !== 'undefined') {
    window.initCrowdIn = initCrowdIn;
}

module.exports = initCrowdIn;
