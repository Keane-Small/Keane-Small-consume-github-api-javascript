const { getPullRequests } = require("../src/consume_github_api");
const axios = require("axios");
const { rawData, modifiedData } = require("../src/mocked_data");

describe("consumeGithubApi", () => {
  let axiosSpy;
  beforeEach(() => {
    axiosSpy = spyOn(axios, "get");
  });
  it("should get called with correct url", async () => {
    const headers = {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "Accept-Encoding": "gzip,deflate,compress",
      },
    };

    getPullRequests({
      owner: "Umuzi-org",
      repo: "ACN-syllabus",
      startDate: "2023-03-01",
      endDate: "2023-03-10",
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/Umuzi-org/ACN-syllabus/pulls?page=1&per_page=100&state=all`,
      { headers }
    );
  });
  it("should return the filtered data", async () => {
    axiosSpy.and.returnValues(
      Promise.resolve({ data: rawData }),
      Promise.resolve({ data: [] })
    );

    await getPullRequests({
      owner: "Umuzi-org",
      repo: "ACN-syllabus",
      startDate: "2023-03-01",
      endDate: "2023-03-10",
    }).then((response) => {
      expect(response).toEqual(modifiedData);
    });
  });
});
