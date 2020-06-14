import React, { useState, useCallback } from "react";
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";

import Settings from "../Settings"
import { ImageListSimple } from "./ImageListSimple";
import { ImageGroup } from "./ImageGroup";
import { ImageGrid } from "./ImageGrid";

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
        return (<ImageGrid photos={ addSrcAndReduce(photos, 20) } />)
        break;
      case "list":
        return (<ImageListSimple photos={ addSrcAndReduce(photos, 20) } />)
        break;
      case "group":
        return (<ImageGroup photos={ addSrcAndReduce(photos) } />)
        break;
      default:
        return (<div ><h1>View not specified</h1> </div>)
        break;
    }
  }

  return (
    <>
      { photos.length > 0 && <>{ imageApp(view) }</> }
    </>
  )
}



export { Images };
