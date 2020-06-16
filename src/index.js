import React, { Component, useState } from "react";
import { render } from "react-dom";

import { Auth } from "./Auth";
import { ImageApp } from "./ImageApp";
import { Sandbox } from "./components/Sandbox";


import { TimeTree } from "./TimeTree";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  IndexRoute,
  useLocation
} from "react-router-dom";


import './style.scss';

const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");

  const authSuccessCallback = (username, token) => {
    setUsername(username);
    setJwtToken(token);

    console.log("username", username);
    console.log("authSuccess", token);
  };

  return (
    <Router>
    <div className="container-fluid">
      <nav className="navbar navbar-dark bg-dark">
    
        <Auth authSuccessCallback={authSuccessCallback} />
      </nav>
      

      {username.length > 0 &&
        <>
          <Route exact path="/" component={ImageApp} />
          <Route exact path="/sandbox" component={Sandbox} />
        </>}
    </div>
    </Router>
  );
};

// 
// <TimeTree username={username} token={ jwtTocken }  />
render(<App />, document.getElementById("root"));
