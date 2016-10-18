//content.js -- chrome extension

$('.athing').each(function(i, item){
	var id = item.id;
	$.ajax({
			url: "https://murmuring-citadel-29703.herokuapp.com/" + id,
			type: "GET", 
			contentType: "application/json",
			success: function(summary) {
				var content = '<tr class="spacer" style="height:5px"></tr><tr><td colspan="2"></td><td class="mything">' + summary + '</td></tr><tr class="spacer" style="height:5px"></tr>';
				$('#' + id).after(content);
				// console.log(i, 'success');
			},
			error: function(err) {
				console.log('found an err', err);
			}
	});
	
});
