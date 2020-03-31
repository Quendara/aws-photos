
import React, { Component, useState } from "react";
import logo from './logo.svg';
import Settings from "./Settings"
import { stringify, parse } from 'qs'

import auth0 from 'auth0-js';

// export default 
class AuthTT {

  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: "https://timetreeapp.com/oauth/authorize",
      // audience: `https://timetreeapp.com/oauth/authorize`,
      clientID: "",
      redirectUri: 'http://localhost:3000/?callback',
      responseType: 'code'
    });

    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  signIn() {
    this.auth0.authorize();
  }

  getProfile() {
    return this.profile;
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }

        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        // set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;
        resolve();
      });
    });
  }
}



//import AWS from 'aws-sdk'
// import * as AWS from 'aws-sdk';
const AWS = require('aws-sdk')


const TimeTree = (props) => {

    const run = () => {

        const auth = new AuthTT()
        auth.signIn()

        // const options = {
        //     mode: "no-cors",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: props.token
        //     }
        // };

        // const authUrl = "https://timetreeapp.com/oauth/authorize?"

        // const queryParams = {
        //     client_id: "",
        //     redirect_uri: "https://master.d1skuzk79uqu7w.amplifyapp.com/",
        //     response_type: "code",
        //     state: "5653267567567567"
        // }
        // const queryParamsStr = stringify(queryParams)

        // console.log(queryParamsStr)

        // const url = authUrl + queryParamsStr


        // fetch(url, options)
        //     .then(res => res.json())
        //     .then(
        //         result => {
        //             console.log(result)
        //         },
        //         (error) => {
        //             console.error("Could not load auth : ", error.message);
        //         }
        //     )
    }

    return (
        <>
            <h1 onClick={run} >TimeTree</h1>

        </>
    )
}



export { TimeTree };
