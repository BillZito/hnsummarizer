//content.js -- chrome extension

// if we want todo something with message from background
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if( request.message === "clicked_browser_action" ) {
//       sendResponse();
//     }
//   }
// );

$('.athing').each(function(i, item){
	var id = item.id;
	$.ajax({
			url: "https://murmuring-citadel-29703.herokuapp.com/" + id,
			type: "GET", 
			contentType: "application/json",
			success: function(summary) {
				var content = '<tr class="spacer" style="height:5px"></tr><tr><td colspan="2"></td><td class="mything">' + summary + '</td></tr><tr class="spacer" style="height:5px"></tr>';
				$('#' + id).after(content);
				// console.log(id, summary.slice(0, 10));
			},
			error: function(err) {
				var content = '<tr class="spacer" style="height:5px"></tr><tr><td colspan="2"></td><td class="mything">[No preview available]--But you should click the link!</td></tr><tr class="spacer" style="height:5px"></tr>';
				$('#' + id).after(content);
				// console.log(id, summary.slice(0, 10));
				// console.log('found an err', err);
			}
	});
	
});
