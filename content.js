//content.js
// var $ = require('jquery');

// $.ajax({
// 			url: "https://hacker-news.firebaseio.com/v0/item/11118900.json",
// 			type: "GET", 
// 			contentType: "application/json",
// 			success: function(data) {
// 				console.log('made a call');
// 				console.log('data', data);
// 			},
// 			error: function(err) {
// 				console.log('found an err', err);
// 			}
// });

$('.athing').each(function(i, item){
		var test = '<tr><td><a href="#" class="storylink"> hello world </a></td></tr>';
		$('.itemList > tbody > tr').eq(i*4).after(test);
		console.log(i, 'success');
});
