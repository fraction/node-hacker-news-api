# Node.js Hacker News API

A Node.js library for seamless integration with [Algolia's kickass Hacker News API](https://hn.algolia.com/api). 


## Installation

```sh
npm install hacker-news-api
```

## Examples

Some methods only require a callback.

```js
var hn = require('hacker-news-api');

hn.getLastPolls(function (error, data) {
  if (error) throw error;
  console.log(data);
});
```

Some methods require a string and a callback.

```js
var hn = require('hacker-news-api');

hn.getUserStories('pg', function (error, data) {
  if (error) throw error;
  console.log(data);
});
```

The `api.search` method requires an object and a callback.
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

* `getItem(id, cb)`
* `getUser(username, cb)`
* `getLastStories(cb)`
* `getLastPolls(cb)`
* `getLastPosts(cb)`
* `getUserStories(username, cb)`
* `searchStories(search, cb)`
* `searchPolls(search, cb)`
* `search(obj, cb)`
