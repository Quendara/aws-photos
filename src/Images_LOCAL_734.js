
import React, { Component, useState } from "react";
import logo from './logo.svg';
import Settings from "./Settings"

import Gallery from 'react-photo-gallery';


//import AWS from 'aws-sdk'
// import * as AWS from 'aws-sdk';
const AWS = require('aws-sdk')

const s3Root = "https://s3.eu-central-1.amazonaws.com/quendara.de/"

const Images = (props) => {

  const [items, setItems] = useState("");

  const listFiles = () => {

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token
      }
    };

    const url = Settings.baseAwsUrl + props.url;

    fetch(url, options)
      .then(res => res.json())
      .then(
        result => {
          // console.log(result)
          let items = result.map(
            (dataField) => {
              return { src: s3Root + dataField.key, width: 4, height: 3 };
            })

          console.log("items", items)

          items = items.slice(0, 10) // reduce

          setItems(items)
        },
        (error) => {
          console.error("Could not load images : ", error.message);
        }
      )

  }

  return (
    <>
      <h1 onClick={listFiles} >{props.url} </h1>

      {items.length > 0 && <Gallery photos={items} />}

    </>
  )
}



export { Images };
