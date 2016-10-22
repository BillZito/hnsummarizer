// console.log('something please');
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.update(activeTab.id, {url: 'http://news.ycombinator.com/'});
  });
});

// if we want to send message to content.js
// chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"}, function(response) { 