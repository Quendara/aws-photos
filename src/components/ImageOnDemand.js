import React from "react";
import { useVisible } from 'react-hooks-visible'


// className={isVisible ? 'excited' : ''}
 // 
export const ImageOnDemand = ({ image, className }) => {
    // Boolean. This example is 50% visible.
    // const [targetRef, visible] = useVisible()
    // Boolean. This example is 50% visible.
    const [targetRef, isVisible] = useVisible((vi: number) => vi > 0.02)
    let loaded = false;

    const getSrcUrlWhenVisible = (isVisible) => {
        if( isVisible || loaded ){
          loaded = true          
          console.log( "LOADED : ", image.source_url, isVisible, loaded )          
          return image.source_url;          
        }
        // console.log( "EMPTY : ", image.source_url, isVisible, loaded )
        return ""
    }

    // <img ref={targetRef} className={className} src={ isVisible ? image.source_url : ''} />  
    // <img ref={targetRef} className={className} src={ getSrcUrlWhenVisible( isVisible, loaded ) } />
    return (
        <img ref={targetRef} className={className} src={ isVisible ? image.source_url : ''} />
    )
  }
    