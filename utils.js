// utils handles the summarization process by requesting urls from 
// firebase api and summarizing via an npm module

var Summary = require('node-tldr');
var request = require('request');
var rp = require('request-promise');
var Promise = require('bluebird');
var summarizer = require('summarize');
var superagent = require('superagent');
var promiseAgent = function(url) {
	return new Promise( (resolve, reject) => {
		superagent.get(url).end(function(err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
};

var mongoose = require('mongoose');
var dbController = require('./db.js');

//fs write to files, cheerio parse html content 
var fs = Promise.promisifyAll(require('file-system'));
var cheerio = require('cheerio');

var topList = [];

/*
getTopList calls HR api to get the list of the top posts
*/
exports.getTopList = function() {
		return rp('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')

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
		// console.log('curr message id is', topItems[curr]);
		return dbController.Post.find({id: topItems[curr]})
		.then( (data) => {
			if (data.length > 0) {
				console.log('already in db', topItems[curr]);
				return exports.getAllList(topItems, curr + 1, end);
			} else {
				return exports.getOne(topItems[curr])

				.then((currStory) => {
					console.log('got one story', currStory.title);
					return exports.parseText(currStory);
				})
				.then((fullStory) => {
					// miniPeek = fullStory.summary.slice(0, 10);
					// console.log('summary created', miniPeek);
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
		})
		.catch( (err) => {
			console.log('error getting from db', err);
		})
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

// exports.summPromise('http://www.latimes.com/nation/la-na-national-guard-bonus-20161020-snap-story.html');

/*
parseText: Given object without summary, summarize its contents and return object with summary
*/
exports.parseText = function(storyObj) {
	// var summ = "";
	story = storyObj;
	return exports.summPromise(storyObj.url)

	.then((result) => {
		// console.log('returned a result from summary module', result.summary);
		var summ = result.summary.join(' ');

		if (!(summ.length > 20)) {
			// console.log('its me shorty');

			return promiseAgent(storyObj.url)

			.then((res) => {
				// console.log('superagent called')				
				var summary = summarizer(res.text);

				if (summary.topics.length > 0) {
					var topTen = summary.topics.slice(0, 10);
					summ = "Keywords: " + topTen.join(', ') + ".   Wordcount: " + summary.words + ".   Read time: " + summary.minutes + " min.";

				} else {
					summ = "[No preview available]--But you should click the link!";
				}

				// console.log('after superagent fix, summary is', summ);
				storyObj.summary = summ;
				return storyObj;
			})

			.catch( (err) => {
				console.log('error with promiseAgent', err);
				summ = "[No preview available]--But you should click the link!";
				storyObj.summary = summ;
				return storyObj;
			});

		} else {

			if (summ.length > 290) {
				summ = summ.slice(0, 291) + "...";
			}

			storyObj.summary = summ;
			// console.log('summary is', storyObj.summary);
			return storyObj;
			
		}

	})

	.catch( (err) => {
		console.log('err parsing', err);
		// console.log('storyObj is', storyObj);
		storyObj.summary = "[No preview available]--But you should click the link!";
		return storyObj;
	});
};

exports.getSummary = function(id) {
	return exports.getOne(id)
	.then( (unsummedStory) => {
		// console.log('got id from server');
		return exports.parseText(unsummedStory);
	})
	.then( (finalObj) => {
		//console.log('summarized story', finalObj);
		return finalObj;
	})
	.catch( (err) => {
		console.log('there was an err', err);
		return 'big err';
	});
};

// examples of how methods are used
// exports.getSummary(12731914);
