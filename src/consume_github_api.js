const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { filterData, getData, errorHandling } = require("./helper_functions");

async function getPullRequests({ owner, repositoryName, startDate, endDate }) {
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "Accept-Encoding": "gzip,deflate,compress",
  };
  const allPrs = [];
  const perPage = 100;
  let page = 1;
  try {
    while (true) {
      const url = `https://api.github.com/repos/${owner}/${repositoryName}/pulls?page=${page}&per_page=${perPage}&state=all`;
      const response = await getData(url, { headers });
      const result = response.data;
      if (result.length === 0) {
        break;
      } else {
        allPrs.push(...response.data);
        page++;
      }
    }
  } catch (err) {
    errorHandling(err, owner, repositoryName);
  }
  return filterData(allPrs, startDate, endDate);
}

module.exports = { getPullRequests };
