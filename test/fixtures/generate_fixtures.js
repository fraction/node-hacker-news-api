var https = require('https');
var async = require('async');
var request = require('request');
var fs = require('fs');

var urls = [
    '/api/v1/search?tags=comment',
    '/api/v1/search_by_date?tags=comment',
    '/api/v1/search?tags=poll',
    '/api/v1/search_by_date?tags=poll',
    '/api/v1/search?tags=(story%2Cpoll)',
    '/api/v1/search_by_date?tags=(story%2Cpoll)',
    '/api/v1/search?tags=story',
    '/api/v1/search_by_date?tags=story',
];

async.mapSeries(urls, function(item, next) {
  request.get('https://hn.algolia.com' + item, function(err, response, body) {
    next(err, {
      url: item,
      reply: JSON.parse(body)
    });
  });
}, function(err, results) {
  if(err) {
    console.err("Bad news: " + err);
    process.exit();
  }
  fs.writeFileSync("./fixtures.json", JSON.stringify(results));
  console.log("Wrote fixtures.json!");
});
