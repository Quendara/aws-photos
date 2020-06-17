
import React from "react";
import { useVisible } from 'react-hooks-visible'


    
// className={isVisible ? 'excited' : ''}
 // 
export const ImageOnDemand = ({ image, className }) => {
    // Boolean. This example is 50% visible.
    // const [targetRef, visible] = useVisible()
    // Boolean. This example is 50% visible.
    const [targetRef, isVisible] = useVisible((vi: number) => vi > 0.02)


  
    return (
      <img ref={targetRef} className={className} src={isVisible ? image.source_url : ''} />
    )
  }
    