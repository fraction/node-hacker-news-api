request = require('request');

var api = {
  // make a request to the specified endpoint
  call: function (endpoint, cb) {
    var query = 'https://hn.algolia.com/api/v1/' + endpoint;
    request(query, function (error, response, body) {
      if (!error && !response.statusCode == 200)
        error = response.statusCode;
      if (typeof body !== 'undefined')
        body = JSON.parse(body);
      cb(error, body);
    });
  },

  // basic searches
  getItem: function (id, cb) {
    api.call('items/' + id, cb);
  },

  getUser: function (username, cb) {
    api.call('users/' + username, cb)
  },

  getLastStories: function (cb) {
    api.call('search_by_date?tags=story', cb);
  },

  getLastPolls: function (cb) {
    api.call('search_by_date?tags=poll', cb);
  },

  getLastPosts: function (cb) {
    api.call('search_by_date?tags=(story,poll)', cb);
  },

  getUserStories: function (username, cb) {
    api.call('search?tags=story,author_' + username, cb);
  },

  searchStories: function (search, cb) {
    api.call('search?query=' + search + '&tags=story', cb);
  },

  searchPolls: function (search, cb) {
    api.call('search?query=' + search + '&tags=poll', cb);
  },

  search: function (obj, cb) {
    var first = true;
    var params = '?';
    for (var key in obj) {
      if (first) {
        first = false;
      } else {
        params += '&';
      }
      params += key + '=' + obj[key];
    }
    api.call('search' + params, cb);
  }
};

module.exports = api;
