import React from 'react';
import logo from './logo.svg';
import Settings from "./Settings"


//import AWS from 'aws-sdk'
// import * as AWS from 'aws-sdk';
const AWS = require('aws-sdk')

const Images = ( props ) => {

  const listFiles = () => {

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token
      }
    };    

    const resource = "images/";

    fetch(Settings.baseAwsUrl + resource, options)
      .then(res => res.json())
      .then(
        result => {
          console.log(result)
        }  ,
        (error) => {
          console.error( "Could not load links : ", error.message);
        }
      )  
    
  }

  return (
    <h1 onClick={listFiles} >Yeah</h1>
  )
}

 

export { Images };
