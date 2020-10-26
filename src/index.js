import React, { useEffect, useState } from "react";
import { Provider } from 'react-redux'
import { render } from "react-dom";

import { Auth } from "./Auth";

import ImageApp from "./components/ImageApp"; // no {} because exported with connect
import Today from "./components/Today";
import ImageFaces from "./components/ImageFaces";
import Sandbox from "./components/Sandbox";
import Devtools from "./components/Devtools";

import { ThemeProvider } from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from "@material-ui/core/styles";

import {Settings, Role} from "./Settings"

// import { TimeTree } from "./TimeTree";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  IndexRoute,
  useLocation
} from "react-router-dom";
import { setPhotos, setAccessToken, setUserRoles } from "./redux/actions";
import { useWindowSize } from "./components/useWindowSize"

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


import './style.scss';

import { rootReducer } from "./redux/reducer"; // import default 
import { createStore } from "redux";

// init with function
export const store = createStore(rootReducer)


store.subscribe(() => {
  // console.log("state.subscribe", store.getState() );   
})


const loadPhotos = (url, token, roles ) => {

  if ( !roles.includes( Role.read_photos ) ) {
    console.log("No role to load photos " );
    return;
  }

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(
      result => {
        // console.log("result", result);
        store.dispatch(setPhotos(result))
        // setItems(result);
      },
      (error) => {
        console.error("Could not load links : ", error.message);
      }
    )
    .catch(err => { console.log("XX", err) })
}

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



