// start db and define schema
// currently allow duplicate ids, should fix that

// mongodb and mongoose orm
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, function(err) {
	if (err) {
		console.log('error connecting', err);
	}
});

var db = mongoose.connection;
// db.dropDatabase();

var Schema = mongoose.Schema;

var postSchema = new Schema({
	id: {type: Number, unique: true, index: true, dropDups: true},
	url: String,
	title: String,
	by: String,
	time: Number,
	summary: String
});

exports.Post = mongoose.model('Post', postSchema);
// different format for error reporting in mongoose
// db.on('error', console.error.bind(console, 'connection error:'));

// // var Post;

// db.once('open', function() {
// 	console.log('test succeeded');

	// var nextItem = new Post({id: 3, url: '3', title: '4', by: '5', time: 6});
	// nextItem.save(nextItem, function(err, item) {
	// 	if (err) {
	// 		console.log('error adding', err);
	// 	} else {
	// 		console.log('success', item);
	// 	}
	// });

	// var secondItem = new Post({id: 3, url: '4', title: '5', by: '6', time: 7});
	
	// secondItem.save(secondItem, function(err, item) {
	// 	if (err) {
	// 		console.log('error adding', err);
	// 	} else {
	// 		console.log('success', item);
	// 		Post.find({id: 2}, function(err, posts){
	// 			if (err) {
	// 				console.log('error searching', err);
	// 			} else {
	// 				console.log('posts', posts);
	// 			}
	// 		});
	// 	}
	// });

	
// });

exports.db = db;
// console.log(exports);