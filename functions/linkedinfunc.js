const cheerio = require("cheerio");
const axios = require("axios");

async function fetchLinkedin({url}) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        const postTitle = $("title").text();
  
        const images = [];
        console.log($("title"))
        
        return { post: postTitle };
      } else {
        console.error("Failed to fetch HTML content from the LinkedIn post URL");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  exports.fetchLinkedin = fetchLinkedin;