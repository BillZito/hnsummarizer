//content.js -- chrome extension

// if we want todo something with message from background
var shown = true;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      // console.log('ready to hide!');
      // console.log('allelem is', allElem);
      $('.mything').toggle();
      $('.myspacer').toggle();
    }
  }
);

$('.athing').each(function(i, item){
	var id = item.id;
	if (i === 0) {
		$('#' + id).before('<div id="load"><p>Summaries loading</p></div>');
	}

	$.ajax({
			url: "https://murmuring-citadel-29703.herokuapp.com/" + id,
			type: "GET", 
			contentType: "application/json",
			success: function(summary) {
				var content = '<tr class="myspacer" style="height:5px"></tr><tr><td colspan="2"></td><td class="mything">' + summary + '</td></tr><tr class="myspacer" style="height:5px"></tr>';
				$('#' + id).after(content);
				// console.log(id, summary.slice(0, 10));
				if (i > 20) {
					$('#load').hide();
				}
			},
			error: function(err) {
				var content = '<tr class="myspacer" style="height:5px"></tr><tr><td colspan="2"></td><td class="mything">[No preview available]--But you should click the link!</td></tr><tr class="myspacer" style="height:5px"></tr>';
				$('#' + id).after(content);
				if (i > 20) {
					$('#load').hide();
				}
				// console.log(id, summary.slice(0, 10));
				// console.log('found an err', err);
			}
	});

});

