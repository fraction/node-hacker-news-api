/* jshint node: true */
'use strict';

var querystring = require('querystring');
var request = require('request');

var MAX_HITS_PER_PAGE = '1000';

function encodeURIComponentArray(arr) {
  return arr.map(function(component) {
    return encodeURIComponent(component);
  });
}

// Based on Algolia's own hnsearh.js
// https://github.com/algolia/hn-search
function timestamp(since) {
  var now = new Date(); 
  var now_utc = Date.UTC(now.getUTCFullYear(),
                         now.getUTCMonth(),
                         now.getUTCDate(),
                         now.getUTCHours(),
                         now.getUTCMinutes(),
                         now.getUTCSeconds()) / 1000;
  
  switch (since) {
    case 'past_24h':
      return (now_utc - (24 * 60 * 60));
    case 'past_week':
      return (now_utc - (7 * 24 * 60 * 60));
    case 'past_month':
      return (now_utc - (30 * 24 * 60 * 60));
  }
}

function genericSince(obj, cb) {
  var numericFiltersVal = (obj.since === 'forever') ? '' : 'created_at_i>=' + timestamp(obj.since);
  var queryObj = {tags: obj.tags,
                  hitsPerPage: MAX_HITS_PER_PAGE,
                  numericFilters: numericFiltersVal};
  if (typeof obj.query !== 'undefined') { queryObj.query = obj.query; }
  hn.call(obj.type, queryObj, cb);
}


var hn = {
  // Make a request with the specified uri component array
  // and query argument object. If the queryObj is omitted,
  // it will be assumed to be empty and the callback may be 
  // there instead
  call: function (components, queryObj, cb) {
    if(!Array.isArray(components)) components = [components];
    if(typeof queryObj === 'function') {
      cb = queryObj;
      queryObj = {};
    }

    var endpoint_parts = encodeURIComponentArray(components);
    var query = 'https://hn.algolia.com/api/v1/' + endpoint_parts.join('/');

    var query_args = querystring.stringify(queryObj);
    if(query_args.length > 0) query += '?' + query_args;

    request(query, function (error, response, body) {
      if (!error && response.statusCode != 200)
        error = response.statusCode;
      if (typeof body !== 'undefined') {
        try {
          body = JSON.parse(body);
        } catch(ex) {
          if(!error) error = ex;
        }
      }
      cb(error, body);
    });
  },


  // get popular/recent comments
  getComments: function (cb) {
    hn.call('search', {tags: 'comment'}, cb);
  },
  getLastComments: function (cb) {
    hn.call('search_by_date', {tags: 'comment'}, cb);
  },
  getCommentsSince : function (since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'comment', 
                          since: since}, cb);
  },


  // get popular/recent polls
  getPolls: function (cb) {
    hn.call('search', {tags: 'poll'}, cb);
  },
  getLastPolls: function (cb) {
    hn.call('search_by_date', {tags: 'poll'}, cb);
  },
  getPollsSince : function (since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'poll', 
                          since: since}, cb);
  },


  // get popular/recent posts
  getPosts: function (cb) {
    hn.call('search', {tags: '(story,poll)'}, cb);
  },
  getLastPosts: function (cb) {
    hn.call('search_by_date', {tags: '(story,poll)'}, cb);
  },
  getPostsSince : function (since, cb) {
    genericSince({type: 'search_by_date',
                          tags: '(story,poll)', 
                          since: since}, cb);
  },


  // get popular/recent stories
  getStories: function (cb) {
    hn.call('search', {tags: 'story'}, cb);
  },
  getLastStories: function (cb) {
    hn.call('search_by_date', {tags: 'story'}, cb);
  },
  getStoriesSince : function (since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'story', 
                          since: since}, cb);
  },


  // get unique post/comment
  getItem: function (id, cb) {
    hn.call(['items', id], cb);
  },


  // get unique user
  getUser: function (username, cb) {
    hn.call(['users', username], cb);
  },


  // get popular/recent user comments
  getUserComments: function (username, cb) {
    hn.call('search', {tags: 'comment,author_' + username}, cb);
  },
  getLastUserComments: function (username, cb) {
    hn.call('search_by_date', {tags: 'comment,author_' + username}, cb);
  },
  getUserCommentsSince : function (username, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'comment,author_' + username, 
                          since: since}, cb);
  },


  // get popular/recent user polls
  getUserPolls: function (username, cb) {
    hn.call('search', {tags: 'poll,author_' + username}, cb);
  },
  getLastUserPolls: function (username, cb) {
    hn.call('search_by_date', {tags: 'poll,author_' + username}, cb);
  },
  getUserPollsSince : function (username, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'poll,author_' + username, 
                          since: since}, cb);
  },


  // get popular/recent user posts
  getUserPosts: function (username, cb) {
    hn.call('search', {tags: '(story,poll),author_' + username}, cb);
  },
  getLastUserPosts: function (username, cb) {
    hn.call('search_by_date', {tags: '(story,poll),author_' + username}, cb);
  },
  getUserPostsSince : function (username, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: '(story,poll),author_' + username, 
                          since: since}, cb);
  },


  // get popular/recent user stories
  getUserStories: function (username, cb) {
    hn.call('search', {tags: 'story,author_' + username}, cb);
  },
  getLastUserStories: function (username, cb) {
    hn.call('search_by_date', {tags: 'story,author_' + username}, cb);
  },
  getUserStoriesSince : function (username, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'story,author_' + username, 
                          since: since}, cb);
  },


  // search popular/recent comments
  searchComments: function (query, cb) {
    hn.call('search', {query: query, tags: 'comment'}, cb);
  },
  searchLastComments: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: 'comment'}, cb);
  },
  searchCommentsSince : function (query, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'comment', 
                          since: since,
                          query: query}, cb);
  },


  // search popular/recent polls
  searchPolls: function (query, cb) {
    hn.call('search', {query: query, tags: 'poll'}, cb);
  },
  searchLastPolls: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: 'poll'}, cb);
  },
  searchPollsSince : function (query, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'poll', 
                          since: since,
                          query: query}, cb);
  },


  // search popular/recent posts
  searchPosts: function (query, cb) {
    hn.call('search', {query: query, tags: '(story,poll)'}, cb);
  },
  searchLastPosts: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: '(story,poll)'}, cb);
  },
  searchPostsSince : function (query, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: '(story,poll)', 
                          since: since,
                          query: query}, cb);
  },


  // search popular/recent stories
  searchStories: function (query, cb) {
    hn.call('search', {query: query, tags: 'story'}, cb);
  },
  searchLastStories: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: 'story'}, cb);
  },
  searchStoriesSince : function (query, since, cb) {
    genericSince({type: 'search_by_date',
                          tags: 'story', 
                          since: since,
                          query: query}, cb);
  },


  // search popular/recent
  search: function (obj, cb) {
    hn.call('search', obj, cb);
  },
  searchLast: function (obj, cb) {
    hn.call('search_by_date', obj, cb);
  },
  searchSince : function (obj, since, cb) {
    obj.type = 'search_by_date';
    obj.since = since;
    genericSince(obj, cb);
  }
};

module.exports = hn;
