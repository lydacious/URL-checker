"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    let timeout = null;
    urlInput.addEventListener('input', () => {
        const url = urlInput.value;
        // Immediately check validty
        if (isValidURL(url)) {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            // Throttle the server check
            timeout = window.setTimeout(() => {
                checkURLExistence(url, resultDiv, urlInput);
            }, 500);
        }
        else {
            resultDiv.textContent = 'Invalid URL format';
        }
    });
});
// URL validation regex
const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i');
function isValidURL(url) {
    return urlPattern.test(url);
}
// Fake request
function checkURLExistence(url, div, input) {
    const currentUrl = url;
    fakeServerRequest(url)
        .then((response) => {
        if (input.value === currentUrl) { // This makes sure that the result belongs to the latest input
            if (response.exists) {
                div.textContent = `URL exists and it is a ${response.type}`;
            }
            else {
                div.textContent = 'URL does not exist';
            }
        }
    })
        .catch(error => {
        div.textContent = 'Error checking URL';
        console.error('Error:', error);
    });
}
// Randomly determines if the URL exists and what type it is
function fakeServerRequest(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const exists = Math.random() > 0.5;
            const type = exists ? (Math.random() > 0.5 ? 'file' : 'folder') : null;
            resolve({
                exists,
                type
            });
        }, 1000);
    });
}
