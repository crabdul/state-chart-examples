import { createMachine, assign } from 'xstate'

const delayRequest = (f, delay) => (args) =>
    new Promise((res) => setTimeout(() => res(f(args)), delay))

let fetchRepos = (username) =>
    fetch(`https://api.github.com/users/${username}/repos`)
        .then((res) => {
            if (!res.ok) {
                // make the promise be rejected if we didn't get a 2xx response
                throw new Error('Not 2xx response')
            }
            return res.json()
        })
        .catch((e) => {
            throw e
        })

fetchRepos = delayRequest(fetchRepos, 5000)

const loadingStates = {
    initial: 'normal',
    states: {
        normal: {
            after: {
                // after 2 second, transition to yellow
                2000: 'long',
            },
        },
        long: {},
    },
}

const machine = createMachine({
    id: 'fetch',
    context: {
        repos: [],
        username: '',
    },
    initial: 'idle',
    states: {
        idle: {
            on: {
                FETCH: {
                    target: 'loading',
                    actions: assign({
                        repos: [],
                    }),
                },
                RESET: {
                    actions: assign({
                        username: '',
                    }),
                },
            },
        },
        loading: {
            invoke: {
                src: (_, event) => fetchRepos(event.username),
                onDone: {
                    target: 'resolved',
                    actions: assign({
                        repos: (_, event) => event.data,
                    }),
                },
                onError: {
                    target: 'rejected',
                },
            },
            on: {
                CANCEL: 'idle',
            },
            ...loadingStates,
        },
        resolved: {
            on: {
                RESTART: {
                    target: 'idle',
                },
            },
        },
        rejected: {
            on: {
                FETCH: 'loading',
            },
        },
    },
})

export default machine
