//content.js -- chrome extension

$('.athing').each(function(i, item){
	var id = item.id;
	$.ajax({
			url: "https://murmuring-citadel-29703.herokuapp.com/" + id,
			type: "GET", 
			contentType: "application/json",
			success: function(summary) {
				// console.log('made a call');
				// console.log(summary);
				var content = '<tr class="subtext"><td colspan="2"></td><td>' + summary + '</td></tr>';
				$('#' + id).after(content);
				console.log(i, 'success');
			},
			error: function(err) {
				console.log('found an err', err);
			}
	});
	
});
