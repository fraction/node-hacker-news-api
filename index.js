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
    default:
      // past_24h
      return (now_utc - (24 * 60 * 60));
    case 'past_week':
      return (now_utc - (7 * 24 * 60 * 60));
    case 'past_month':
      return (now_utc - (30 * 24 * 60 * 60));
    case 'forever':
      return 0;
  }
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
    var query_args = {tags: 'comment',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // get popular/recent polls
  getPolls: function (cb) {
    hn.call('search', {tags: 'poll'}, cb);
  },
  getLastPolls: function (cb) {
    hn.call('search_by_date', {tags: 'poll'}, cb);
  },
  getPollsSince : function (since, cb) {
    var query_args = {tags: 'poll',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // get popular/recent posts
  getPosts: function (cb) {
    hn.call('search', {tags: '(story,poll)'}, cb);
  },
  getLastPosts: function (cb) {
    hn.call('search_by_date', {tags: '(story,poll)'}, cb);
  },
  getPostsSince : function (since, cb) {
    var query_args = {tags: '(story,poll)',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // get popular/recent stories
  getStories: function (cb) {
    hn.call('search', {tags: 'story'}, cb);
  },
  getLastStories: function (cb) {
    hn.call('search_by_date', {tags: 'story'}, cb);
  },
  getStoriesSince : function (since, cb) {
    var query_args = {tags: 'story',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
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
    var query_args = {tags: 'comment,author_' + username,
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // get popular/recent user polls
  getUserPolls: function (username, cb) {
    hn.call('search', {tags: 'poll,author_' + username}, cb);
  },
  getLastUserPolls: function (username, cb) {
    hn.call('search_by_date', {tags: 'poll,author_' + username}, cb);
  },
  getUserPollsSince : function (username, since, cb) {
    var query_args = {tags: 'poll,author_' + username,
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // get popular/recent user posts
  getUserPosts: function (username, cb) {
    hn.call('search', {tags: '(story,poll),author_' + username}, cb);
  },
  getLastUserPosts: function (username, cb) {
    hn.call('search_by_date', {tags: '(story,poll),author_' + username}, cb);
  },
  getUserPostsSince : function (username, since, cb) {
    var query_args = {tags: '(story,poll),author_' + username,
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // get popular/recent user stories
  getUserStories: function (username, cb) {
    hn.call('search', {tags: 'story,author_' + username}, cb);
  },
  getLastUserStories: function (username, cb) {
    hn.call('search_by_date', {tags: 'story,author_' + username}, cb);
  },
  getUserStoriesSince : function (username, since, cb) {
    var query_args = {tags: 'story,author_' + username,
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // search popular/recent comments
  searchComments: function (query, cb) {
    hn.call('search', {query: query, tags: 'comment'}, cb);
  },
  searchLastComments: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: 'comment'}, cb);
  },
  searchCommentsSince : function (query, since, cb) {
    var query_args = {query: query,
                      tags: 'comment',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // search popular/recent polls
  searchPolls: function (query, cb) {
    hn.call('search', {query: query, tags: 'poll'}, cb);
  },
  searchLastPolls: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: 'poll'}, cb);
  },
  searchPollsSince : function (query, since, cb) {
    var query_args = {query: query,
                      tags: 'poll',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // search popular/recent posts
  searchPosts: function (query, cb) {
    hn.call('search', {query: query, tags: 'story'}, cb);
  },
  searchLastPosts: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: 'story'}, cb);
  },
  searchPostsSince : function (query, since, cb) {
    var query_args = {query: query,
                      tags: '(story,poll)',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // search popular/recent stories
  searchStories: function (query, cb) {
    hn.call('search', {query: query, tags: 'story'}, cb);
  },
  searchLastStories: function (query, cb) {
    hn.call('search_by_date', {query: query, tags: 'story'}, cb);
  },
  searchStoriesSince : function (query, since, cb) {
    var query_args = {query: query,
                      tags: 'story',
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },


  // search popular/recent
  search: function (obj, cb) {
    hn.call('search', obj, cb);
  },
  searchLast: function (obj, cb) {
    hn.call('search_by_date', obj, cb);
  },
  searchSince : function (query, since, cb) {
    var query_args = {query: query,
                      hitsPerPage: MAX_HITS_PER_PAGE,
                      numericFilters: 'created_at_i>=' + timestamp(since)};
    hn.call('search_by_date', query_args, cb);
  },
};

module.exports = hn;
