import "./App.css";
import React, { useEffect } from "react";
import Nav from "./components/Nav/Nav";
import Main from "./components/Main/Main";
import getDeviceInfo  from "./deviceTracker";

function App() {
  useEffect(() => {
    console.log("Device Info:", getDeviceInfo());
  }, []);

  return (
    <div className="App">
      <Nav />
      <Main />
    </div>
  );
}

export default App;
