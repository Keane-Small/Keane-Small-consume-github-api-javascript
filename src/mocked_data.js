const rawData = {
  headers: { link: "" },
  data: [
    {
      id: 1,
      user: "me",
      title: "true",
      user: {
        login: "keane",
      },
      state: "closed",
      created_at: "2023-03-01",
      updated_At: "sjahfjlkahl",
    },
    {
      id: 2,
      user: "me",
      title: "true",
      user: {
        login: "keane",
      },
      state: "closed",
      created_at: "2023-10-01",
      updated_At: "sjahfjlkahl",
    },
    {
      id: 3,
      user: "me",
      title: "true",
      user: {
        login: "keane",
      },
      state: "closed",
      created_at: "2023-03-07",
      merged_At: "sjahfjlkahl",
    },
  ],
};

const modifiedData = [
  {
    id: 1,
    user: "me",
    title: "true",
    user: "keane",
    state: "closed",
    created_at: "2023-03-01",
  },
  {
    id: 3,
    user: "me",
    title: "true",
    user: "keane",
    state: "closed",
    created_at: "2023-03-07",
  },
];

module.exports = { modifiedData, rawData };
