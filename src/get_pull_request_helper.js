export const errorMessage = {
    notFound: "Error 404 User or Repo Not Found"
}

export function removeTime(date) {
  return date.toISOString().slice(0,10);
}
export function checkBetweenGivenRange(
  filteredPullRequestData,
  startDate,
  endDate
) {
  if (
    filteredPullRequestData.created_at >= startDate &&
      filteredPullRequestData.created_at <= endDate ||
    filteredPullRequestData.updated_at >= startDate &&
      filteredPullRequestData.updated_at <= endDate ||
    filteredPullRequestData.closed_at >= startDate &&
      filteredPullRequestData.closed_at <= endDate ||
    filteredPullRequestData.merged_at >= startDate &&
      filteredPullRequestData.merged_at <= endDate
  ) {
    return true;
  } else {
    return false;
  }
}
