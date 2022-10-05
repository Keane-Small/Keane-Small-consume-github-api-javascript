import axios from "axios";
import { removeTime } from "./get_pull_request_helper.js";
function removeTime(date) {
  return date.slice(0, 10);
}

function getPullRequests(owner, repositoryName, startDate, endDate) {
  const url = `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr+created:${startDate}..${endDate}&updated:${startDate}..${endDate}`;
  const outputArray = [];
  axios
    .get(url)
    .then((response) => {
      for (const pr in response.data.items) {
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
        }))(response.data.items[pr]);
        filteredPullRequestData.user = filteredPullRequestData.user.login;
        filteredPullRequestData.created_at = removeTime(
          filteredPullRequestData.created_at
        );
        outputArray.push(filteredPullRequestData);
      }
      console.log(outputArray);
    })
    .catch((err) => {
      throw new Error(
        `${err.response.status} User or Repository ${err.response.data.message}`
      );
    });
}

