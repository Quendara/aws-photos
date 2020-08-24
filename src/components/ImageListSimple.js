
import React, { useState, useCallback } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import { useWindowSize } from "./useWindowSize"
import { CancelFilterArray } from "./CancelFilter";

import { ImageOnDemand } from "./ImageOnDemand";

import { Rating } from "./Rating"
import { sortPhotos } from "./helpers"
import { Icon } from "./Icons";


import { setRatingOnImage } from "../redux/actions"; // import default 

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Grid, Box, Button } from "@material-ui/core";






export const ImageListSimple = ({ photos, sortBy, limit = 10, setRatingOnImage }) => {

  const getCaptionFromPhoto = (image) => {
    return (
        <div>
            { showDetails &&
                <>
                    <br/>
                    <Icon icon="day" /> { image.day } <Icon icon="dirname" className="ml-2" /> <span onClick={ () => setContextMenu("dirname") } className="grey">{ image.dirname } { image.dirname_physical }</span>
                    { image.filename }
                    <Box color="text.secondary" >{ image.id } </Box>

                    <Box lineHeight={ 3 } fontSize="h6.fontSize" ><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></Box>  
                    <Box lineHeight={ 1 } >
                        <span className="mr-2" onClick={ () => setContextMenu("country") } >{ image.country }</span>
                        <span onClick={ () => setContextMenu("state") } >{ image.state }</span>
                        <p onClick={ () => setContextMenu("city") } className="grey" > { image.city }</p>
                    </Box>
                    
  
                    {/* 
                    <CancelFilterArray value={ image.faces } filter="faces" callback={ removeFace } />
                    <Button variant="outlined" className="ml-2" onClick={ () => searchFacesOnImageLocal(image) } >search faces</Button> */}
                </>
            }
        </div>)
  }


  const [showDetails, setShowDetails] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(limit);
  const [contextMenu, setContextMenu] = useState("");

  const size = useWindowSize();

  

  // const openLightbox = useCallback((event, { photo, index }) => {
  //   setCurrentImage(index);
  //   setViewerIsOpen(true);
  // }, []);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const ratingCallback = (id, rating) => {

    if (setRatingOnImage === undefined) {
      console.error("ratingCallback - setRatingOnImage is undefined", id, rating)
    }
    console.log("ratingCallback", id, rating, setRatingOnImage)
    setRatingOnImage(id, rating)
  }

  const limitPhotosAndSort = (images, size = 999999, sortBy) => {

    console.log("limitPhotosAndSort called")
    images = sortPhotos(images, sortBy)

    if (+currentLimit > photos.length) {
      setCurrentLimit(photos.length)
    }
    return images.slice(0, size) // reduce    
  }

  // 
  const currentPhotos = limitPhotosAndSort(photos, currentLimit, sortBy);

  const imageList = photos.length ? (
    currentPhotos.map((image, index) => {
      return (
        <>
          <Grid xs={ 4 } >
            <ImageOnDemand style={ {} } className="responsive-img" image={ image } />
          </Grid>
          <Grid xs={ 1 } ></Grid>
          <Grid xs={ 6 } >
            { getCaptionFromPhoto( image ) }
        </Grid>
        </>

      );
    })
  ) : (
      <p className="center">You have no images left</p>
    );

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="flex-start" >
      <Grid xs={ 9 } >
        <Grid
          container
          direction="row"
          justify="center"          
          alignItems="flex-start" >

          { imageList }
        </Grid>
      </Grid>
    </Grid >

  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRatingOnImage }, dispatch)
}

export default connect(null, mapDispatchToProps)(ImageListSimple);
