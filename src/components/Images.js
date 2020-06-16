import React, { useState, useCallback } from "react";

import Settings from "../Settings"
import ImageListSimple from "./ImageListSimple";
import ImageGroup from "./ImageGroup";
import ImageGrid from "./ImageGrid";

const Images = ({ photos, view, ...rest }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const addSrcAndReduce = (images, size=999999) => {

    const reduceditems = images.slice(0, size) // reduce    

    return reduceditems.map((image) => {
      image["src"] = Settings.baseS3Bucket + image.dirname + "/" + image.filename
      return image
    })
  }

  const imageApp = (vw) => {
    switch (vw) {
      case "grid":
        return (<ImageGrid photos={ addSrcAndReduce(photos) } paging={true} />)
      case "list":
        return (<ImageListSimple photos={ addSrcAndReduce(photos, 20) }  />)
      case "group":
        return (<ImageGroup photos={ addSrcAndReduce(photos) } />)
      default:
        return (<div ><h1>View not specified</h1> </div>)
    }
  }

  return (
    <>
      { photos.length > 0 && <>{ imageApp(view) }</> }
    </>
  )
}



export { Images };
