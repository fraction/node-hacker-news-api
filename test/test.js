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
    data.hits.forEach(function(comment) {
      var intersection = tags.filter(function(n) {
        return comment._tags.indexOf(n) != -1;
      });
      expect(intersection).not.to.be.empty;
    });
    done();
  }

  function verifyDataHasAllOfTags(err, data, tags, done) {
    if(err) {
      return done("Error");
    }
    expect(data).to.have.property('hits');
    data.hits.forEach(function(item) {
      tags.forEach(function(tag) {
        expect(item._tags).to.contain(tag);
      });
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

  it('should get item', function(done) {
    hn.getItem(17, function(err, res) {
      if(err) return done(err);
      expect(res.id).to.equal(17);
      expect(res.type).to.equal('comment');
      done();
    });
  });

  it('should get user', function(done) {
    hn.getUser('pg', function(err, res) {
      if(err) return done(err);
      expect(res.username).to.equal('pg');
      done();
    });
  });

  it('should get user comments', function(done) {
    hn.getUserComments('pg', crazy_curry(['comment','author_pg'], done, verifyDataHasAllOfTags));
  });
  it('should get last user comments', function(done) {
    hn.getLastUserComments('pg', crazy_curry(['comment','author_pg'], done, verifyDataHasAllOfTags));
  });

  it('should get user polls', function(done) {
    hn.getUserPolls('pg', crazy_curry(['poll','author_pg'], done, verifyDataHasAllOfTags));
  });
  it('should get last user polls', function(done) {
    hn.getLastUserPolls('pg', crazy_curry(['poll','author_pg'], done, verifyDataHasAllOfTags));
  });

  it('should get user stories', function(done) {
    hn.getUserStories('pg', crazy_curry(['story','author_pg'], done, verifyDataHasAllOfTags));
  });
  it('should get last user stories', function(done) {
    hn.getLastUserStories('pg', crazy_curry(['story','author_pg'], done, verifyDataHasAllOfTags));
  });

  it('should search comments', function(done) {
    hn.searchComments('apple', crazy_curry(['comment'], done, verifyDataHasAllOfTags));
  });
  it('should search last comments', function(done) {
    hn.searchLastComments('apple', crazy_curry(['comment'], done, verifyDataHasAllOfTags));
  });

  it('should search polls', function(done) {
    hn.searchPolls('apple', crazy_curry(['poll'], done, verifyDataHasAllOfTags));
  });
  it('should search last polls', function(done) {
    hn.searchLastPolls('apple', crazy_curry(['poll'], done, verifyDataHasAllOfTags));
  });


  it('should search posts', function(done) {
    hn.searchPosts('apple', crazy_curry(['story'], done, verifyDataHasAllOfTags));
  });
  it('should search last posts', function(done) {
    hn.searchLastPosts('apple', crazy_curry(['story'], done, verifyDataHasAllOfTags));
  });

  it('should search posts', function(done) {
    hn.searchStories('apple', crazy_curry(['story'], done, verifyDataHasAllOfTags));
  });
  it('should search last posts', function(done) {
    hn.searchLastStories('apple', crazy_curry(['story'], done, verifyDataHasAllOfTags));
  });

  it('should search', function(done) {
    hn.search({tags: 'ask_hn', query: 'apple', page: 2}, crazy_curry(['ask_hn'], done, verifyDataHasAllOfTags));
  });
  it('should search last', function(done) {
    hn.searchLast({tags: 'ask_hn', query: 'apple', page: 2}, crazy_curry(['ask_hn'], done, verifyDataHasAllOfTags));
  });

});
