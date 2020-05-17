import { createMachine, assign } from "xstate";

const throttleRequest = (f) => (args) =>
  new Promise((res) => setTimeout(() => res(f(args)), 5000));

let fetchRepos = (event) =>
  fetch(`https://api.github.com/users/${event.user}/repos`).then((res) =>
    res.json()
  );

fetchRepos = throttleRequest(fetchRepos);

const loadingStates = {
  initial: "alright",
  states: {
    alright: {
      after: {
        // after 1 second, transition to yellow
        1000: "long",
      },
    },
    long: {},
  },
};

const machine = createMachine({
  id: "fetch",
  context: {
    repos: [],
    user: "",
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        FETCH: "loading",
        WRITING: {
          actions: assign({
            user: (_, event) => {
              return event.user;
            },
          }),
        },
        RESET: {
          actions: assign({
            user: "",
          }),
        },
      },
    },
    loading: {
      invoke: {
        src: (_, event) => fetchRepos(event),
        onDone: {
          target: "resolved",
          actions: assign({
            repos: (_, event) => event.data,
          }),
        },
        onError: {
          target: "rejected",
        },
      },
      on: {
        CANCEL: "idle",
      },
      ...loadingStates,
    },
    resolved: {
      on: {
        RESET: {
          target: "idle",
          actions: assign({
            user: "",
            repos: [],
          }),
        },
      },
    },
    rejected: {
      on: {
        FETCH: "loading",
      },
    },
  },
});

export default machine;
