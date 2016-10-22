var utils = require('./utils');

var mongoose = require('mongoose');
var dbController = require('./db.js');
var connectingPort = process.env.MONGODB_URI || 'mongodb://localhost/test';

mongoose.connection.on('open', function() {
	console.log('mongoose opened');
});

mongoose.connection.on('disconnected', function() {
	console.log('mongoose disconnected');
});

mongoose.connect(connectingPort, function(err) {
	if (err) {
		console.log('error connecting', err);
	}
});

// test that actually being created
// dbController.Post.find({title: "Introducing Internatioalized Domain Name (IDN) Support"})
// 	.then( (story) => {
// 		console.log('story is', story);
// 		mongoose.disconnect();
// 	})
// 	.catch( (err) => {
// 		console.log('err getting story', err);
// 	});


// test that utils works
utils.getAll(0, 50)
.then((successMsg) => {
	console.log('got all items');
	mongoose.disconnect();
})
.catch((err) => {
	console.log('there is an err', err);
});