import logo from "./logo.svg";
import "./App.css";

async function testApiRoute() {
  const response = await fetch("/test");
  console.log(response);
}

function App() {
  return (
    <div className="App">
      <button onClick={testApiRoute}>TEST API ROUTE</button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
