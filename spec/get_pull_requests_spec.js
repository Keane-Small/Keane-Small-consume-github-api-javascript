const MockAdapter = require("axios-mock-adapter");
const { getPullRequests } = require("../src/get_pull_request");
const axios = require("axios");

describe("getPullRequests", () => {
  let mockedAxios, owner, repositoryName, startDate, endDate, axiosSpy;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 seconds
  });
  beforeEach(() => {
    mockedAxios = new MockAdapter(axios);
    owner = "Umuzi-org";
    repositoryName = "ACN-syllabus";
    startDate = "2023-03-01";
    endDate = "2023-03-10";
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
  });
  afterEach(() => {
    mockedAxios.restore();
  });
  it("should call the api with the right url", () => {
    getPullRequests(owner, repositoryName, startDate, endDate);

    expect(axiosSpy).toHaveBeenCalledOnceWith(
      `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr;`
    );
  });
  it("should return the correct results from the api call", async () => {
    // Mock the Axios request
    const owner = "exampleOwner";
    const repositoryName = "exampleRepo";
    const startDate = "2023-10-20";
    const endDate = "2023-10-21";

    const mockData = {
      items: [
        {
          id: 1,
          user: { login: "user1" },
          title: "PR 1",
          state: "open",
          created_at: "2023-10-20T10:00:00Z",
          updated_at: "2023-10-20T11:00:00Z",
        },
      ],
    };

    mockedAxios
      .onGet(
        `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr`
      )
      .reply(200, mockData);

    // Call the function that makes the Axios request
    const result = await getPullRequests(
      owner,
      repositoryName,
      startDate,
      endDate
    );

    // Ensure that data is processed correctly
    expect(result).toEqual([
      {
        id: 1,
        user: "user1",
        title: "PR 1",
        state: "open",
        created_at: "2023-10-20",
      },
    ]);
    // const results = getPullRequests(
    //   owner,
    //   repositoryName,
    //   startDate,
    //   endDate
    // ).then((results) => {
    //   results;
    //   done();
    // });
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the timeout as needed
    // console.log(results);
    // expect(c).toEqual([
    //   {
    //     id: 1,
    //     user: { login: "user1" },
    //     title: "PR 1",
    //     state: "open",
    //     created_at: "2022-03-05T10:00:00Z",
    //     updated_at: "2022-03-05T11:00:00Z",
    //   },
    // ]);
  });
});
