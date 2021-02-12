import React, { useMemo } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Settings } from '../Settings';
import { Grid, Card, CardHeader, Icon, List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction, Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import { CheckCircleOutlineOutlined, ErrorOutline } from '@material-ui/icons';



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
    acceptedFiles.forEach( (file, index) => {
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
      const url = [Settings.baseRestApi, "photoData", "upload" ].join("/")
      // axios.post( url, formData );

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "image/jpeg");
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: file, 
        redirect: 'follow'
      };

      const failCallbackLocal = ( message ) => {
        acceptedFiles[ index ]['ok'] = "FAILED"
        acceptedFiles[ index ]['message'] = message
        failCallback( message )
      }

      const successCallbackLocal = ( message ) => {
        acceptedFiles[ index ]['ok'] = "OK"
        acceptedFiles[ index ]['message'] = message
        successCallback( message )
      }
      
      fetch( url , requestOptions)
        .then(response => response.text())
        .then(result => successCallbackLocal(result))
        .catch(error => failCallbackLocal( "Error while upload : " + error.toString() ));

      // axios({
      //   method: "POST",
      //   url: url,
      //   data: file,
      //   headers: { "Content-Type": "image/jpeg" }
      // })
    })
    // req.end(callback)
  }

  const status = ( ok ) => {
    switch( ok ){
      case undefined:
        return "UPLOADING"
      case "OK":
        return <CheckCircleOutlineOutlined />
      case "FAILED":
          return <ErrorOutline />
      default:
        return "UPLOADING"
  
    }
  }

  const acceptedFileItems = acceptedFiles.map(file => (
    <ListItem key={ file.path }>
      <ListItemText primary={file.path } secondary={file.message } />

      <ListItemIcon>
      {status( file.ok )} 
      </ListItemIcon>
    </ListItem>
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