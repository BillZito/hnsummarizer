Hello, it's the face behind the bot :). I wrote an automatic summarizer to provide a little more context to hn articles because I often find myself wanting to know a little more before reading the comments or clicking the link. I appreciate any feedback —- this was just my first attempt and I’ll be working on only posting where it will be useful, improving the relevance of each sentence and the spacing, etc., moving forward.

***********************************
List of methods and what they do: 

1. Getting URLS
getTopList: calls Firebase api to get the list of the top posts

getOne: gets the best story at the given index and appends its title and url to the posts.txt file

getAllList: recursively calls getOne once the previous async call
has been called, to retrieve the urls from all the top posts

2. Summarizing Content
summPromise: Use node-tldr summarizer to scrape/summarizer the content of webpages

parseText: Given index of one website, summarize its contents and add them to file

parseAll goes from lower (incl.) to higher range (excl), recursively parsing the 
next file once the previous one returns

3. Example of how it works: 
getTopList(); //Gets the top posts 

getOne(20); // Gets the 20th item's title and url in the list

getAllList(20, 30); //Recursively gets the 20th-29th item's titles and urls

parseText(77); //Gets the 77th item in the list

parseAll(85, 88); //Recursively gets the 85th, 86th, and 87th

4. Next steps: 
Improve quality of summaries 
Store content in database
Automate and connect the pieces
