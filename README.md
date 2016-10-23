#hn-summarizer#


###About:###
 A chrome extension to provide context to HN articles by showing previews of articles underneath their links. 
 Download the extension: https://chrome.google.com/webstore/detail/mndggbidneldegheeglhmplgocjkmlcl/


###More:###
Calls Firebase API to get relevevant URL, uses node-sumuparticles to produce summaries. Adds content to div under the link on HN. 


###Example Usage: 
node update.js //gets 
node index.js //connects to mongodb and listens on server


###Latest improvements: 
*Update.js scrapes Hackernews every 10 min (via heroku scheduler) to minimize load time for users

*Key words and est. read time provided for some articles that cant be summarized

*Clicking chrome extension icon (the p) now redirects to Hackernews

*When on Hackernews, clicking toggles summaries off/on


###Next Tasks:
*Fix timeouts of some requests

*Look into mobile and safari versions

*Unit test 80% code


##Contents##
*utils.js: get and summarize articles

*index.js: handle get requests to server

*update.js: background task running to scrape Hackernews every 10 min.

*db.js: MongoDB/MongoLab set up

*/chrome: chrome extension, making requests to server and adding to HN page