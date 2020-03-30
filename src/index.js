import React, { Component, useState } from "react";
import { render } from "react-dom";

import { Auth } from "./Auth";
import { Images } from "./Images";



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
    <div className="container"> 
      <br />
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand mr-auto " href="#">
          Home
        </a>
        <Auth authSuccessCallback={authSuccessCallback} />
      </nav>
      <hr />
      xx
      {username.length > 0 && <Images username={username} token={ jwtTocken }  />}
    </div>
  );
};

render(<App />, document.getElementById("root"));
