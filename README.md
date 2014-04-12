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


### String and callback
* `getItem(id, cb)`
* `getUser(username, cb)`
* `getUserComments(username, cb)`
* `getLastUserComments(username, cb)`
* `getUserPolls(username, cb)`
* `getLastUserPolls(username, cb)`
* `getUserStories(username, cb)`
* `getLastUserStories(username, cb)`
* `searchComments(query, cb)`
* `searchLastComments(query, cb)`
* `searchPosts(query, cb)`
* `searchLastPosts(query, cb)`
* `searchStories(query, cb)`
* `searchLastStories(query, cb)`

### Object and callback
* `search(obj, cb)`
* `searchLast(obj, cb)`
