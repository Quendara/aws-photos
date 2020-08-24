import React, { useState } from "react";
import { useVisible } from 'react-hooks-visible'


// className={isVisible ? 'excited' : ''}
// 
export const ImageOnDemand = ({ image, className, onClick }) => {
  // Boolean. This example is 50% visible.
  // const [targetRef, visible] = useVisible()
  // Boolean. This example is 50% visible.
  // const [targetRef, isVisible] = useVisible((vi: number) => vi > 0.02)

  // Percent value.
  // const [targetRef, visibility] = useVisible()    
  const [isVisibleState, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [targetRef, visibility] = useVisible((vi) => vi)

  // let loaded = false;

  // const getSrcUrlWhenVisible = (isVisible) => {
  //     if( isVisible || loaded ){
  //       loaded = true          
  //       console.log( "LOADED : ", image.source_url, isVisible, loaded )          
  //       return image.source_url;          
  //     }
  //     // console.log( "EMPTY : ", image.source_url, isVisible, loaded )
  //     return ""
  // }

  const getClassName = (image, className, visibility) => {

    if (visibility > 0.01) {
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



  // <img ref={targetRef} className={className} src={ isVisible ? image.source_url : ''} />  
  // <img ref={targetRef} className={className} src={ getSrcUrlWhenVisible( isVisible, loaded ) } />
  return (

    <div ref={ targetRef } style={{backgroundColor:"#2D2D31", height:"100%"}} >
      <img  className={ getClassName(image, className, visibility) } onClick={ onClick } src={ ((visibility > 0.01) || loaded) ? image.source_url : '' } />
      {/* <div  className={ getClassName( image, className, visibility ) }> x {visibility}</div> */ }
    </div>
      
    

  )
}
