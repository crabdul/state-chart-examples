import React from "react";
import "./App.css";
import { useMachine } from "@xstate/react";
import machine from "./machine.js";

const flatten = (value) => {
  if (typeof value === "object") {
    return Object.entries(value)[0].join(".");
  }
  return value;
};

function App() {
  const [current, send] = useMachine(machine);
  return (
    <div className="App">
      <header className="App-header">
        <form
          onSubmit={(e) => {
            send("FETCH", { user: current.context.user });
            e.preventDefault();
          }}
        >
          <label>User:</label>
          <input
            type="text"
            name="user"
            onChange={(e) => send("WRITING", { user: e.target.value })}
            value={current.context.user}
          />
          <button type="submit" data-state={flatten(current.value)}>
            Submit
          </button>
        </form>

        <button onClick={() => send("RESET")} loader="true">
          Reset
        </button>
        <div className="state">
          <pr>Current: {JSON.stringify(current.value, null, 2)}</pr>
        </div>
        <h2>Repos:</h2>
        <ul>
          {current.context.repos.map((repo, i) => (
            <li key={i}>{repo.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
