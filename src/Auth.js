import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
//  faPlus,
  faAngleDoubleRight,
  faSignOutAlt,
  faUserAstronaut
} from "@fortawesome/free-solid-svg-icons";

import {
  BrowserRouter as Router,
  NavLink,
} from "react-router-dom";

// import { AmazonCognitoIdentity } from "amazon-cognito-identity-js";

import jwt_decode from "jwt-decode";

// https://www.npmjs.com/package/amazon-cognito-identity-js

// Or, using CommonJS modules
require("cross-fetch/polyfill");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: "eu-central-1_8LkzpXcOV",
  ClientId: "5v3et57vfoqijj81g3ksbidm5k"
};

const Auth = ({ authSuccessCallback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
//  const [token, setToken] = useState("");
  const [trySend, setTrySend] = useState(false);

  const [cognitoUser, setCognitoUser] = useState(null);

  useEffect(() => {
    // check if user is already logged in
    if (cognitoUser == null) {
      // Update the document title using the browser API
      console.log("useEffect called");
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      console.log("cognitoUser", cognitoUser);

      if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log("session validity: " + session.isValid());

          const username = cognitoUser["username"];
          const jwtToken = session.getIdToken().getJwtToken();

          setCognitoUser(cognitoUser);
          setUsername(username);
          // callback to parent
          authSuccessCallback(username, jwtToken);
        });
      }
    }
  });

  const handleClick = event => {
    event.preventDefault();

    if (username.length > 0 && password.length > 0) {
      // send ONLY when it's filled out
      // authSuccessCallback(token);

      setTrySend(true);

      authImpl(username, password);
    } else {
    }
  };

  const signOut = () => {
    console.log("signOut");
    if (cognitoUser != null) {
      console.log("cognitoUser", cognitoUser);

      setUsername("");
      setPassword("");
      setAuthError("");
      setCognitoUser(null);

      cognitoUser.signOut();

      authSuccessCallback("", "");
    }
  };

  const authImpl = (username, password) => {
    // Amazon Cognito creates a session which includes the id, access, and refresh tokens of an authenticated user.

    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

    console.log(authenticationData, "authenticationDetails");

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: authenticationData.Username,
      Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    // cognitoUser.changePassword('Test123!', 'UserTest123!', function(err, result) {
    //     if (err) {
    //         alert(err.message || JSON.stringify(err));
    //         return;
    //     }
    //     console.log('call result: ' + result);
    // });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();

        // Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer
        let idToken = result.idToken.jwtToken;

        let decoded = jwt_decode(idToken);
        console.log(decoded);

        let username = decoded["cognito:username"];

        // callback to parent
        authSuccessCallback(username, idToken);

        setAuthError("Success" + JSON.stringify(decoded));
        setCognitoUser(cognitoUser);
        setTrySend(false);
      },
      onFailure: function (err) {
        setTrySend(false);
        console.error("Cannot log in ", JSON.stringify(err));
        setAuthError("Cannot log in " + JSON.stringify(err));
      }
    });
  };

  const getInputClass = val => {
    let ret = "form-control m-2";
    if (val.length > 0) {
      ret += " is-valid";
    } else if (trySend) {
      // show issues when length is 0 and the user has tried to send
      ret += " is-invalid";
    }
    return ret;
  };

  if (cognitoUser == null) {
    return (
      <>
        <>
          <div className="nav-wrapper" id="navbarNavDropdown">
            <div className="row">
              <div className=" col s12" >
                <a href="#" className="brand-logo hide-on-med-and-down">Photos</a>
                <ul id="nav-mobile" className="right">
                  
                  <form className="form-inline" onSubmit={ handleClick }>

                    <li>
                      <input
                        value={ username }
                        className={ getInputClass(username) }
                        placeholder="Name"
                        onChange={ e => setUsername(e.target.value) }
                      />
                    </li>
                    <li>
                      <input
                        type="password"
                        value={ password }
                        className={ getInputClass(password) }
                        placeholder="Password"
                        onChange={ e => setPassword(e.target.value) }
                      />
                    </li>
                    <li>
                      <button className="btn btn-primary m-2">
                        { trySend ? "Loading" : "Sign-In" }
                        <FontAwesomeIcon icon={ faAngleDoubleRight } className="ml-2" />
                      </button>
                    </li>
                  </form>
                </ul>
              </div>
            </div>
          </div>
        </>

        <h2>{ authError }</h2>
      </>
    );
  } else {
    //<li><NavLink className="nav-item nav-link mr-2 " to="/sandbox" activeClassName="blue">Sandbox</NavLink></li>
    return (
      <>
        <div className="nav-wrapper" id="navbarNavDropdown">
          <div className="row">
            <div className=" col s12" >
              <a href="#" className="brand-logo">Photos</a>
              <ul id="nav-mobile" className="right hide-on-med-and-down m4">
                  <li><NavLink className="nav-item nav-link mr-2" to="/today" activeClassName="blue">Today</NavLink></li>
                  <li><NavLink className="nav-item nav-link mr-2" to="/main" activeClassName="blue">Main</NavLink></li>
                  <li><NavLink className="nav-item nav-link mr-2" to="/import" activeClassName="blue">Import</NavLink></li>
                  
                  
                  <li><NavLink className="nav-item nav-link mr-2 " to="/devtools" activeClassName="blue">Devtools</NavLink></li>
                  
                <li>
                  <button className="btn btn-primary ">
                    <FontAwesomeIcon icon={ faUserAstronaut } className="mr-2" />
                    <b> { username } </b>

                  </button>
                  <button className="btn btn m-2 " onClick={ signOut }>
                    Logout
                    <FontAwesomeIcon icon={ faSignOutAlt } className="ml-2" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export { Auth };

