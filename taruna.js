//
//  RTD2 - Twitter bot that tweets about the most popular github.com news
//  Also makes new friends and prunes its followings.
//
var Bot = require('./engine')
  
var bot = new Bot({
consumer_key:         'X5ZEnuJdMbYDZ4DQHKH3WR6Le',
  consumer_secret:      'c73kD7HD9WTIP1fKC8i5t6Q7TVM5NvljQlSq7bC11VrlCvSzXr',
  access_token:         '816188387681976320-CNeMHZwq0lXwa92P12qttZIWCPZXvCu',
  access_token_secret:  'QV9gqUXGEYnUuvo0AVXhb5AiTZshtb6wLDJQRRQtgGF9h',
});

console.log('bot : Jalan.');

//get date string for today's date (e.g. '2011-01-01')
function datestring () {
  var d = new Date(Date.now() - 5*60*60*1000);  //est timezone
  return d.getUTCFullYear()   + '-'
     +  (d.getUTCMonth() + 1) + '-'
     +   d.getDate();
};

setInterval(function() {
  bot.twit.get('followers/ids', function(err, reply) {
    if(err) return handleError(err)
    console.log('\n# followers:' + reply.ids.length.toString());
  });
  var rand = Math.random();

  if(rand <= 0.10) {      //  tweet popular github tweet
    var params = {
        q: 'badan siber nasional'
      , since: datestring()
      , result_type: 'mixed'
    };
    bot.twit.get('search/tweets', params, function (err, reply) {
      if(err) return handleError(err);

      var max = 0, popular;

      var tweets = reply.statuses
        , i = tweets.length;

      while(i--) {
        var tweet = tweets[i]
          , popularity = tweet.retweet_count;

        if(popularity > max) {
          max = popularity;
          popular = tweet.text;
        }
      }

      bot.tweet(popular, function (err, reply) {
        if(err) return handleError(err);

        console.log('\nTweet: ' + (reply ? reply.text : reply));
      })
    });
  } else if(rand <= 0.55) { //  make a friend
    bot.mingle(function(err, reply) {
      if(err) return handleError(err);

      var name = reply.screen_name;
      console.log('\nMingle: followed @' + name);
    });
  } else {                  //  prune a friend
    bot.prune(function(err, reply) {
      if(err) return handleError(err);

      var name = reply.screen_name
      console.log('\nPrune: unfollowed @'+ name);
    });
  }
}, 40000);

function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}
