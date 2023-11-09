const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { filterData } = require("./helper_functions");

async function getPullRequests(owner, repositoryName, startDate, endDate) {
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "Accept-Encoding": "gzip,deflate,compress",
  };
  const allPrs = [];
  const perPage = 100;
  let page = 1;
  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/pulls?page=${page}&per_page=${perPage}&state=all`;
    const response = await axios
      .get(url, { headers })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(
          `${err.response.status} User or Repository ${
            JSON.stringify(err.response.data) || "Unknown Error"
          }`
        );
      });
    if (response.length === 0) {
      break;
    } else {
      allPrs.push(...response);
      page++;
    }
  }
  return filterData(allPrs, startDate, endDate);
}

module.exports = { getPullRequests };
