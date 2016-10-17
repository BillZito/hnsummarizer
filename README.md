#hn-summarizer

##Contents


###About: 
 A chrome extension to provide context to HN articles by showing previews of articles underneath their links. 


###More: 
Calls Firebase API to get relevevant URL, uses node-sumuparticles to produce summaries. Adds content to div under the link on HN. 


###Example Usage: 
*getTopList(); //Gets the top posts 
*getOne(20); // Gets the 20th item's title and url in the list
*getAllList(20, 30); //Recursively gets the 20th-29th item's titles and urls
*parseText(77); //Gets the 77th item in the list
*parseAll(85, 88); //Recursively gets the 85th, 86th, and 87th


###Detailed Usage:


####Getting URLS:

*getTopList: calls Firebase api to get the list of the top posts
*getOne: gets the best story at the given index and appends its title and url to the posts.txt file
*getAllList: recursively calls getOne once the previous async call has been called, to retrieve the urls from all the top posts

####Summarizing Content:
*summPromise: Use node-tldr summarizer to scrape/summarizer the content of webpages
*parseText: Given index of one website, summarize its contents and add them to file
*parseAll goes from lower (incl.) to higher range (excl), recursively parsing the next file once the previous one returns


###Next steps: 
*Create chrome extension
*Improve quality of summaries 
*Store content in database
*Automate and connect the pieces
