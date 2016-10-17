var request = require('request');
var rp = require('request-promise');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('file-system'));
var cheerio = require('cheerio');
var Summary = require('node-tldr');
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var posts = [];
var _dir = '/Users/billzito/Documents/HR/week5/hackernews/pages/';

/*
getTopList calls HR api to get the list of the top posts
*/

app.get('/', function(req, res){
	parseText(63)
	.then( (summ)=> {
		res.status(200).send(summ);
	})
	.catch( (err) => {
		res.status(404).send('sad');
	});
});


app.listen(app.get('port'), function(){
	console.log('listening on port', app.get('port'));
});

var getTopList = function() {
		return rp('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')

		.then( (body) => {
			return fs.writeFileAsync('urls/topPosts.txt', body);
		})

		.then( () => {
			console.log('successfully got top list');
			return 'success';
		})

		.catch( (err) => {
			console.log('error getting top', err);
		});
};

/*
getOne gets the story at the given index and appends its title and url to the posts.txt file
*/
var getOne = function(numb, id) {

	return fs.readFileAsync('urls/topPosts.txt', 'utf8')
		
		.then( (body) => {
			var topArr = JSON.parse(body);
			var toSearch = id || topArr[numb];
			return rp('https://hacker-news.firebaseio.com/v0/item/' + toSearch + '.json');
		})

		.then( (html) => {
			var text = JSON.parse(html);
			if (text.url) {
				var curr = JSON.stringify({'title': text.title, 'url': text.url});
				console.log('curr now', curr);
				return curr;
			}
		})

		.then((post) => {
			return fs.appendFile('urls/posts.txt', post + '\n');
		})

		.then(() => {
			console.log('successfully appended');
			return 'success';

		})

		.catch( (err) => {
			console.log('err requesting', err);
		});
};

/*
getAllList recursively calls getOne once the previous async call
has been called, to retrieve the urls from all the top posts
*/
var getAllList = function(curr, end) {
	if (curr === end) {
		return 'successfully got all messages';
	} else {
		getOne(curr)

		.then(() => {
			return getAllList(curr + 1, end);
		})

		.catch( (err) => {
			console.log('failed to get a message', err);
			return;
		});
	}
};

/*
summPromise: Use node-tldr summarizer to scrape/summarizer the content of webpages
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
parseText: Given index of one website, summarize its contents and add them to file
*/
var parseText = function(numb) {
	var titleUrlObj;
	var currAttempt;
	var summ = "";
	return fs.readFileAsync('urls/posts.txt', 'utf8')
	
	.then((content) => {
		var contentArr = content.split('\n');
		titleUrlObj = JSON.parse(contentArr[numb]);	
		return summPromise(titleUrlObj['url']);
	})

	.then((result) => {
		summ = result.summary;
		return fs.writeFileAsync(_dir + numb + '.txt', summ);
	})

	.then(() => {
		console.log('successfully wrote content');
		return summ;
	})

	.catch( (err) => {
		console.log('err parsing', err);
	});
};

/*
parseAll goes from lower (incl.) to higher range (excl), recursively parsing the 
next file once the previous one returns
*/

var parseAll = function(curr, end) {
	if (curr === end) {
		console.log('found the end');
		return;
	} else {
		parseText(curr)

		.then( () => {
			return parseAll(curr + 1, end);
		})

		.catch( (err) => {
			console.log('err parsing all', err);
			return;
		});
	}
};

// parseAll(85, 87);
// getOne(20, 12719333);
// parseText(77);
// getAllList(20, 30);