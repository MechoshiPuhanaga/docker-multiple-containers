import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import Fib from "./Fib";
import OtherPage from "./OtherPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Wellcome to Fibonacci calculator</h1>
          <Link to="/">Home</Link>
          <Link to="/other-page">Other Page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          <Route exact path="/other-page" component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
