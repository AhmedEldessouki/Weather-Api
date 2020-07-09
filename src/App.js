import React, { Component } from "react";
import "./App.css";
import WeatherApi from "./component/WeahterApi/WeatherApi";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <WeatherApi />
        </header>
      </div>
    );
  }
}

export default App;
