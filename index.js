// index.js handles requests to server, responding with correct summary

// express for routing
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var Promise = require('bluebird');
var config = require('./db');
var utils = require('./utils');

// var url;
// start server and deal with incoming requests
app.get('/', function(req, res) {
	res.status(200).send('how are you today?');
});

app.get('/*', function(req, res) {
	// console.log('the url is', req.url);
	storyId = req.url.replace('/', '');
	return config.Post.find({id: storyId})

	.then( (data) => {
		if (data.length > 0) {
			// console.log('and the first summ is', data[0].summary);
			res.status(200).send(data[0].summary);
			// config.db.close();
			return 'first success';
		} else {
			return utils.getSummary(Number(storyId))
			
			.then( (postObj)=> {
				var newPost = config.Post(postObj);
				return newPost.save();
			})

			.then((dbPost)=> {
				// console.log('and the second summ is', dbPost.summary);
				res.status(200).send(dbPost.summary);
				// config.db.close();
				return 'second success';
			})

			.catch( (err) => {
				console.log('error adding new item', err);
			});
		}
	})

	// .then( (successMsg) => {
	// 	// console.log('sucMsg: ', successMsg);
	// })

	.catch( (err) => {
		console.log('post already exists', err);
		res.status(404).send('sad');
	});
});


app.listen(app.get('port'), function(){
	console.log('listening on port', app.get('port'));
});

