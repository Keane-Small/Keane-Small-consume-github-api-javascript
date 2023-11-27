const {
  filterData,
  getData,
  errorHandling,
  checkForOwner,
  checkForRepository,
} = require("./helper_functions");
require("dotenv").config();

async function getPullRequests({ owner, repo, startDate, endDate }) {
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "Accept-Encoding": "gzip,deflate,compress",
  };
  await checkForOwner(owner, headers);
  await checkForRepository(owner, repo, headers);
  const allPrs = [];
  const perPage = 100;
  let page = 1;
  try {
    async function getPrs() {
      const url = `https://api.github.com/repos/${owner}/${repo}/pulls?page=${page}&per_page=${perPage}&state=all`;
      const response = await getData(url, headers);
      allPrs.push(...response.data);
      page++;
      return response;
    }

    async function nextPage() {
      const response = await getPrs();
      if (
        response.headers.link &&
        response.headers.link.includes('rel="next"')
      ) {
        return nextPage();
      }
    }

    await nextPage();
    return allPrs.length > 0 ? filterData(allPrs, startDate, endDate) : null;
  } catch (err) {
    errorHandling(err);
  }
}

module.exports = { getPullRequests };
