const MockAdapter = require("axios-mock-adapter");
const { getPullRequests } = require("../src/get_pull_request");
const axios = require("axios");

describe("getPullRequests function", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should fetch and filter pull requests within the date range", async () => {
    const owner = "exampleOwner";
    const repositoryName = "exampleRepo";
    const startDate = "2023-01-01";
    const endDate = "2023-12-31";

    const mockResponse = {
      items: [
        {
          id: 1,
          user: { login: "user1" },
          title: "PR 1",
          state: "open",
          created_at: "2023-02-15T00:00:00Z",
          updated_at: "2023-02-15T00:00:00Z",
        },
        {
          id: 2,
          user: { login: "user2" },
          title: "PR 2",
          state: "closed",
          created_at: "2023-06-10T00:00:00Z",
          updated_at: "2023-06-20T00:00:00Z",
        },
      ],
    };

    const expectedOutput = [
      {
        id: 1,
        user: "user1",
        title: "PR 1",
        state: "open",
        created_at: "2023-02-15",
      },
      {
        id: 2,
        user: "user2",
        title: "PR 2",
        state: "closed",
        created_at: "2023-06-10",
      },
    ];

    mock
      .onGet(
        `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr;`
      )
      .reply(200, mockResponse);

    const result = await getPullRequests(
      owner,
      repositoryName,
      startDate,
      endDate
    );
    expect(result).toEqual(expectedOutput);
  });

  it("should handle errors and throw an error message", async () => {
    const owner = "nonexistentOwner";
    const repositoryName = "nonexistentRepo";
    const startDate = "2023-01-01";
    const endDate = "2023-12-31";

    mock
      .onGet(
        `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr;`
      )
      .reply(404, { message: "Not Found" });

    try {
      await getPullRequests(owner, repositoryName, startDate, endDate);
    } catch (error) {
      expect(error.message).toContain("404 User or Repository Not Found");
    }
  });
});
// describe("getPullRequests", () => {
let owner, repositoryName, startDate, endDate, axiosSpy;
// beforeAll(() => {
//   jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 seconds
// });
// beforeEach(() => {
//   mockedAxios = new MockAdapter(axios);
//   owner = "Umuzi-org";
//   repositoryName = "ACN-syllabus";
//   startDate = "2023-03-01";
//   endDate = "2023-03-10";
//   mockedAxios
//     .onGet(
//       `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr`
//     )
//     .reply(200, {
//       items: [
//         {
//           id: 1,
//           user: { login: "user1" },
//           title: "PR 1",
//           state: "open",
//           created_at: "2022-03-05T10:00:00Z",
//           updated_at: "2022-03-05T11:00:00Z",
//         },
//       ],
//     });
//   axiosSpy = spyOn(axios, "get").and.returnValue(
//     Promise.resolve({
//       id: 1,
//       user: "user1",
//       title: "PR 1",
//       state: "open",
//       created_at: "2023-02-15",
//     })
//   );
// });
// afterEach(() => {
//   mockedAxios.restore();
// });
// it("should call the api with the right url", () => {
//   getPullRequests(owner, repositoryName, startDate, endDate);

//   expect(axiosSpy).toHaveBeenCalledOnceWith(
//     `https://api.github.com/search/issues?q=repo:${owner}/${repositoryName}+type:pr;`
//   );
// });
// it("should return the correct results from the api call", async () => {
//   const result = getPullRequests(owner, repositoryName, startDate, endDate);
// console.log(result);
// const getPullRequestsSpy = jasmine
//   .createSpy("getPullRequests")
//   .and.callFake(() => {
//     mockedAxios;
//   });

// const result = await getPullRequestsSpy(
//   owner,
//   repositoryName,
//   startDate,
//   endDate
// );
//     expect(result).toEqual(
//       Promise.resolve({
//         id: 869735498,
//         created_at: "2022-03-02T00:00:00Z",
//         user: { login: "Rokhuda" },
//         title: "File and directory naming",
//         state: "closed",
//       })
//     );
//   });
//   it("should be called once not twice", async () => {
//     const getPullRequestsSpy = jasmine
//       .createSpy("getPullRequests")
//       .and.callFake(() => {
//         mockedAxios;
//       });

//     await getPullRequestsSpy(owner, repositoryName, startDate, endDate);

//     expect(getPullRequestsSpy).toHaveBeenCalledTimes(1);
//   });
// });
