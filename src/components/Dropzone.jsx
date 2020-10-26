import React, {useMemo} from 'react';

import axios from 'axios'; 
import {useDropzone} from 'react-dropzone';
import {Settings} from '../Settings';


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

export function Dropzone(props) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({accept: 'image/*', onDrop: files => onDrop(files) });

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
    acceptedFiles.forEach(file => {
      // req.attach(file.name, file)
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "myFile", 
        file,
        file.name 
      ); 
     
      // Details of the uploaded file 
      console.log( file ); 
     
      // Request made to the backend api 
      // Send formData object 
      const url = [ Settings.baseRestApi, "uploadfile" ].join("/")
      axios.post( url, formData); 


    })
    // req.end(callback)
  }  

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li> ));

  return (
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>    
    </div>
  );
}