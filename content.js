//content.js

$('.athing').each(function(i, item){
	$.ajax({
			url: "https://murmuring-citadel-29703.herokuapp.com/",
			type: "GET", 
			contentType: "application/json",
			success: function(data) {
				// console.log('made a call');
				var summary = data;
				// console.log(summary);
				var test = '<tr class="subtext"><td colspan="2"></td><td>' + summary + '</td></tr>';
				$('.itemList > tbody > tr').eq(i*4).after(test);
				console.log(i, 'success');
			},
			error: function(err) {
				console.log('found an err', err);
			}
	});
	
});
