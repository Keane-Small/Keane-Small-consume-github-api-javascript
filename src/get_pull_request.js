import axios from "axios";

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

function getPullRequests(owner, repositoryName, startDate, endDate) {
  const url = `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr';`;
  const outputArray = [];
  axios
    .get(url)
    .then((response) => {
      console.log("hello");
      const allPullRequests = response.data.items;
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      for (const pr in allPullRequests) {
        if (checkBetweenDates(allPullRequests[pr], startDate, endDate)) {
          const filteredPullRequestData = (({
            id,
            user,
            title,
            state,
            created_at,
          }) => ({
            id,
            user,
            title,
            state,
            created_at,
          }))(allPullRequests[pr]);
          filteredPullRequestData.user = filteredPullRequestData.user.login;
          filteredPullRequestData.created_at = removeTime(
            filteredPullRequestData.created_at
          );
          outputArray.push(filteredPullRequestData);
        }
      }
      console.log(outputArray);
    })
    .catch((err) => {
      throw new Error(
        `${err.response.status} User or Repository ${err.response.data.message}`
      );
    });
}

getPullRequests("Umuzi-org", "ACN-syllabus", "2023-03-01", "2023-03-10");

// module.exports = { getPullRequests };
