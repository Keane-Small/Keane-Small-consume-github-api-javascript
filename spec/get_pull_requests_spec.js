const MockAdapter = require("axios-mock-adapter");
const { getPullRequests } = require("../src/get_pull_request");
const axios = require("axios");
const spy = require("console-spy");

describe("getPullRequests", () => {
  let mockedAxios,
    owner,
    repositoryName,
    startDate,
    endDate,
    axiosSpy,
    consoleSpy;
  beforeEach(() => {
    mockedAxios = new MockAdapter(axios);
    owner = "Umuzi-org";
    repositoryName = "ACN-syllabus";
    startDate = "2022-03-01";
    endDate = "2022-03-10";
    mockedAxios
      .onGet(
        `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr`
      )
      .reply(200, {
        items: [
          {
            id: 1,
            user: { login: "user1" },
            title: "PR 1",
            state: "open",
            created_at: "2022-03-05T10:00:00Z",
            updated_at: "2022-03-05T11:00:00Z",
          },
        ],
      });
    axiosSpy = spyOn(axios, "get").and.callThrough();
    consoleSpy = spy.on(console, "log");
  });
  afterEach(() => {
    mockedAxios.restore();
  });
  it("should call the api with the right url", async () => {
    await getPullRequests(owner, repositoryName, startDate, endDate);

    expect(axiosSpy).toHaveBeenCalledOnceWith(
      `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr';`
    );
  });
  it("should return the correct results from the api call", async () => {
    await getPullRequests(owner, repositoryName, startDate, endDate);

    expect(consoleSpy.log.calls[0].arguments[0]).toEqual([
      {
        id: 1,
        user: { login: "user1" },
        title: "PR 1",
        state: "open",
        created_at: "2022-03-05T10:00:00Z",
        updated_at: "2022-03-05T11:00:00Z",
      },
    ]);
  });
});
