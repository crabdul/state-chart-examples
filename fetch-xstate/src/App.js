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
        <div className="container mx-auto mt-16 px-16">
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
                    <label htmlFor="username">Github Username</label>
                    <input
                        type="text"
                        placeholder="crabdul"
                        onChange={(e) => {
                            if (currentState === 'resolved') {
                                send('RESTART')
                            }
                            setUsername(e.target.value)
                        }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" data-state={currentState}>
                        {currentState === 'idle' && 'Submit'}
                        {currentState === 'loading.normal' && 'Loading'}
                        {currentState === 'loading.long' &&
                            'Rahhh...dis is taking kinda long still'}
                        {currentState === 'resolved' &&
                            "Find another user's repos"}
                        {currentState === 'rejected' && 'Try again'}
                    </button>
                </div>
            </form>
            {currentState === 'rejected' ? (
                <div role="alert" className="alert">
                    <div className="header">Error</div>
                    <div className="content">
                        <p>No repositories found for {username}</p>
                    </div>
                </div>
            ) : (
                <ul>
                    {current.context.repos.map((repo, i) => (
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
