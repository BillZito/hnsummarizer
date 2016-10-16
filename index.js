var request = require('request');
var rp = require('request-promise');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('file-system'));
var cheerio = require('cheerio');
var Summary = require('node-tldr');
// var express = require('express');
// var app = express();

var posts = [];
var _dir = '/Users/billzito/Documents/HR/week5/hackernews/pages/';

/*
getOne gets the best story at the given index and appends its title and url to the posts.txt file
*/
var getOne = function(numb) {

	return rp('https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty')
		
		.then( (body) => {
			var topArr = JSON.parse(body);
			return rp('https://hacker-news.firebaseio.com/v0/item/' + topArr[numb] + '.json');
		})

		.then( (html) => {
			var text = JSON.parse(html);
			if (text.url) {
				posts.push(JSON.stringify({'title': text.title, 'url': text.url}));
			}
			console.log('posts now', posts);
			return posts;
		})

		.then((posts) => {
			return fs.appendFile('posts.txt', posts[0] + '\n');
		})

		.then(() => {
			console.log('successfully appended');
		})

		.catch( (err) => {
			console.log('err requesting', err);
		});
};




/*
Use node-tldr summarizer to scrape/summarizer the content of webpages
*/
var summPromise = function(url) {
	return new Promise( (resolve, reject) => {
		Summary.summarize(url, function(res, err) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
};


/*
Given index of one website, summarize its contents and add them to file
*/
var parseText = function(numb) {
	var titleUrlObj;
	var currAttempt;
	return fs.readFileAsync('posts.txt', 'utf8')
	
	.then((content) => {
		var contentArr = content.split('\n');
		titleUrlObj = JSON.parse(contentArr[numb]);	
		return summPromise(titleUrlObj['url']);
	})

	.then((result) => {
		return fs.writeFileAsync(_dir + numb + '.txt', result.summary);
	})

	.then(() => {
		console.log('successfully wrote content');
	})

	.catch( (err) => {
		console.log('err parsing', err);
	});
};


// summPromise("http://www.bitmatica.com/blog/an-open-source-self-hosted-heroku/")
// .then(result => {
// 	console.log('title', result.title);
// 	console.log('summary', result.summary.join("\n"));
// })
// .catch( fail => {
// 	console.log('err', fail);
// });

var n = 50;
getOne(n + 2);
parseText(n);
// summarizeText(_dir + '5.txt');