request = require('request');

var hn = {
  // make a request to the specified endpoint
  call: function (endpoint, cb) {
    var query = 'https://hn.algolia.com/hn/v1/' + endpoint;
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
    hn.call('items/' + id, cb);
  },

  getUser: function (username, cb) {
    hn.call('users/' + username, cb)
  },

  getLastStories: function (cb) {
    hn.call('search_by_date?tags=story', cb);
  },

  getLastPolls: function (cb) {
    hn.call('search_by_date?tags=poll', cb);
  },

  getLastPosts: function (cb) {
    hn.call('search_by_date?tags=(story,poll)', cb);
  },

  getUserStories: function (username, cb) {
    hn.call('search?tags=story,author_' + username, cb);
  },

  searchStories: function (search, cb) {
    hn.call('search?query=' + search + '&tags=story', cb);
  },

  searchPolls: function (search, cb) {
    hn.call('search?query=' + search + '&tags=poll', cb);
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
    hn.call('search' + params, cb);
  }
};

module.exports = hn;
