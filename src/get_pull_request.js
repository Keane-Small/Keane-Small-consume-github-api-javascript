import axios from "axios";
import {removeTime, checkBetweenGivenRange,errorMessage} from "./get_pull_request_helper.js"
function get_pull_requests(owner, repositoryName, startDate, endDate) {
  const url = `https://api.github.com/repos/${owner}/${repositoryName}/pulls?state=all`;
  let outputArray = [];
  axios
    .get(url)
    .then((response) => {
      for (let i in response.data) {
        let filteredPullRequestData = (({
          id,
          user,
          title,
          state,
          created_at,
          updated_at,
          merged_at,
          closed_at,
        }) => ({
          id,
          user,
          title,
          state,
          created_at,
          updated_at,
          merged_at,
          closed_at,
        }))(response.data[i]);
        filteredPullRequestData.user = filteredPullRequestData.user.login;
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        filteredPullRequestData.created_at = new Date(
          filteredPullRequestData.created_at
        );
        if (checkBetweenGivenRange(filteredPullRequestData,startDate,endDate)) {
          delete filteredPullRequestData.updated_at;
          delete filteredPullRequestData.merged_at;
          delete filteredPullRequestData.closed_at;
          filteredPullRequestData.created_at = removeTime(
            filteredPullRequestData.created_at
          );
          outputArray.push(filteredPullRequestData);
        }
      }
      console.log(outputArray);
    })
    .catch((err) => {
      console.log(errorMessage.notFound);
    });
}