const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null); // <null | HTMLElement>

  const menuHandleClick = (event) => { // : React.MouseEvent<HTMLButtonElement>
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = createMuiTheme({
    palette: {
      type: "dark"
    },
  });




  const authSuccessCallback = (username, token) => {
    setUsername(username);
    setJwtToken(token);

    let roles = ["user"]

    if( ['andre', 'irena'].includes( username ) ){
      roles.push( Role.update_metadata )      
    }
    if( ['andre', 'irena', 'jonna'].includes( username ) ){
      roles.push( Role.read_photos )      
    }

    console.log("username", username);
    console.log("roles", roles);

    // initial load of data
    store.dispatch(setAccessToken(token))
    store.dispatch(setUserRoles(roles))

    // const url = [ Settings.baseRestApi, "photos" ].join('/')
    // let url = [ Settings.baseRestApi, "photos", "filter", "sameday", "07-27" ].join('/')
    // loadPhotos( url, token )

    const fromCache = true
    if (fromCache) {
      const url = [Settings.baseApiBinaryImages, "cache", "image-cache.json"].join('/')
      loadPhotos(url, token, roles)
    }
    else {
      const url = [Settings.baseRestApi, "photos"].join('/')
      loadPhotos(url, token, roles)
    }
  };

  // const createCache = () => {
  //   alert("createCache")
  //   const url = [Settings.baseRestApi, "photos"].join('/')
  //   loadPhotos(url, jwtTocken, roles)

  // }

  // useEffect(() => {

  //   window.addEventListener("beforeunload", createCache);

  //   return () => {
  //     // window.removeEventListener("keydown", handleKeyPress, false);
  //     // window.addEventListener("beforeunload", leaving);
  //   };
  // })

  const size = useWindowSize();
  const size_md = 960;

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Router>
       
          
            <Auth authSuccessCallback={ authSuccessCallback } >
              <Hidden smDown>    {/*  xs   |   sm   |   md   |   lg   |   xl */ }
                <NavLink to="/grid" className={ classes.title }   >
                  <Typography variant="h6" >
                    <FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />
                  Photos
               </Typography>
                </NavLink>

                <NavLink to="/list" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faThList } className="mr-2" /> List </Typography> </NavLink>
                <NavLink to="/grid2" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faThList } className="mr-2" /> Grid2 </Typography> </NavLink>
                <NavLink to="/group" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faThList } className="mr-2" /> Group </Typography> </NavLink>
                <NavLink to="/map" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faMapMarkerAlt } className="mr-2" /> Map </Typography> </NavLink>
                {/* <NavLink to="/list" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faList } className="mr-2" /> List </Typography> </NavLink> */ }

                <NavLink to="/today" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCalendarDay } className="mr-2" /> Today</Typography> </NavLink>
                <NavLink to="/faces" className={ classes.title } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faUserNinja } className="mr-2" /> Faces</Typography> </NavLink>

                <NavLink to="/devtools" className={ classes.menuButton } activeClassName={ classes.selected } ><Typography color="inherit"><FontAwesomeIcon icon={ faLaptopHouse } className="mr-2" /> Devtools</Typography> </NavLink>
                <NavLink to="/import" className={ classes.title } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCloudUploadAlt } className="mr-2" /> import</Typography> </NavLink>
              </Hidden>
              <Hidden mdUp>

                <NavLink to="/main" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faBars } className="mr-2" /> </Typography> </NavLink>
                <NavLink to="/today" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCalendarDay } className="mr-2" /> </Typography> </NavLink>
                <NavLink to="/faces" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faUserNinja } className="mr-2" /> </Typography> </NavLink>


                <Typography color="inherit" onClick={ menuHandleClick } ><FontAwesomeIcon icon={ faEllipsisV } className="mr-2" /></Typography>
                <Menu
                  id="simple-menu"
                  anchorEl={ anchorEl }
                  keepMounted
                  open={ Boolean(anchorEl) }
                  onClose={ handleClose }
                >
                  <MenuItem>
                    <NavLink to="/grid" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />Photos</Typography> </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to="/grid2" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />Grid 2</Typography> </NavLink>
                  </MenuItem>

                  <MenuItem>
                    <NavLink to="/group" className={ classes.menuButton } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />Groups</Typography> </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to="/devtools" className={ classes.menuButton } activeClassName={ classes.selected } ><Typography color="inherit"><FontAwesomeIcon icon={ faLaptopHouse } className="mr-2" />Devtools</Typography> </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to="/import" className={ classes.title } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCloudUploadAlt } className="mr-2" />Import</Typography> </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to="/sandbox" className={ classes.title } activeClassName={ classes.selected } > <Typography color="inherit"><FontAwesomeIcon icon={ faCloudUploadAlt } className="mr-2" />sandbox</Typography> </NavLink>
                  </MenuItem>

                </Menu>
              </Hidden>
            </Auth>
   

          { username.length > 0 &&
            <Provider store={ store } >
              <Route exact path="/" component={ ImageApp } />

              {/* <Route exact path="/main" component={ ImageApp } /> */ }
              <Route exact path="/main" ><ImageApp view="grid"> </ImageApp></Route>
              <Route exact path="/grid" ><ImageApp view="grid" menu={ (size.width > size_md) ? true : false }> </ImageApp></Route>
              <Route exact path="/grid2" ><ImageApp view="grid2" menu={ (size.width > size_md) ? true : false }> </ImageApp></Route>
              <Route exact path="/map" ><ImageApp view="map" menu={ (size.width > size_md) ? true : false }>  </ImageApp></Route>
              <Route exact path="/group" ><ImageApp view="group" menu={ (size.width > size_md) ? true : false }> </ImageApp></Route>
              <Route exact path="/list" ><ImageApp view="list"> </ImageApp></Route>

              <Route exact path="/today" component={ Today } />
              <Route exact path="/faces" component={ ImageFaces } />

              <Route exact path="/import" >
                <Today flavor="import" />
              </Route>

              <Route exact path="/sandbox" component={ Sandbox } />
              <Route exact path="/devtools" component={ Devtools } />

            </Provider>
          }
        
      </Router>
    </ThemeProvider>
  );
};

// 
// <TimeTree username={username} token={ jwtTocken }  />
render(<App />, document.getElementById("root"));
