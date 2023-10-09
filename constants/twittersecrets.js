
var Twitter = require('twitter');

var twitterclient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });

exports.twitterclient = twitterclient;


// ```
// API Key = iATgbOPaXXourALx4WW3vnxpA
// API Key Secret = tWrHV4ZCoejAXj1PXOvTSdkjiOzaageJJWIOXM9so3LnogpEX3
// BEARER_TOKEN = AAAAAAAAAAAAAAAAAAAAAAQGqQEAAAAABkkgXkzFXVZ2%2BaEekHHvI5H37vU%3Dsr8c049FKJKPDxYSd5eoAgmK69Fexnc9ExqCFIXvuk6BYQkbg1
// Acesstoken = 1215605287996067842-cB4mYIyrfzd6mt4ZzkghrjiGZKvw1a
// Access token secrete = dWojEMeBxVEUk4M9Xuj6CBqtElYdOkWsMLVwcJiFQeOf5
// ```

// client id = OHdMS2laZ2JxdFRnMGZVQnJIRDQ6MTpjaQ
// client secret = diLxJTnQ5cSY4rzyVX18TObRtMMe916_sMcBanxk3M9iHC2jBh