const { ApifyClient } = require('apify-client');
const ApiClient = new ApifyClient({
    token: process.env.APIFY_API_KEY,
});


const fetchTweet = async ({url}) => {
    if (!url) {
        return false
    }
    const input = {
        "startUrls": [
            {
                "url": url,
            }
        ],
        "tweetsDesired": 1
    };
    // Run the Actor and wait for it to finish
    const run = await ApiClient.actor("quacker/twitter-url-scraper").call(input);

    const { items } = await ApiClient.dataset(run.defaultDatasetId).listItems();
    let fulltext = ""
    items.forEach((item) => {
        fulltext += item.full_text;  
    });
    return fulltext;
};


exports.fetchTweet = fetchTweet;
