/* jshint node: true */
'use strict';


////////////////////////////////////////////////////////////////////////////////
// REQUIRE                                                        
////////////////////////////////////////////////////////////////////////////////


var querystring = require('querystring');
var request = require('request');


////////////////////////////////////////////////////////////////////////////////
// CONSTANTS                                                           
////////////////////////////////////////////////////////////////////////////////


/**
 * Max number of hits (results) for a query - set by Algolia
 */
var MAX_HITS_PER_PAGE = '1000';


/**
 * Request types
 */
var TYPE_ITEM = 'items';
var TYPE_USER = 'users';
var TYPE_SEARCH = 'search';
var TYPE_SEARCH_BY_DATE = 'search_by_date';


////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS                                                           
////////////////////////////////////////////////////////////////////////////////


function encodeURIComponentArray(arr) {
  return arr.map(function(component) {
    return encodeURIComponent(component);
  });
}


/**
 * Generate the numeric filter
 *
 * @param caller What is the name of the calling function?
 * @param marker What is the date range marker?
 */
function numericFilters(caller, marker) {
  var sym = '=';
  switch (caller) {
    case 'before':
      sym = '<' + sym;
      break;
    case 'since':
      sym = '>' + sym;
      break;
  }

  // Don't set a timestamp incase of forever, better performance
  var nf = (marker === 'forever') ? '' : 'created_at_i' + sym +  timestamp(marker);
  return nf;
}


/**
 * Generate Unix timestamp based on date range marker. Based on Algolia's own
 * hnsearh.js. See repo for more: https://github.com/algolia/hn-search
 */
function timestamp(range) {
  var now = new Date(); 
  var now_utc = Date.UTC(now.getUTCFullYear(),
                         now.getUTCMonth(),
                         now.getUTCDate(),
                         now.getUTCHours(),
                         now.getUTCMinutes(),
                         now.getUTCSeconds()) / 1000;
  
  switch (range) {
    case 'past_24h':
      return (now_utc - (24 * 60 * 60));
    case 'past_week':
      return (now_utc - (7 * 24 * 60 * 60));
    case 'past_month':
      return (now_utc - (30 * 24 * 60 * 60));
  }
}


////////////////////////////////////////////////////////////////////////////////
// EXPORT FUNCTIONS                                                           
////////////////////////////////////////////////////////////////////////////////


var hn = function() {
 
  this.tags_or = { };
  this.tags = {hitsPerPage: MAX_HITS_PER_PAGE};

  // Make a request with the specified uri component array
  // and query argument object. If the queryObj is omitted,
  // it will be assumed to be empty and the callback may be 
  // there instead
  this.call = function (components, queryObj, cb) {
    if (!Array.isArray(components)) components = [components];
    if (typeof queryObj === 'function') {
      cb = queryObj;
      queryObj = {};
    }

    var endpoint_parts = encodeURIComponentArray(components);
    var query = 'https://hn.algolia.com/api/v1/' + endpoint_parts.join('/');

    var query_args = querystring.stringify(queryObj);
    if(query_args.length > 0) query += '?' + query_args;

    console.log(query);
    request(query, function (error, response, body) {
      if (!error && response.statusCode != 200) { 
        error = response.statusCode;
      }

      if (typeof body !== 'undefined') {
        try {
          body = JSON.parse(body);
        } catch (ex) {
          if (!error) error = ex;
        }
      }
      cb(error, body);
    });
  };
};
module.exports = new hn();


////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE METHOD CHAINING                                                        
////////////////////////////////////////////////////////////////////////////////


var FUNCTIONS_TAG = ['story','comment','poll','pollop','show_hn','ask_hn','author'];
FUNCTIONS_TAG.forEach(function (fName) {
  hn.prototype[fName] = function (id) {

    if (arguments.length === 1 && (fName === 'author' || fName === 'story')) {
        // Have an arg to deal with, either the author (username) or story id
        // This tag is ANDed 
        fName = fName + '_' + id;
        this.tags.tags = (this.tags.tags === '') ? fName : this.tags.tags + ',' + fName;
    }
    else {
        // Or these tags
        this.tags_or.tags = (typeof this.tags_or.tags === 'undefined') ? fName : this.tags_or.tags + ',' + fName;
    }

    return this;
  };
});


var FUNCTIONS_FILTER = ['top', 'recent'];
FUNCTIONS_FILTER.forEach(function (fName) {
  hn.prototype[fName] = function (cb) {
    // Set search type 
    switch (fName) {
      case 'top':
        this.type = TYPE_SEARCH;
        break;
      case 'recent':
        this.type = TYPE_SEARCH_BY_DATE;
        break;
    }

    if (arguments.length === 1 && typeof cb === 'function') {
        this.tags.tags = this.tags.tags + '(' + this.tags_or.tags + ')';
        this.call(this.type, this.tags, cb);
    }
    else {
        return this;
    }
  };
});


var FUNCTIONS_TIME = ['since', 'before'];
FUNCTIONS_TIME.forEach(function (fName) {
  hn.prototype[fName] = function(marker, cb) {
    this.tags.numericFilters = numericFilters(fName, marker);

    if (arguments.length === 2 && typeof cb === 'function') {
      this.tags.tags = this.tags.tags + '(' + this.tags_or.tags + ')';
      this.call(this.type, this.tags, cb);
    }
    else {
      return this;
    }
  };
});


var FUNCTIONS_SINGLE = ['item', 'user'];
FUNCTIONS_SINGLE.forEach(function (fName) {
  hn.prototype[fName] = function(id, cb) {
    switch (fName) {
      case 'item':
        this.type = TYPE_ITEM;
        break;
      case 'user':
        this.type = TYPE_USER;
        break;
    }

    this.tags.tags = this.tags.tags + '(' + this.tags_or.tags + ')';
    this.call([this.type, id], cb);
  };
});


hn.prototype.search = function (query, cb) {
  this.tags.query = query; 

  if (arguments.length === 2 && typeof cb === 'function') {
    if (typeof this.type === 'undefined') { this.type = TYPE_SEARCH; }
    this.tags.tags = '(' + this.tags_or.tags + ')';
    this.call(this.type, this.tags, cb);
  }
  else {
    return this;
  }
};
