const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

function removeTime(date) {
  return date.toISOString().slice(0, 10);
}

function checkBetweenDates(item, startDate, endDate) {
  const pullRequest = item;
  pullRequest.created_at = new Date(pullRequest.created_at);
  pullRequest.updated_at = new Date(pullRequest.updated_at);
  if (
    (pullRequest.created_at >= startDate &&
      pullRequest.created_at <= endDate) ||
    (pullRequest.updated_at >= startDate && pullRequest.updated_at <= endDate)
  ) {
    return true;
  } else {
    return false;
  }
}

async function getPullRequests(owner, repositoryName, startDate, endDate) {
  // const url = `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr;`;
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "Accept-Encoding": "gzip,deflate,compress",
  };
  const allPrs = [];
  const outputArray = [];
  const perPage = 100;
  let page = 1;
  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/pulls?page=${page}&per_page=${perPage}&state=all`;
    const response = await axios
      .get(url, { headers })
      .then((response) => {
        allPrs.push(response.data);
        return response.data;
      })
      .catch((err) => {
        throw new Error(
          `${err.response.status} User or Repository ${err.response.data.message}`
        );
      });
    if (response.length === 0) {
      break;
    }
    page++;
  }

  console.log(allPrs);

  // while (true) {
  //   const url = `https://api.github.com/repos/${owner}/${repositoryName}/pulls?page=${page}&per_page=${perPage}&state=all`;
  //   const results = await axios
  //     .get(url)
  //     .then((response) => {
  //       const allPullRequests = response.data;
  //       startDate = new Date(startDate);
  //       endDate = new Date(endDate);
  //       for (const pr in allPullRequests) {
  //         if (checkBetweenDates(allPullRequests[pr], startDate, endDate)) {
  //           const filteredPullRequestData = (({
  //             id,
  //             user,
  //             title,
  //             state,
  //             created_at,
  //           }) => ({
  //             id,
  //             user,
  //             title,
  //             state,
  //             created_at,
  //           }))(allPullRequests[pr]);
  //           filteredPullRequestData.user = filteredPullRequestData.user.login;
  //           filteredPullRequestData.created_at = removeTime(
  //             filteredPullRequestData.created_at
  //           );
  //           console.log(filteredPullRequestData);
  //           outputArray.push(filteredPullRequestData);
  //         }
  //       }
  //       page++;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       throw new Error(
  //         `${err.response.status} User or Repository ${err.response.data.message}`
  //       );
  //     });
  // }
}

let owner = "Umuzi-org";
let repositoryName = "ACN-syllabus";
let startDate = "2023-03-01";
let endDate = "2023-03-10";

const results = getPullRequests(owner, repositoryName, startDate, endDate);

module.exports = { getPullRequests };
