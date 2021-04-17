import React, { useState } from "react";
import { useVisible } from 'react-hooks-visible'
import {VideoOnDemand} from "./VideoOnDemand";

// className={isVisible ? 'excited' : ''}
// 
export const ImageOnDemand = ({ image, className, onClick, visibilityThreshold = 0.01 }) => {
  // Boolean. This example is 50% visible.
  // const [targetRef, visible] = useVisible()
  // Boolean. This example is 50% visible.
  // const [targetRef, isVisible] = useVisible((vi: number) => vi > 0.02)

  // Percent value.
  // const [targetRef, visibility] = useVisible()    
  const [isVisibleState, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [targetRef, visibility] = useVisible((vi) => vi)

  const getClassName = (image, className, visibility) => {

    if (visibility > visibilityThreshold ) {
      if (loaded === false) {
        setLoaded(true)
        // console.log("set loaded TRUE")
      }
    }
    let r = className



    if ( image !== undefined && image.rotate !== undefined) {
      if (image.rotate === 180) {
        r += " rotate180"
      }
    }
    return r
  }

  const mediaType = ( url ) => {

    let extension = url.split('.').pop();
    extension = extension.toLowerCase();

    switch( extension ){
      case "png":
      case "jpg":
      case "jpeg":
        return "image"
      case "mov":
      case "mp4":
        return "video"
      default:
        return "unknown"
    }    
  }

  //  {/* (visibility > 0.01 ) */}

  return (

    <div ref={ targetRef } style={{backgroundColor:"#2D2D31", height:"100%"}} >
      {/* <img  className={ getClassName(image, className, visibility) } onClick={ onClick } src={ ((visibility > 0.01) || loaded) ? image.source_url : '' } /> */}
      
      { mediaType( image.source_url) === "video" ? 
      (
        <>
        { (visibility > 0.01 ) && 
        <VideoOnDemand className={ getClassName(image, className, visibility) }folder={image.dirname} item={ image.filename  }/>        
        }
        </>
      ) : (
        <img  className={ getClassName(image, className, visibility) } onClick={ onClick } src={ (visibility > visibilityThreshold ) ? image.source_url : '' } />
      )      
    }
      


      
    </div>

  )
}
