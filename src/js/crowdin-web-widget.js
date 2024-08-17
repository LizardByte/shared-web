const loadScript = require('./load-script');

loadScript('https://crowdin.com/js/crowdjet/crowdjet.js', function() {
    // crowdin web widget: https://crowdin.com/project/lizardbyte/tools/web-widget
    // get body
    let body = document.getElementsByTagName('body')[0]

    // create container (popup)
    let container = document.createElement('div')
    container.id = 'crowdjet-container'
    container.dataset.projectId = '606145'
    container.style.bottom = '90px'
    container.style.left = '5px'
    body.appendChild(container)

    // create expand container (button)
    let expandContainer = document.createElement('div')
    expandContainer.id = 'crowdjet-expand-container'
    expandContainer.style.bottom = '0px'
    expandContainer.style.left = '120px'
    body.appendChild(expandContainer)
});
