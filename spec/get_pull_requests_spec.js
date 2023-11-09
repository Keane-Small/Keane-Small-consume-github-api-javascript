const { getPullRequests } = require("../src/get_pull_request");
const { axios } = require("axios");
const nock = require("nock");

axios.defaults.adapter = "https";

describe("getPullRequests", () => {
  let axiosGetSpy, owner, repositoryName, startDate, endDate;

  beforeEach(() => {
    owner = "testOwner";
    repositoryName = "testRepo";
    startDate = "2023-01-01";
    endDate = "2023-11-01";

    axiosGetSpy = spyOn(axios, "get").and.returnValue(
      Promise.resolve({ data: [] })
    );

    nock("https://api.github.com")
      .get(`/repos/${owner}/${repositoryName}/pulls`)
      .query({
        page: 1,
        per_page: 100,
        state: "all",
      })
      .reply(200, (results = [["ok"]]));
  });

  afterEach(() => {
    axiosGetSpy.calls.reset();
    nock.cleanAll();
  });
  it("should make an API call with the correct URL and headers", async () => {
    await getPullRequests(owner, repositoryName, startDate, endDate);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${owner}/${repositoryName}/pulls?page=1&per_page=100&state=all`,
      {
        headers: {
          Authorization: jasmine.stringMatching(/^token .+$/),
          "Accept-Encoding": "gzip,deflate,compress",
        },
      }
    );
  });

  it("should make the API call only once", async () => {
    await getPullRequests(owner, repositoryName, startDate, endDate);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("should process data of a specific format correctly", async () => {
    const testData = [{ title: "PR 1" }, { title: "PR 2" }];
    await getPullRequests(owner, repositoryName, startDate, endDate).then(
      (response) => {
        expect(response).toEqual([{ title: "PR 1" }, { title: "PR 2" }]);
      }
    );
  });
});
