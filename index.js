var http = require('http');
var url = require('url');
var facebookChatAPI = require('facebook-chat-api');
var Twitter = require('twitter');
var creds = require('./creds');

var client = new Twitter(creds.TWITTER_CRED);
var TWEET_LENGTH = 140;

facebookChatAPI(creds.FACEBOOK_CRED, function callback (err, api) {
    api.listen(function (err, message) {
        if (message.body.substring(0, 5) === '/mem ') {
            content = message.body.substring(5);
            if (content.length <= TWEET_LENGTH) {
                client.post('statuses/update', {status: content}, function(error, tweet, response){
                    if (!error) {
                        api.sendMessage('@' + tweet.user.screen_name + ': ' + tweet.text, message.threadID);
                    }
                });
            } else {
                excessChars = content.length - TWEET_LENGTH;
                if (excessChars === 1) {
                    api.sendMessage('can\'t remember, one char too long', message.threadID);
                } else {
                    api.sendMessage('can\'t remember, ' + excessChars + ' chars too long', message.threadID);
                }
            }
        }
    });
});

http.createServer(function (req, res) {
	var suffix = url.parse(req.url).pathname.substring(1);
	res.end("Hello " + suffix);
}).listen(process.env.PORT || 5000);
