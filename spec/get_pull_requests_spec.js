const { getData, filterData } = require("../src/helper_functions");
const { getPullRequests } = require("../src/get_pull_request");
const axios = require("axios");
const { rawData, modifiedData } = require("../src/mocked_data");
const MockAdapter = require("axios-mock-adapter");

describe("getPullRequests", () => {
  let owner, repositoryName, startDate, endDate, url, axiosSpy;
  beforeEach(() => {
    axiosSpy = spyOn(axios, "get");
  });
  it("should get called with correct url", () => {
    const headers = {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "Accept-Encoding": "gzip,deflate,compress",
      },
    };

    getPullRequests("Umuzi-org", "ACN-syllabus", "2022-03-01", "2022-03-10");

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/Umuzi-org/ACN-syllabus/pulls?page=1&per_page=100&state=all`,
      { headers }
    );
  });
  it("should return the filtered data", async () => {
    axiosSpy.and.returnValues(
      Promise.resolve({ data: rawData[0] }),
      Promise.resolve({ data: rawData[1] }),
      Promise.resolve({ data: [] })
    );

    await getPullRequests(
      "Umuzi-org",
      "ACN-syllabus",
      "2023-03-01",
      "2023-03-10"
    ).then((response) => {
      expect(response).toEqual(modifiedData);
    });
  });
});
