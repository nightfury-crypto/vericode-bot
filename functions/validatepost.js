const db = require("../constants/firebase-setup")

const {fetchTweet} = require("../functions/twitterparse")
const {fetchLinkedin} = require("../functions/linkedinfunc")

const validatePost = async ({post, tags}) => {
    let postLink = post?.link;
    if (post?.link && post?.tweetId) {
        if (post?.link.includes("x.com")) {
            postLink = postLink.replace("x.com", "twitter.com");
        }
        return await validateTwitterLinkPost({tweet: postLink, tags});
    }
    if (post?.link && !post?.tweetId) {
        return await validateLinkedinLinkPost({linkedin: post?.link, tags});
    }
    return false;
}


// const validatePostNoLink = () => {
    
// }

const validateTwitterLinkPost = async ({tweet, tags}) => {
    const tagsArr = tags.split(",");
    const content = await fetchTweet({url: tweet});
    if (content.trim() !== "") {
        if (tagsArr.every((tag) => content.includes(tag))) {
            return true;
        } 
        return false;
    } else {
        return false;
    }
}

const validateLinkedinLinkPost = async ({linkedin, tags}) => {
    const tagsArr = tags.split(",");
    const content = await fetchLinkedin({url: linkedin});;
    if (content.trim() !== "") {
        if (tagsArr.every((tag) => content.includes(tag))) {
            return true;
        } 
        return false;
    } else {
        return false;
    }

}

exports.validatePost = validatePost;