
import React, { useState, useCallback } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import { useWindowSize } from "./useWindowSize"
import { CancelFilterArray } from "./CancelFilter";

import { ImageOnDemand } from "./ImageOnDemand";

import { Rating } from "./Rating"
import { sortPhotos } from "./helpers"
import { Icon } from "./Icons";


import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 

// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Grid, Box, Button } from "@material-ui/core";
import ImageCarousel from "./ImageCarousel";
import { Dialog, DialogContent, Card } from '@material-ui/core';
import { Clipboard } from "./Clipboard"


import AddCircleIcon from '@material-ui/icons/AddCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';


export const ImageListSimple = ({
  photos,
  sortBy,
  limit = 100,
  setRatingOnImage,
  setMetadataOnImage,
  token,              // from mapStateToProps
}) => {

  const [showDetails, setShowDetails] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(limit);

  const [cityClipboard, setCityClipboard] = useState("");
  const [countryClipboard, setCountryClipboard] = useState("");
  const [stateClipboard, setStateClipboard] = useState("");


  const [contextMenu, setContextMenu] = useState("");


  const getCaptionFromPhoto = (image) => {
    return (
      <div>
        <br />
        <Icon icon="day" /> { image.day } <Icon icon="dirname" className="ml-2" /> <span onClick={ () => setContextMenu("dirname") } className="grey">{ image.dirname } { image.dirname_physical }</span>
        { image.filename }
        <Box color="text.secondary" >{ image.id } </Box>
        <Box lineHeight={ 3 } fontSize="h6.fontSize" ><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></Box>
      </div>)
  }

  const getGpsInfoFromPhoto = (image) => {

    const copyToClipboardCTA = () => {
      setCountryClipboard(image.country)
      setStateClipboard(image.state)
      setCityClipboard(image.city)
    }

    const setLocationClipboardCTA = () => {
      updateMetadata("country", countryClipboard) // call callback 
      updateMetadata("state", stateClipboard) // call callback 
      updateMetadata("city", cityClipboard) // call callback     
    }    

    const updateMetadata = (what, value) => {

      if (value.length > 0) {
        console.log("Update '" + what + "' to '" + value + "' ImageID : " + image.id )
        if (value !== image[what]) {
          updateMetadataCallback(image.id, what, value)
        }
        else {
          console.log("No update needed, new and current is the same ", what)
        }
      }
      else {
        // CLOSE
      }
      setContextMenu("")
    }




    return (
      <div>
        { image.country !== "-" ? (
          <>
            <br />
            <Box lineHeight={ 1 } >
              <span className="mr-2" onClick={ () => setContextMenu("country") } >{ image.country }</span>
              <span onClick={ () => setContextMenu("state") } >{ image.state }</span>
              <p onClick={ () => setContextMenu("city") } className="grey" > { image.city }</p>
            </Box>
            <Box lineHeight={ 1 } color="text.secondary" >
              { image.lat }, { image.long }
            </Box>
            <FileCopyIcon onClick={ copyToClipboardCTA } />
          </>
        ) : (
            <AddCircleIcon onClick={ setLocationClipboardCTA } />
          ) }
      </div>)
  }



  // const openLightbox = useCallback((event, { photo, index }) => {
  //   setCurrentImage(index);
  //   setViewerIsOpen(true);
  // }, []);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const updateMetadataCallback = (id, what, newValue) => {

    // if (setRatingOnImage === undefined) {
    //   console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
    //   return;
    // }
    console.log("Update '" + what + "' to '" + newValue + "' ImageID : " + id)
    setMetadataOnImage(id, what, newValue, token.access)

  }

  const ratingCallback = (id, rating) => {

    if (setRatingOnImage === undefined) {
      console.error("ratingCallback - setRatingOnImage is undefined", id, rating)
    }
    console.log("ratingCallback", id, rating, setRatingOnImage)
    setRatingOnImage(id, rating, token.access)
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

  // const setLocation = ( ) => {
  //   set
  // }

  const imageList = photos.length ? (
    currentPhotos.map((image, index) => {
      return (
        <>
          <Grid xs={ 2 } >
            <ImageOnDemand style={ {} } onClick={ () => openLightbox(index) } className="responsive-img" image={ image } />
          </Grid>
          <Grid xs={ 1 } ></Grid>
          <Grid xs={ 4 } >
            { getCaptionFromPhoto(image) }
          </Grid>
          <Grid xs={ 1 } ></Grid>
          <Grid xs={ 4 } >
            { getGpsInfoFromPhoto(image) }
          </Grid>
        </>

      );
    })
  ) : (
      <p className="center">You have no images left</p>
    );

  return (
    <>
      { viewerIsOpen &&
        <Dialog open={ viewerIsOpen } fullScreen={ true } >
          <DialogContent style={ { height: "100vh", width: "100vw" } }>
            <ImageCarousel
              photos={ photos }
              closeCallback={ closeLightbox }
              currentIndex={ currentImage }
              updateMetadataCallback={ updateMetadataCallback }
              ratingCallback={ ratingCallback }
            />
          </DialogContent>
        </Dialog>
      }
      <>
        { countryClipboard.length > 0 &&
          <div style={ { position: "fixed", bottom: '2%', left: '25%', width: '35%', margin: "5%", zIndex: '1' } } className="image-carousel-text" >
            <Card>
              <Clipboard country={ countryClipboard } state={ stateClipboard } city={ cityClipboard } />
            </Card>
          </div>

        }

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start" >
          <Grid xs={ 12 } md={ 9 } >
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start" >

              { imageList }
            </Grid>
          </Grid>
        </Grid >
      </>
    </>

  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRatingOnImage, setMetadataOnImage }, dispatch)
}

const mapStateToProps = state => {

  // const photos = state.photos
  // const photos = filterFiles(state.photos, state.query)
  const token = state.token

  return { token } // photos:photos
}


export default connect(mapStateToProps, mapDispatchToProps)(ImageListSimple);
