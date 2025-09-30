export default {
  tranquilEU: {
    output: {
      client: "react-query",
      server: "http://localhost:3000",
      target: "./src/shared/api/client.ts",
      tsconfig: "./tsconfig.json",
      mock: true,
      override: {
        mutator: {
          path: "./src/shared/api/axios.ts",
          name: "axios",
        },
      },
    },
    input: {
      target: "http://localhost:3000/docs.json",
    },
  },
};
