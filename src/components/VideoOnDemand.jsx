import React, { useState } from "react";
import { useVisible } from 'react-hooks-visible'


// className={isVisible ? 'excited' : ''}
// 
export const VideoOnDemand = ({ image, className, onClick, visibilityThreshold = 0.01 }) => {
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

  return (

    <div ref={ targetRef } style={{backgroundColor:"#2D2D31", height:"100%"}} >
      
      <img  className={ getClassName(image, className, visibility) } onClick={ onClick } src={ (visibility > 0.01 ) ? image.source_url : '' } />
      
    </div>

  )
}
