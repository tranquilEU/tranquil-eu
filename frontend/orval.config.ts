export default {
  tranquilEU: {
    output: {
      client: "react-query",
      server: "http://localhost:3000",
      target: "./src/api/client.ts",
      tsconfig: "./tsconfig.json",
      mock: true,
      override: {
        mutator: {
          path: "./src/api/axios.ts",
          name: "axios",
        },
      },
    },
    input: {
      target: "http://localhost:3000/docs.json",
    },
  },
};
