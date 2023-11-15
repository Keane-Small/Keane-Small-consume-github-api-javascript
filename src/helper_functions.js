const axios = require("axios");
function removeTime(date) {
  return date.toISOString().slice(0, 10);
}

function checkBetweenDates(item, startDate, endDate) {
  if (item !== undefined) {
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
}

function filterData(data, startDate, endDate) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  const outputArray = [];
  for (let i = 0; i <= data.length; i++) {
    let newData = data[i];
    if (checkBetweenDates(newData, startDate, endDate)) {
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
      }))(newData);
      filteredPullRequestData.user = filteredPullRequestData.user.login;
      filteredPullRequestData.created_at = removeTime(
        filteredPullRequestData.created_at
      );
      outputArray.push(filteredPullRequestData);
    }
  }
  return outputArray;
}

async function getData(url, headers) {
  let response;
  if (headers.Authorization !== `token undefined`) {
    response = await axios.get(url, { headers });
  } else {
    response = await axios.get(url);
  }
  return response;
}

function errorHandling(err, owner, repository) {
  if (err.response.status === 404) {
    throw new Error(`The repository ${owner}/${repository} were not found`);
  }
  if (err.response.status === 403) {
    throw new Error("Your API rate limit has exceeded");
  }
}

module.exports = {
  filterData,
  getData,
  errorHandling,
};
