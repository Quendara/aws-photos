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

import Settings from "./Settings"

// import { TimeTree } from "./TimeTree";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  IndexRoute,
  useLocation
} from "react-router-dom";
import { setPhotos, setAccessToken } from "./redux/actions";
import { useWindowSize } from "./components/useWindowSize"


import './style.scss';

import { rootReducer } from "./redux/reducer"; // import default 
import { createStore } from "redux";

// init with function
export const store = createStore(rootReducer)


store.subscribe(() => {
  // console.log("state.subscribe", store.getState() );   
})


const loadPhotos = (url, token) => {
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


const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");

  const theme = createMuiTheme({
    palette: {
        type: "dark"
    },
  });
  



  const authSuccessCallback = (username, token) => {
    setUsername(username);
    setJwtToken(token);

    console.log("username", username);

    // initial load of data
    store.dispatch(setAccessToken(token))

    // const url = [ Settings.baseRestApi, "photos" ].join('/')
    // let url = [ Settings.baseRestApi, "photos", "filter", "sameday", "07-27" ].join('/')
    // loadPhotos( url, token )

    const fromCache = true
    if (fromCache) {
      const url = [Settings.baseApiBinaryImages, "cache", "image-cache.json"].join('/')
      loadPhotos(url, token)
    }
    else {
      const url = [Settings.baseRestApi, "photos"].join('/')
      loadPhotos(url, token)
    }
  };

  const createCache = () => {
    alert("createCache")
    const url = [Settings.baseRestApi, "photos"].join('/')
    loadPhotos(url, jwtTocken)

  }

  useEffect(() => {

    window.addEventListener("beforeunload", createCache);

    return () => {
      // window.removeEventListener("keydown", handleKeyPress, false);
      // window.addEventListener("beforeunload", leaving);
    };
  })

  const size = useWindowSize();
  const size_md = 960;

  return (
    <ThemeProvider theme={ theme }>
    <CssBaseline />

    <Router>
      <div>
        <nav>
          <Auth authSuccessCallback={ authSuccessCallback } />
        </nav>

        { username.length > 0 &&
          <Provider store={ store } >
            <Route exact path="/" component={ ImageApp } />
            
            {/* <Route exact path="/main" component={ ImageApp } /> */}
            <Route exact path="/main" ><ImageApp view="grid"> </ImageApp></Route>
            <Route exact path="/grid" ><ImageApp view="grid" menu={ (size.width > size_md) ? true : false }> </ImageApp></Route>
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
      </div>
    </Router>
    </ThemeProvider>
  );
};

// 
// <TimeTree username={username} token={ jwtTocken }  />
render(<App />, document.getElementById("root"));
