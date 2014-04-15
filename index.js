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
    var query = 'https://hn.algolia.com/api/v1/' + endpoint;
    request(query, function (error, response, body) {
      if (!error && response.statusCode != 200)
        error = response.statusCode;
      if (typeof body !== 'undefined')
        body = JSON.parse(body);
      cb(error, body);
    });
  },

  // get popular/recent comments
  getComments: function (cb) {
    hn.call('search?tags=comment', cb);
  },
  getLastComments: function (cb) {
    hn.call('search_by_date?tags=comment', cb);
  },

  // get popular/recent polls
  getPolls: function (cb) {
    hn.call('search?tags=poll', cb);
  },
  getLastPolls: function (cb) {
    hn.call('search_by_date?tags=poll', cb);
  },

  // get popular/recent posts
  getPosts: function (cb) {
    hn.call('search?tags=(story,poll)', cb);
  },
  getLastPosts: function (cb) {
    hn.call('search_by_date?tags=(story,poll)', cb);
  },

  // get popular/recent stories
  getStories: function (cb) {
    hn.call('search?tags=story', cb);
  },
  getLastStories: function (cb) {
    hn.call('search_by_date?tags=story', cb);
  },

  // get unique post/comment
  getItem: function (id, cb) {
    hn.call('items/' + id, cb);
  },

  // get unique user
  getUser: function (username, cb) {
    hn.call('users/' + username, cb);
  },

  // get popular/recent user comments
  getUserComments: function (username, cb) {
    hn.call('search?tags=comment,author_' + username, cb);
  },
  getLastUserComments: function (username, cb) {
    hn.call('search_by_date?tags=comment,author_' + username, cb);
  },

  // get popular/recent user polls
  getUserPolls: function (username, cb) {
    hn.call('search?tags=poll,author_' + username, cb);
  },
  getLastUserPolls: function (username, cb) {
    hn.call('search_by_date?tags=poll,author_' + username, cb);
  },

  // get popular/recent user posts
  getUserPosts: function (username, cb) {
    hn.call('search?tags=(story,poll),author_' + username, cb);
  },
  getLastUserPosts: function (username, cb) {
    hn.call('search_by_date?tags=(story,poll),author_' + username, cb);
  },

  // get popular/recent user stories
  getUserStories: function (username, cb) {
    hn.call('search?tags=story,author_' + username, cb);
  },
  getLastUserStories: function (username, cb) {
    hn.call('search_by_date?tags=story,author_' + username, cb);
  },


  // search popular/recent comments
  searchComments: function (query, cb) {
    hn.call('search?query=' + query + '&tags=comment', cb);
  },
  searchLastComments: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=comment', cb);
  },

  // search popular/recent polls
  searchPolls: function (query, cb) {
    hn.call('search?query=' + query + '&tags=poll', cb);
  },
  searchLastPolls: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=poll', cb);
  },

  // search popular/recent posts
  searchPosts: function (query, cb) {
    hn.call('search?query=' + query + '&tags=story', cb);
  },
  searchLastPosts: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=story', cb);
  },

  // search popular/recent stories
  searchStories: function (query, cb) {
    hn.call('search?query=' + query + '&tags=story', cb);
  },
  searchLastStories: function (query, cb) {
    hn.call('search_by_date?query=' + query + '&tags=story', cb);
  },


  // search popular/recent
  search: function (obj, cb) {
    var params = objectToParams(obj);
    hn.call('search' + params, cb);
  },
  searchLast: function (obj, cb) {
    var params = objectToParams(obj);
    hn.call('search_by_date' + params, cb);
  }
};

module.exports = hn;
