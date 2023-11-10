const { getData, filterData } = require("../src/helper_functions");
const { getPullRequests } = require("../src/get_pull_request");
const axios = require("axios");
const { rawData, modifiedData } = require("../src/mocked_data");

describe("getPullRequests", () => {
  let owner, repositoryName, startDate, endDate, url, headers;
  beforeEach(() => {
    startDate = "2023-03-01";
    endDate = "2023-03-10";
    owner = "sjahgfkjgasf";
    repositoryName = "oasfpijaskf";
    url = `https://api.github.com/repos/${owner}/${repositoryName}/pulls?page=1&per_page=100&state=all`;
  });
  it("should check if the url was called once", async () => {
    headers = {
      Authorization: "token undefined",
      "Accept-Encoding": "gzip,deflate,compress",
    };
    spyOn(axios, "get");
    await getData(url, headers);
    expect(axios.get).toHaveBeenCalledOnceWith(url);
  });

  it("should check if the url and header was called once", async () => {
    spyOn(axios, "get");
    headers = {
      Authorization: "token sadasda",
      "Accept-Encoding": "gzip,deflate,compress",
    };
    await getData(url, headers);
    expect(axios.get).toHaveBeenCalledOnceWith(url, { headers });
  });

  it("should return the filtered data", async () => {
    spyOn(axios, "get").and.returnValue(
      Promise.resolve({
        status: 200,
        data: {
          params: {
            _limit: 5,
          },
          items: [{ title: "PR 1" }, { title: "PR 2" }],
        },
      })
    );
    const results = await getPullRequests(
      owner,
      repositoryName,
      startDate,
      endDate
    );
    expect(results).toEqual(modifiedData);
  });
  it("should return the filtered data", async () => {
    const results = filterData(rawData, startDate, endDate);
  });
});
