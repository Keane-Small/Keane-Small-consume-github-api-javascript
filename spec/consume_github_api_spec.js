const { getPullRequests } = require("../src/consume_github_api");
const axios = require("axios");
const { rawData, modifiedData } = require("../src/mocked_data");

describe("consumeGithubApi", () => {
  let axiosGetSpy, axiosHeadSpy;
  beforeEach(() => {
    axiosGetSpy = spyOn(axios, "get");
    axiosHeadSpy = spyOn(axios, "head").and.returnValue(Promise.resolve({}));
  });

  afterEach(() => {
    axiosGetSpy.calls.reset();
    axiosHeadSpy.calls.reset();
  });

  it("should get called with correct url", async () => {
    const headers = {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "Accept-Encoding": "gzip,deflate,compress",
      },
    };

    await getPullRequests({
      owner: "Umuzi-org",
      repo: "ACN-syllabus",
      startDate: "2023-03-01",
      endDate: "2023-03-10",
    });

    expect(axiosGetSpy).toHaveBeenCalledOnceWith(
      "https://api.github.com/repos/Umuzi-org/ACN-syllabus/pulls?page=1&per_page=100&state=all",
      headers
    );
  });

  it("should return the filtered data", async () => {
    axiosGetSpy.and.returnValues(Promise.resolve(rawData));

    const response = await getPullRequests({
      owner: "Umuzi-org",
      repo: "ACN-syllabus",
      startDate: "2023-03-01",
      endDate: "2023-03-07",
    });
    expect(response).toEqual(modifiedData);
  });
});
