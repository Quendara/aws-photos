import React, { Component, useState } from "react";
import { render } from "react-dom";

import { Auth } from "./Auth";
import { ImageApp } from "./ImageApp";
import { TimeTree } from "./TimeTree";





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
    <div className="container-fluid">
      <br />
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand mr-auto " href="#">
          Photos
        </a>
        <Auth authSuccessCallback={authSuccessCallback} />
      </nav>
      <hr />
      {username.length > 0 &&
        <>
          <ImageApp username={username} token={jwtTocken} url="images" />
        </>}
    </div>
  );
};

// 
// <TimeTree username={username} token={ jwtTocken }  />
render(<App />, document.getElementById("root"));
