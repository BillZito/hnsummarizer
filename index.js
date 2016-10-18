// express for routing
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var Promise = require('bluebird');
var config = require('./db');
var utils = require('./utils');

// var url;
// start server and deal with incoming requests
app.get('/*', function(req, res){
	storyId = req.url.replace('/', '');
	return config.Post.find({id: storyId})

	.then( (data) => {
		if (data.length > 0) {
			// console.log('and the summ is', data[0].summary);
			res.status(200).send(data[0]);
			config.db.close();
			return 'first success';
		} else {
			return utils.getSummary(Number(storyId))
			.then( (postObj)=> {
				var newPost = config.Post(postObj);
				return newPost.save();
			})

			.then((dbPost)=> {
				// console.log('hopefully post made', dbPost);
				res.status(200).send(dbPost.summary);
				config.db.close();
				return 'second success';
			})
		}
	})

	.then( (successMsg) => {
		console.log('sucMsg: ', successMsg);
	})

	.catch( (err) => {
		console.log('post already exists', err);
		res.status(404).send('sad');
	});
});


app.listen(app.get('port'), function(){
	console.log('listening on port', app.get('port'));
});

