import React from "react";

import ImageGroup from "./ImageGroup"; // import without {}
import ImageGrid from "./ImageGrid";
import ImageMap from "./ImageMap";

// import {ImageToday} from "./ImageToday";

import {MoveToTop} from "./MoveToTop";
import { ImageListSimple } from "./ImageListSimple";


const Images = ({ photos, view = "group", sortBy="date", ...rest }) => {

  const currentPhotos = photos ; // addSrcAndReduce(photos);

  const imageApp = (vw, sortBy) => {
    switch (vw) {
      case "grid":
        return (<ImageGrid view="grid" photos={ currentPhotos } sortBy={sortBy} paging={true} />)
      case "list":
        // the div cleans the stage when switching from grid to list
        return (<div><ImageListSimple view="details" limit={ 10 } paging={true} photos={ currentPhotos } sortBy={sortBy}  /> </div>)
      case "group": 
        return (<ImageGroup photos={ currentPhotos} sortBy={sortBy}/>)
      case "map": 
        return (<ImageMap photos={ currentPhotos} sortBy={sortBy}/>)
      case "menu": 
        return (<span></span>)


      // case "today": 
      //   return (<ImageToday photos={ currentPhotos} sortBy={sortBy}/>)
        
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
