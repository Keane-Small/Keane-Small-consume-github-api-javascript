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
  const perPage = 100;
  let page = 1;
  try {
    const allPrs = await getPrs(owner, repo, page, perPage, headers);
    return allPrs.length > 0 ? filterData(allPrs, startDate, endDate) : null;
  } catch (err) {
    errorHandling(err);
  }
}

async function getPrs(owner, repo, page, perPage, headers, prs = []) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?page=${page}&per_page=${perPage}&state=all`;
  const response = await getData(url, headers);
  prs.push(...response.data);
  if (response.headers.link && response.headers.link.includes('rel="next"')) {
    page++;
    return await getPrs(owner, repo, page, perPage, headers, prs);
  } else {
    return prs;
  }
}

module.exports = { getPullRequests };
