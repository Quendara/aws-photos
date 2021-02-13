import React, { useMemo, useState } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Settings } from '../Settings';
import { Grid, Card, CardHeader, Icon, List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction, Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import { CheckCircleOutlineOutlined, ErrorOutline, Publish } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core/';



const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#757575',
  borderStyle: 'dashed',
  backgroundColor: '#424242',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const url = [Settings.baseRestApi, "photoData", "upload"].join("/")
// axios.post( url, formData );

const myHeaders = new Headers();
myHeaders.append("Content-Type", "image/jpeg");



const FileToUpload = ({ file }) => {

  const [status, setStatus] = useState("INIT");
  const [message, setMessate] = useState("");


  const retry = () => {

    // setText("R")
    // file['status'] = ""

    setStatus("")      

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: file,
      redirect: "error" // #'follow'
    };

    const failCallbackLocal = (message) => {
      // file['status'] = "FAILED"
      // file['message'] = message
      setMessate(message)
      setStatus("FAILED")

      // file['file'] = file
      // failCallback(message)
    }

    const successCallbackLocal = (message) => {
      setMessate(message)
      setStatus("OK")      
      // file['status'] = "OK"
      // file['message'] = message
      // successCallback(message)
    }

    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => successCallbackLocal(result))
      .catch(error => failCallbackLocal("Error while upload : " + error.toString()));
  }


  const getStatus = (status) => {
    switch (status) {
      case "INIT":
        return (
          <IconButton edge="end" onClick={ retry } aria-label="delete">
            <Publish color="primary" />
          </IconButton>)      
      case "OK":
        return (
          <IconButton edge="end" onClick={ retry } aria-label="delete">
            <CheckCircleOutlineOutlined color="primary" />
          </IconButton>)
      case "FAILED":
        return (
          <IconButton edge="end" onClick={ retry } aria-label="delete">
            <ErrorOutline color="error" />
          </IconButton>
        )

      case undefined:
      default:
        return <CircularProgress />
    }
  }

  return (
    <ListItem key={ file.path }>
      <ListItemText primary={ file.path + "(" + file.size + " Bytes)" } secondary={ message } />

      <ListItemIcon >
        { getStatus( status) }
      </ListItemIcon>
    </ListItem>)
}

export function Dropzone({ successCallback, failCallback }) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: 'image/*', onDrop: files => onDrop(files) });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  function onDrop(acceptedFiles) {

    // const req = request.post('/upload')
    acceptedFiles.forEach((file, index) => {
      // req.attach(file.name, file)
      // const formData = new FormData();

      // // Update the formData object 
      // formData.append(
      //   "myFile",
      //   file,
      //   file.name
      // );

      // // Details of the uploaded file 
      // console.log(file);

      // Request made to the backend api 
      // Send formData object 


      // const failCallbackLocal = (message) => {
      //   acceptedFiles[index]['status'] = "FAILED"
      //   acceptedFiles[index]['message'] = message
      //   acceptedFiles[index]['file'] = file
      //   failCallback(message)
      // }

      // const successCallbackLocal = (message) => {
      //   acceptedFiles[index]['status'] = "OK"
      //   acceptedFiles[index]['message'] = message
      //   successCallback(message)
      // }

      // const requestOptions = {
      //   method: 'POST',
      //   headers: myHeaders,
      //   body: file,
      //   redirect: "error" // #'follow'
      // };

      // fetch(url, requestOptions)
      //   .then(response => response.text())
      //   .then(result => successCallbackLocal(result))
      //   .catch(error => failCallbackLocal("Error while upload : " + error.toString()));

      // axios({
      //   method: "POST",
      //   url: url,
      //   data: file,
      //   headers: { "Content-Type": "image/jpeg" }
      // })
    })
    // req.end(callback)
  }



  const acceptedFileItems = acceptedFiles.map(file => (
    <FileToUpload file={ file } />

  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={ file.path }>
      {file.path } - {file.size } bytes
      <ul>
        { errors.map(e => (
          <li key={ e.code }>{ e.message }</li>
        )) }
      </ul>
    </li>));

  return (
    <div className="container">
      <div { ...getRootProps({ style }) }>
        <input { ...getInputProps() } />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <List>{ acceptedFileItems }</List >

        <h4>Rejected files</h4>
        <ul>{ fileRejectionItems }</ul>
      </aside>
    </div>
  );
}