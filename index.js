request = require('request');

var api = {}

// make a request with the specified query
api.call = function (query, cb) {
  var fullQuery = 'https://hn.algolia.com/api/v1/' + query;
  request(fullQuery, function (error, response, body) {
    if (!error && !response.statusCode == 200)
      error = response.statusCode;
    if (typeof body !== 'undefined')
      body = JSON.parse(body);
    cb(error, body);
  });
}

//
api.getItem = function (id, cb) {
  api.call('items/' + id, cb);
}

api.getUser = function (username, cb) {
  api.call('users/' + username, cb)
}

api.getLastStories = function (cb) {
  api.call('search_by_date?tags=story', cb);
}

api.search

api.getUser('ChristianBundy', function (error, data) {
  if (error)
    throw error;
  console.log(data);
});
