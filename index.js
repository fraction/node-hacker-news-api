request = require('request');

var objectToParams = function(obj) {
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
};

var hn = {
  // make a request to the specified endpoint
  call: function (endpoint, cb) {
    var query = 'https://hn.algolia.com/hn/v1/' + endpoint;
    request(query, function (error, response, body) {
      if (!error && response.statusCode != 200)
        error = response.statusCode;
      if (typeof body !== 'undefined')
        body = JSON.parse(body);
      cb(error, body);
    });
  },

  // get most popular
  getComments: function (cb) {
    hn.call('search?tags=comment', cb);
  },

  getPolls: function (cb) {
    hn.call('search?tags=poll', cb);
  },

  getPosts: function (cb) {
    hn.call('search?tags=(story,poll)', cb);
  },

  getStories: function (cb) {
    hn.call('search?tags=story', cb);
  },

  // get most recent
  getLastComments: function (cb) {
    hn.call('search_by_date?tags=comment', cb);
  },

  getLastPolls: function (cb) {
    hn.call('search_by_date?tags=poll', cb);
  },

  getLastPosts: function (cb) {
    hn.call('search_by_date?tags=(story,poll)', cb);
  },

  getLastStories: function (cb) {
    hn.call('search_by_date?tags=story', cb);
  },

  // get unique
  getItem: function (id, cb) {
    hn.call('items/' + id, cb);
  },

  getUser: function (username, cb) {
    hn.call('users/' + username, cb);
  },

  // get popular user activity
  getUserComments: function (username, cb) {
    hn.call('search?tags=comment,author_' + username, cb);
  },

  getUserPolls: function (username, cb) {
    hn.call('search?tags=poll,author_' + username, cb);
  },

  getUserPosts: function (username, cb) {
    hn.call('search?tags=(story,poll),author_' + username, cb);
  },

  getUserStories: function (username, cb) {
    hn.call('search?tags=story,author_' + username, cb);
  },

  // get last user activity
  getLastUserComments: function (username, cb) {
    hn.call('search_by_date?tags=comment,author_' + username, cb);
  },

  getLastUserPolls: function (username, cb) {
    hn.call('search_by_date?tags=poll,author_' + username, cb);
  },

  getLastUserPosts: function (username, cb) {
    hn.call('search_by_date?tags=(story,poll),author_' + username, cb);
  },

  getLastUserStories: function (username, cb) {
    hn.call('search_by_date?tags=story,author_' + username, cb);
  },

  // search most popular
  searchComments: function (query, cb) {
    hn.call('search?query=' + query + '&tags=comment', cb);
  },

  searchStories: function (query, cb) {
    hn.call('search?query=' + query + '&tags=story', cb);
  },

  searchPolls: function (query, cb) {
    hn.call('search?query=' + query + '&tags=poll', cb);
  },

  searchPosts: function (query, cb) {
    hn.call('search?query=' + query + '&tags=story', cb);
  },

  // search most recent
  searchLastComments: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=comment', cb);
  },

  searchLastStories: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=story', cb);
  },

  searchLastPolls: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=poll', cb);
  },

  searchLastPosts: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=story', cb);
  },

  // custom popular search
  search: function (obj, cb) {
    var params = objectToParams(obj);
    hn.call('search' + params, cb);
  },

  // custom recent search
  searchLast: function (obj, cb) {
    var params = objectToParams(obj);
    hn.call('search_by_date' + params, cb);
  }
};

module.exports = hn;
