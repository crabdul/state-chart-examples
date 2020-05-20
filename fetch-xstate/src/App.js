import React from 'react'
import './main.css'
import { useMachine } from '@xstate/react'
import machine from './machine.js'
import { flatten } from './utils'
import Card from './Card'

function App() {
    const [current, send] = useMachine(machine)
    const currentState = flatten(current.value)
    return (
        <div className="container mx-auto mt-16 px-16">
            <div
                className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 mb-2"
                role="alert"
            >
                <p>Current state: {JSON.stringify(currentState, null, 2)}</p>
            </div>
            <form
                onSubmit={(e) => {
                    send('FETCH')
                    e.preventDefault()
                }}
            >
                <div className="mb-4">
                    <label htmlFor="username">Github Username</label>
                    <input
                        type="text"
                        placeholder="crabdul"
                        onChange={(e) =>
                            send('WRITING', { username: e.target.value })
                        }
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" data-state={currentState}>
                        {currentState === 'idle' && 'Submit'}
                        {currentState === 'loading.normal' && 'Loading'}
                        {currentState === 'loading.long' &&
                            'Rahhh...dis is taking kinda long still'}
                        {currentState === 'resolved' && 'Submit'}
                        {currentState === 'rejected' && 'Try again'}
                    </button>
                </div>
            </form>
            <ul>
                {current.context.repos.map((repo, i) => (
                    <li key={i}>
                        <Card {...repo} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
