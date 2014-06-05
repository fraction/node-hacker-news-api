# Node.js Hacker News API

A Node.js library for seamless integration with [Algolia's kickass Hacker News API](https://hn.algolia.com/api).


## Installation

```sh
npm install hacker-news-api
```

## Examples

[Some methods](#callback-only) only require a callback.

```js
var hn = require('hacker-news-api');

hn.getLastPolls(function (error, data) {
  if (error) throw error;
  console.log(data);
});
```

[Some methods](#string-and-callback) require a string and a callback.

```js
var hn = require('hacker-news-api');

hn.getUserStories('pg', function (error, data) {
  if (error) throw error;
  console.log(data);
});
```

[Some methods](#object-and-callback) require an object and a callback.
```js
var hn = require('hacker-news-api');

hn.search({
  query: 'javascript',
  tags: 'poll'
}, function (error, data) {
  if (error) throw error;
  console.log(data);
});
```

## Methods

### Callback only

* `getComments(cb)`
* `getLastComments(cb)`;
* `getPolls(cb)`
* `getLastPolls(cb)`
* `getPosts(cb)`
* `getLastPosts(cb)`
* `getStories(cb)`
* `getLastStories(cb)`

### String(s) and callback

For ```xSince()``` methods, the following are valid inputs for the ```since```
parameter: **'past_24h'**, **'past_week'**, **'past_month'**, **'forever'**

* `getCommentsSince(since, cb)`;
* `getPollsSince(since, cb)`;
* `getPostsSince(since, cb)`;
* `getStoriesSince(since, cb)`;
* `getItem(id, cb)`
* `getUser(username, cb)`
* `getUserComments(username, cb)`
* `getLastUserComments(username, cb)`
* `getUserCommentsSince(username, since, cb)`
* `getUserPolls(username, cb)`
* `getLastUserPolls(username, cb)`
* `getUserPollsSince(username, since, cb)`
* `getUserPosts(username, cb)`
* `getLastUserPosts(username, cb)`
* `getUserPostsSince(username, since, cb)`
* `getUserStories(username, cb)`
* `getLastUserStories(username, cb)`
* `getUserStoriesSince(username, since, cb)`
* `searchComments(query, cb)`
* `searchLastComments(query, cb)`
* `searchCommentsSince(query, since, cb)`
* `searchPolls(query, cb)`
* `searchLastPolls(query, cb)`
* `searchPollsSince(query, since, cb)`
* `searchPosts(query, cb)`
* `searchLastPosts(query, cb)`
* `searchPostsSince(query, since, cb)`
* `searchStories(query, cb)`
* `searchLastStories(query, cb)`
* `searchStoriesSince(query, since, cb)`

### Object and callback

* `search(obj, cb)`
* `searchLast(obj, cb)`
* `searchSince(obj, since, cb)`

## API Notes

Keep in mind that Algolia has a rate limit of 10,000 requests per hour from a 
single IP. Also, requests have a max of a 1000 hits (results). Given this, 
```xSince()``` methods only return the first 1000 results. So for example, 
```getUserPostsSince()``` called with ```past_month``` will return 
the first 1000 posts within the last month from the user in question, but 
there could easily be more than that. You can check this via ```nbHits```,
the total number of hits for the query.
