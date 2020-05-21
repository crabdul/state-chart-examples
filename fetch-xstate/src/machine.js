import { createMachine, assign } from 'xstate'

const machine = createMachine({
    context: {
        results: [],
        username: '',
    },
    initial: 'idle',
    states: {
        idle: {
            on: {
                FETCH: {
                    target: 'loading',
                    actions: assign({
                        results: [],
                        username: (_, event) => event.username,
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
                        results: (_, event) => event.data,
                    }),
                },
                onError: {
                    target: 'rejected',
                },
            },
        },
        resolved: {},
        rejected: {},
    },
})

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

export default machine
