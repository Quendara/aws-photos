import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  //  faPlus,
  faAngleDoubleRight,
  faSignOutAlt,
  faUserAstronaut,
  faCloudUploadAlt,
  faImages,
  faEllipsisV,
  faEllipsisH,
  faMapMarkerAlt,
  faThList,
  faList,
  faBars,
  faUserNinja,
  faLaptopHouse,
  faCalendarDay,
  faCameraRetro

} from "@fortawesome/free-solid-svg-icons";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';




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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(6),
      color: "#FFFFFF",
      textDecoration: "none"
    },
    title: {
      flexGrow: 1,
      color: "#FFFFFF",
      textDecoration: "none"
    },
    selected: {
      color: "#FFFF00",
    }
  }),
);

const Auth = ({ authSuccessCallback }) => {

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null); // <null | HTMLElement>

  const menuHandleClick = (event) => { // : React.MouseEvent<HTMLButtonElement>
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



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
        <AppBar position="static">
          <Toolbar>

            <Hidden smDown>    {/*  xs   |   sm   |   md   |   lg   |   xl */ }
              <NavLink to="/grid" className={ classes.title }   >
                <Typography variant="h6" >
                  <FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />
                  Photos
               </Typography>
              </NavLink>

              <NavLink to="/group" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faThList } className="mr-2" /> Group </Typography> </NavLink>
              <NavLink to="/map" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faMapMarkerAlt } className="mr-2" /> Map </Typography> </NavLink>
              <NavLink to="/list" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faList } className="mr-2" /> List </Typography> </NavLink>

              <NavLink to="/today" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCalendarDay } className="mr-2" /> Today</Typography> </NavLink>
              <NavLink to="/faces" className={ classes.title } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faUserNinja } className="mr-2" /> Faces</Typography> </NavLink>

              <NavLink to="/devtools" className={ classes.menuButton } activeClassName={ classes.selected } ><Typography color="inherit"><FontAwesomeIcon icon={ faLaptopHouse } className="mr-2" /> Devtools</Typography> </NavLink>
              <NavLink to="/import" className={ classes.title } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCloudUploadAlt } className="mr-2" /> import</Typography> </NavLink>

              <FontAwesomeIcon icon={ faUserAstronaut } className="mr-2" /><Button color="inherit">{ username } </Button>

            </Hidden>
            <Hidden mdUp>

              <NavLink to="/main" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faBars } className="mr-2" /> Menu</Typography> </NavLink>
              <NavLink to="/today" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCalendarDay } className="mr-2" /> Today</Typography> </NavLink>
              <NavLink to="/faces" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faUserNinja } className="mr-2" /> Faces</Typography> </NavLink>


              <Typography color="inherit" onClick={ menuHandleClick } ><FontAwesomeIcon icon={ faEllipsisV } className="mr-2" /> Mehr</Typography>
              <Menu
                id="simple-menu"
                anchorEl={ anchorEl }
                keepMounted
                open={ Boolean(anchorEl) }
                onClose={ handleClose }
              >
                <MenuItem>
                  <NavLink to="/grid" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCameraRetro } className="mr-2" /> Photos</Typography> </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/group" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />Groups</Typography> </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/devtools" className={ classes.title } activeClassName={ classes.selected } ><Typography color="inherit"><FontAwesomeIcon icon={ faLaptopHouse } className="mr-2" />Devtools</Typography> </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/import" className={ classes.title } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCloudUploadAlt } className="mr-2" />Import</Typography> </NavLink>
                </MenuItem>
                <MenuItem>
                  <FontAwesomeIcon onClick={ signOut } icon={ faSignOutAlt } className="mr-2" /><Typography color="inherit">Logout { username } </Typography>
                </MenuItem>
              </Menu>

            </Hidden>


          </Toolbar>
        </AppBar>

        {/* <div className="nav-wrapper" id="navbarNavDropdown">
          <div className="row">
            <div className=" col s12" >
              <ul id="nav-mobile" className="center hide-on-med-and-down m4">
                <li><NavLink className="nav-item nav-link mr-2"className="left mr-6" style={{ fontSize:"2em" }}  to="/main" ><FontAwesomeIcon icon={ faCameraRetro } className="mr-2" /> <b> Photos</b></NavLink></li>
                <li><NavLink className="nav-item nav-link mr-4" to="/today" activeClassName="blue"><FontAwesomeIcon icon={ faCalendarDay } className="mr-2" /> Today</NavLink></li>
                <li><NavLink className="nav-item nav-link mr-4" to="/faces" activeClassName="blue"><FontAwesomeIcon icon={ faUserNinja } className="mr-2" /> Faces</NavLink></li>
                <li><NavLink className="nav-item nav-link mr-4" to="/import" activeClassName="blue"><FontAwesomeIcon icon={ faCloudUploadAlt } className="mr-2" /> Import</NavLink></li>
                <li><NavLink className="nav-item nav-link mr-4 " to="/devtools" activeClassName="blue"><FontAwesomeIcon icon={ faLaptopHouse } className="mr-2" /> Devtools</NavLink></li>
              </ul>
              <ul className="right hide-on-med-and-down m4">
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
        </div> */}
      </>
    );
  }
};

export { Auth };

