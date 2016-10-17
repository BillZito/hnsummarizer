// called when the chrome tab is clicked
/*
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var activeTab = tabs[0];
		//sends message to current tab
		chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
	});
});
*/