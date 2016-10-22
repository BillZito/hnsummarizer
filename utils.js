// utils handles the summarization process by requesting urls from 
// firebase api and summarizing via an npm module

//request for getting posts, summary for summarizing
var Summary = require('node-tldr');
var request = require('request');
var rp = require('request-promise');
var Promise = require('bluebird');

// var mongoose = require('mongoose');
var dbController = require('./db.js');
// var connectingPort = process.env.MONGODB_URI || 'mongodb://localhost/test';

// mongoose.connection.on('open', function() {
// 	console.log('mongoose opened');
// });

// mongoose.connection.on('disconnected', function() {
// 	console.log('mongoose disconnected');
// });

// mongoose.connect(connectingPort, function(err) {
// 	if (err) {
// 		console.log('error connecting', err);
// 	}
// });

//fs write to files, cheerio parse html content 
var fs = Promise.promisifyAll(require('file-system'));
var cheerio = require('cheerio');

var topList = [];

/*
getTopList calls HR api to get the list of the top posts
*/
exports.getTopList = function() {
		return rp('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')

		.then( (body) => {
			topList = JSON.parse(body);
			return topList;
		})

		.catch( (err) => {
			console.log('error getting top', err);
		});
};

/*
getOne gets the story by id and returns an object with the title, url, by, id, and time
*/
exports.getOne = function(id) {

	return rp('https://hacker-news.firebaseio.com/v0/item/' + id + '.json')

	.then( (html) => {
		var text = JSON.parse(html);
		// console.log('html', html);
		var storyObj = {title: text.title, url: text.url, by: text.by, id: text.id, time: text.time};
		return storyObj;
	})

	.catch( (err) => {
		console.log('err requesting', err);
	});
};


/*
getAll first gets the top list, then it iterates through the top 100,
saving them to db if they aren't already there 
and getting summaries of each so that users will have preloaded summaries
*/

exports.getAll = function(start, end) {
	
	return exports.getTopList()

	.then(function(topItems) {
		return exports.getAllList(topItems, start, end);
	})

	.then(function(msg){
		console.log('successfully ended', msg);
		return "created new items";
		// mongoose.disconnect();
	})

	.catch(function(err) {
		console.log('error getting All', err);
	});
};

// exports.getAll(5, 8);
/*
getAllList needs to be refactored to iterate through id's, not numbers in file

getAllList recursively calls getOne once the previous async call
has been called, to retrieve the urls from all the top posts
*/
exports.getAllList = function(topItems, curr, end) {
	if (curr === end) {
		return 'successfully got all messages';
	} else {
		return exports.getOne(topItems[curr])

		.then((currStory) => {
			console.log('got one story', currStory.title);
			return exports.parseText(currStory);
		})
		.then((fullStory) => {
			// console.log('summary created', fullStory.summary);
			return dbController.Post.create(fullStory);
		})
		.then((storyMade) => {
			console.log('successfully created', storyMade.title);
			return exports.getAllList(topItems, curr + 1, end);
		})

		.catch( (err) => {
			console.log('failed to get a message', err);
			return exports.getAllList(topItems, curr + 1, end);
		});
	}
};

/*
summPromise: Use node-tldr summarizer to scrape/summarizer the content of webpages
*/
exports.summPromise = function(url) {
	// console.log('summpromise called');
	return new Promise( (resolve, reject) => {
		Summary.summarize(url, function(res, err) {
			if (err) {
				console.log('error getting the url', err);
				reject(err);
			} else {
				// console.log('successfully got the url', res);
				resolve(res);
			}
		});
	});
};


/*
parseText: Given object without summary, summarize its contents and return object with summary
*/
exports.parseText = function(storyObj) {
	// var summ = "";
	return exports.summPromise(storyObj.url)

	.then((result) => {
		// console.log('returned a result from summary module', result.summary);
		var summ = result.summary.join(' ');

		if (!(summ.length > 20)) {
			summ = "[No preview available]--But you should click the link!";
		}

		if (summ.length > 290) {
			summ = summ.slice(0, 291) + "...";
		}

		storyObj.summary = summ;
		// console.log('summary is', storyObj.summary);
		return storyObj;
	})

	.catch( (err) => {
		console.log('err parsing', err);
		storyObj.summary = "[No preview available]--But you should click the link!";
		return storyObj;
	});
};

/*
parseAll needs to be refactored to iterate through story objects

parseAll goes from lower (incl.) to higher range (excl), recursively parsing the 
next file once the previous one returns
*/
// exports.parseAll = function(curr, end) {
// 	if (curr === end) {
// 		console.log('found the end');
// 		return;
// 	} else {
// 		exports.parseText(curr)

// 		.then( () => {
// 			return exports.parseAll(curr + 1, end);
// 		})

// 		.catch( (err) => {
// 			console.log('err parsing all', err);
// 			return;
// 		});
// 	}
// };

exports.getSummary = function(id) {
	return exports.getOne(id)
	.then( (unsummedStory) => {
		console.log('got id from server');
		return exports.parseText(unsummedStory);
	})
	.then( (finalObj) => {
		console.log('summarized story', finalObj);
		return finalObj;
	})
	.catch( (err) => {
		console.log('there was an err', err);
		return 'big err';
	});
};

// examples of how methods are used
// exports.getSummary(12731914);

// A test to see what the actual contents of the webpage are
// for those pages that don't work
// var testRequestModule = function(id) {
// 	return exports.getOne(id)
// 	.then( (unsummedStory) => {
// 		console.log('id returned', unsummedStory);
// 		return rp(unsummedStory.url);
// 	})
// 	.then( (res) => {
// 		console.log('got a res', res);
// 	})
// 	.catch( (err) => {
// 		console.log('youll get it', err);
// 	});
// };

// testRequestModule(12731914);
// these need to be refactored before they are used
// exports.parseAll(85, 87);
// exports.getAllList(20, 30);