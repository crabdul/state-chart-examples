import React, { useState } from 'react'
import './main.css'
import { useMachine } from '@xstate/react'
import machine from './machine.js'
import { flatten } from './utils'
import Card from './Card'

function App() {
    const [current, send] = useMachine(machine)
    const [username, setUsername] = useState('')
    const currentState = flatten(current.value)
    return (
        <div className="container px-16 mx-auto mt-16">
            <div className="message">
                <p>Current state: {JSON.stringify(currentState, null, 2)}</p>
            </div>
            <form
                onSubmit={(e) => {
                    send('FETCH', { username })
                    e.preventDefault()
                }}
            >
                <div className="mb-4">
                    <label htmlFor="username">Search GitHub repositories</label>
                    <input
                        type="text"
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    {/* className="mr-2 text-white bg-blue-500" */}
                    <button type="submit" data-state={currentState}>
                        {currentState === 'idle' && 'Submit'}
                        {currentState === 'loading.normal' && 'Loading'}
                        {currentState === 'loading.long' &&
                            'RAHHHHHHH dis a long ting'}
                        {currentState === 'resolved' && 'Submit'}
                        {currentState === 'rejected' && 'Try again'}
                    </button>
                    <button
                        type="button"
                        className="text-white bg-red-600 ml-2"
                        onClick={() => send('CANCEL')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {currentState === 'rejected' ? (
                <div role="alert" className="alert">
                    <div className="header">Error</div>
                    <div className="content">
                        <p>
                            No repositories found for {current.context.username}
                        </p>
                    </div>
                </div>
            ) : (
                <ul>
                    {current.context.results.map((repo, i) => (
                        <li key={i}>
                            <Card {...repo} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default App
