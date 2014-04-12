# Node.js Hacker News API

A Node.js library for seamless integration with [Algolia's kickass Hacker News API](https://hn.algolia.com/api). 


## Installation

Impossible. Don't even try it.

## Usage

Some methods only require a callback.

```js
api.getLastPolls(function (error, data) {
  if (error)
    throw error;
  console.log(data);
});
```

Some methods require a string and a callback.

```js
api.getUserStories('pg', function (error, data) {
  if (error)
    throw error;
  console.log(data);
});
```

The `api.search(obj, cb)` method requires an object and a callback.
```js
api.search({
  query: 'javascript',
  tags: 'poll'
}, function (error, data) {
  if (error)
    throw error;
  console.log(data);
});
```
