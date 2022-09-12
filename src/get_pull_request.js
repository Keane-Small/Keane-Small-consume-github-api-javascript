import axios from "axios";
import { removeTime, errorMessage } from "./get_pull_request_helper.js";
function getPullRequests(owner, repositoryName, startDate, endDate) {
  const url = `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr+created:${startDate}..${endDate}`;
  const outputArray = [];
  axios
    .get(url)
    .then((response) => {
      for (let i in response.data.items) {
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
        }))(response.data.items[i]);
        filteredPullRequestData.user = filteredPullRequestData.user.login;
        filteredPullRequestData.created_at = removeTime(
          filteredPullRequestData.created_at
        );
        outputArray.push(filteredPullRequestData);
      }
      console.log(outputArray);
    })
    .catch((err) => {
      const errorData = err.response.data;
      const errorCode = err.response.status;
      throw new Error(`Error ${errorCode} ${errorData.errors[0].message}`);
    });
}

getPullRequests("Uuzi-org", "ACN-syllabus", "2022-03-01", "2022-03-10")