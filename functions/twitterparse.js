const { twitterclient } = require("../constants/twittersecrets");
// const retriveTweet = async (tweetId, tweetusername) => {
//     const params = {
//       screen_name: tweetusername,
//       count: 10,
//       tweet_mode: "extended",
//     };
  
//     twitterclient.get(
//         'https://api.twitter.com/1.1/users/lookup.json',
//         params,
//         function (error, tweets, response) {
//             if (error) {
//                 console.log(error);
//                 return;
//             }
//         // console.log(tweets[0].status.full_text)
//         console.log(tweets[0])
//         return
//     }
//     );
// };

const retriveTweet = async (tweetId, tweetusername) => {
    fetch(`https://api.twitter.com/2/tweets/${tweetId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))
};

exports.retriveTweet = retriveTweet;
//   'https://api.twitter.com/1.1/users/lookup.json',

// {
//     "token_type": "bearer",
//     "access_token": "AAAAAAAAAAAAAAAAAAAAAAQGqQEAAAAABkkgXkzFXVZ2%2BaEekHHvI5H37vU%3Dsr8c049FKJKPDxYSd5eoAgmK69Fexnc9ExqCFIXvuk6BYQkbg1"
// }

// {
    // API Key : 7v94C3xQimM84aAYWubLXWPGb
    // API Key Secret : ToGUzfzFawlNIVuWBuPqagTsbytccGxFDmwNm2flYrPI8ge30Y
    // Bearer Token : AAAAAAAAAAAAAAAAAAAAAHRMqQEAAAAAG6yzALJMJLf5KAvpX75s7szKLE0%3DwpxavnzM4aoee6KAZcPNRy125w47zMB5vvaZkq4zp8fkH7SOek
    // Access Token  : 1215605287996067842-0jv26MBa48zolY4hetw3Q5UaRcWrkO
    // Access Token Secret : Vbj1Pb16UFyh38ERl81awGgoMyQxYuZobMpVP1Us877qw
    // Client ID : R1FPckROb2h4czlJcEl4cUdiSDA6MTpjaQ
    // Client Secret : uQ2RvWfQXRDVANT5bVLdB0wtBI0Aih08SHPV9PeJHK4j-pg82u
    // }