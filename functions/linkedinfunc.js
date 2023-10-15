const cheerio = require("cheerio");
const axios = require("axios");

async function fetchLinkedin({url}) {
  let fullText = "";
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        fullText += $("title").text();
        
        return fullText;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  exports.fetchLinkedin = fetchLinkedin;