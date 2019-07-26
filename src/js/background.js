import '../img/kimai-logo.png'

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});