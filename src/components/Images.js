import React from "react";

import Settings from "../Settings"
import ImageListSimple from "./ImageListSimple";
import ImageGroup from "./ImageGroup";
import ImageGrid from "./ImageGrid";

const Images = ({ photos, view = "group", sortBy="date", ...rest }) => {
  const addSrcAndReduce = (images, size=999999) => {

    const reduceditems = images.slice(0, size) // reduce    

    return reduceditems.map((image) => {
      image["src"] = Settings.baseS3Bucket + image.dirname + "/" + image.filename

      if( image.orientation == "90CW" || image.orientation == "90CCW" ){
          const oldWidth = image.width 
          image.width = image.height
          image.height = oldWidth
      }

      return image
    })
  }

  const imageApp = (vw, sortBy) => {
    switch (vw) {
      case "grid":
        return (<ImageGrid photos={ addSrcAndReduce(photos) } sortBy={sortBy} paging={true} />)
      case "list":
        return (<ImageListSimple photos={ addSrcAndReduce(photos, 20) } sortBy={sortBy}  />)
      case "group":
        return (<ImageGroup photos={ addSrcAndReduce(photos) } sortBy={sortBy}/>)
      default:
        return (<div ><h1>View not specified</h1> </div>)
    }
  }

  return (
    <>
      { photos.length > 0 && <>{ imageApp(view, sortBy ) }</> }
    </>
  )
}



export { Images };
