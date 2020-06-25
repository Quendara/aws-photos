import React from "react";

import Settings from "../Settings"
// import ImageListSimple from "./ImageListSimple";

import ImageGroup from "./ImageGroup"; // import without {}
import ImageGrid from "./ImageGrid";
import ImageMap from "./ImageMap";

import {MoveToTop} from "./MoveToTop";


const Images = ({ photos, view = "group", sortBy="date", ...rest }) => {
  
  const addSrcAndReduce = (images, size=200) => {

    // const reduceditems = images.slice(0, size) // reduce    

    return images.map((image) => {
      // image["source_url"] = Settings.baseS3Bucket + image.dirname + "/" + image.filename
      // image["src"] = image.id
      
      image["source_url"] = Settings.baseS3Bucket + image.dirname  + "/" + image.filename      
      image["src"] = image.id

      // swap width height when image is rotated
      if( image.orientation == "90CW" || image.orientation == "90CCW" ){
          const oldWidth = image.width 
          image.width = image.height
          image.height = oldWidth
      }
      
      if( image.width  === undefined ){
          console.error( "width is invalid : ", image.filename )
      }
      

      return image
    })
  }

  const currentPhotos = addSrcAndReduce(photos);

  const imageApp = (vw, sortBy) => {
    switch (vw) {
      case "grid":
        return (<ImageGrid view="grid" photos={ currentPhotos } sortBy={sortBy} paging={true} />)
      case "list":
        // the div cleans the stage when switching from grid to list
        return (<div><ImageGrid view="details" limit={ 10 } paging={true} photos={ currentPhotos } sortBy={sortBy}  /> </div>)
      case "group": 
        return (<ImageGroup photos={ currentPhotos} sortBy={sortBy}/>)
      case "map": 
        return (<ImageMap photos={ currentPhotos} sortBy={sortBy}/>)


        
      default:
        return (<div ><h1>View not specified</h1> </div>)
    }
  }

  return (
    <>
      <MoveToTop />
      { photos.length > 0 && <>{ imageApp(view, sortBy ) }</> }
    </>
  )
}



export { Images };
