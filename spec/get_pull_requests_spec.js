const { getData, filterData } = require("../src/helper_functions");
const { getPullRequests } = require("../src/get_pull_request");
const axios = require("axios");
const { rawData, modifiedData } = require("../src/mocked_data");
const MockAdapter = require("axios-mock-adapter");

describe("getPullRequests", () => {
  let owner, repositoryName, startDate, endDate, url, headers;
  beforeEach(() => {
    startDate = "2023-03-01";
    endDate = "2023-03-10";
    owner = "sjahgfkjgasf";
    repositoryName = "oasfpijaskf";
    url = `https://api.github.com/repos/${owner}/${repositoryName}/pulls?page=1&per_page=100&state=all`;
    const mock = new MockAdapter(axios);
    mock.onGet(url).reply(200, ["success"]);
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
    const axiosSpy = spyOn(axios, "get");
    axiosSpy.and.returnValues(
      Promise.resolve({ data: rawData[0] }), // First page
      // Promise.resolve({ data: rawData[1] }), // Second page
      // Promise.resolve({ data: rawData[2] }), // Third page
      Promise.resolve({ data: [] }) // Empty response to end the loop
    );

    await getPullRequests(
      "Umuzi-org",
      "ACN-syllabus",
      "2022-03-01",
      "2022-03-10"
    ).then((response) => {
      expect(response).toEqual(modifiedData);
    });
  });
});
