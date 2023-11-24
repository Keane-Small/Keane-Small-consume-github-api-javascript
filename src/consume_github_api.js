const {
  filterData,
  getData,
  errorHandling,
  checkForOwner,
  checkForRepository,
} = require("./helper_functions");


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
    while (true) {
      const url = `https://api.github.com/repos/${owner}/${repo}/pulls?page=${page}&per_page=${perPage}&state=all`;
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
    errorHandling(err);
  }
  return allPrs.length > 0 ? filterData(allPrs, startDate, endDate) : null;
}

module.exports = { getPullRequests };
