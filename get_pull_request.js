import axios from "axios";

function get_pull_requests(owner, repoName, startD, endD) {
  const url = `https://api.github.com/repos/${owner}/${repoName}/pulls?state=all`;
  let outputArray = [];
  axios.get(url).then((response) => {
    for (let i in response.data) {
      let picked = (({ id, user, title, state, created_at }) => ({
        id,
        user,
        title,
        state,
        created_at,
      }))(response.data[i]);
      picked.user = picked.user.login;
      startD = new Date(startD);
      endD = new Date(endD);
      picked.created_at = new Date(picked.created_at);
      if (picked.created_at >= startD && picked.created_at <= endD) {
        picked.created_at = removeTime(picked.created_at);
        outputArray.push(JSON.stringify(picked));
      }
    }
    console.log(outputArray)
  }).catch((err) => {
    console.log("Error 404 User or Repo Not Found")
  });
}

function removeTime(date) {
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;
  return `${year}-${month}-${day}`;
}
get_pull_requests("Umuzi-org", "ACN-syllabus", "2022-03-01", "2022-03-10");
