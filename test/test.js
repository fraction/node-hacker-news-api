var hn = require("./../index.js");
var fs = require('fs');
var expect = require('chai').expect;
var nock = require('nock');

var fixtures = JSON.parse(fs.readFileSync(__dirname + "/fixtures/fixtures.json"));

var api = nock('https://hn.algolia.com').persist();
fixtures.forEach(function(f) {
  api.get(f.url).reply(200, f.reply);
});


var slice = function(arr){ return Array.prototype.slice.call(arr); };

function crazy_curry(args, fn) {
  args = slice(arguments);
  fn = args.pop();

  return function(innerArgs) {
    innerArgs = slice(arguments);
    Array.prototype.push.apply(innerArgs, args);
    fn.apply(this, innerArgs);
  };
}



describe('hn', function(){
  function verifyDataHasOneOfTags(err, data, tags, done) {
    if(err) {
      return done("Error");
    }
    expect(data).to.have.property('hits');
    data.hits.map(function(comment) {
      var intersection = tags.filter(function(n) {
        return comment._tags.indexOf(n) != -1;
      });
      expect(intersection).not.to.be.empty;
    });
    done();
  }

  it('should get comments', function(done) {
    hn.getComments(crazy_curry(['comment'], done, verifyDataHasOneOfTags));
  });
  it('should get latest comments', function(done) {
    hn.getLastComments(crazy_curry(['comment'], done, verifyDataHasOneOfTags));
  });


  it('should get polls', function(done) {
    hn.getPolls(crazy_curry(['poll'], done, verifyDataHasOneOfTags));
  });
  it('should get latest polls', function(done) {
    hn.getLastPolls(crazy_curry(['poll'], done, verifyDataHasOneOfTags));
  });


  it('should get posts', function(done) {
    hn.getPosts(crazy_curry(['story', 'poll'], done, verifyDataHasOneOfTags));
  });
  it('should get latest posts', function(done) {
    hn.getLastPosts(crazy_curry(['story', 'poll'], done, verifyDataHasOneOfTags));
  });


  it('should get stories', function(done) {
    hn.getStories(crazy_curry(['story'], done, verifyDataHasOneOfTags));
  });
  it('should get latest stories', function(done) {
    hn.getLastStories(crazy_curry(['story'], done, verifyDataHasOneOfTags));
  });
});
