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


var MAX_HITS_PER_PAGE = '1000';

var TYPE_SEARCH = 'search';
var TYPE_SEARCH_BY_DATE = 'search_by_date';

var FUNCTIONS_TAG = ["story",
                     "comment",
                     "poll",
                     "pollop",
                     "show_hn",
                     "ask_hn",
                     "author"];

var FUNCTIONS_FILTER = ["top", "recent"];
var FUNCTIONS_TIME = ["since", "before"];


////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS                                                           
////////////////////////////////////////////////////////////////////////////////


function encodeURIComponentArray(arr) {
  return arr.map(function(component) {
    return encodeURIComponent(component);
  });
}


function numericFilter(caller, marker, obj) {
  // Either 'before' or 'since'
  var sym = (caller === 'before') ? '<=' : '>=';
  var temp = 'created_at_i' + sym +  timestamp(marker);

  // Don't set a timestamp for this case, better performance
  obj.numericFilters = (marker === 'forever') ? '' : temp;
  return obj;
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


////////////////////////////////////////////////////////////////////////////////
// EXPORT FUNCTIONS                                                           
////////////////////////////////////////////////////////////////////////////////


var hn = function() {
 
  this.tags = {tags: '',
               hitsPerPage: MAX_HITS_PER_PAGE};

  // Make a request with the specified uri component array
  // and query argument object. If the queryObj is omitted,
  // it will be assumed to be empty and the callback may be 
  // there instead
  this.call = function (components, queryObj, cb) {
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
  }
}
module.exports = new hn();


////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE METHOD CHAINING                                                        
////////////////////////////////////////////////////////////////////////////////


FUNCTIONS_TAG.forEach(function (fName) {
  hn.prototype[fName] = function (id) {
    // 'author' or 'story' with id
    if (arguments.length === 1) {
        fName = fName + "_" + id;
    }

    this.tags.tags = (this.tags.tags === '') ? fName :
                                               this.tags.tags + "," + fName;
    return this;
  };
});


FUNCTIONS_FILTER.forEach(function (fName) {
  hn.prototype[fName] = function (cb) {
    // Set search type 
    switch (fName) {
      case "top":
        this.type = TYPE_SEARCH;
        break;
      case "recent":
        this.type = TYPE_SEARCH_BY_DATE;
        break;
    }

    if (arguments.length === 1 && typeof cb === 'function') {
        this.call(this.type, this.tags, cb);
    }
    else {
        return this;
    }
  };
});


FUNCTIONS_TIME.forEach(function (fName) {
  hn.prototype[fName] = function(marker, cb) {
    numericFilter(fName, marker, this.tags);

    if (arguments.length === 2 && typeof cb === 'function') {
      this.call(this.type, this.tags, cb);
    }
    else {
      return this;
    }
  };
});


hn.prototype.search = function (query, cb) {
  this.tags.query = query; 

  if (arguments.length === 2 && typeof cb === 'function') {
    if (typeof this.type === 'undefined') { this.type = TYPE_SEARCH }
    this.call(this.type, this.tags, cb);
  }
  else {
    return this;
  }
};
