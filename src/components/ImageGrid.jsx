import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { useVisible } from 'react-hooks-visible'

import Gallery from 'react-photo-gallery';
import { Modal, ModalGateway } from "react-images";

import { ImageGridImage } from "./ImageGridImage"
import ImageCarousel from "./ImageCarousel"

import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent } from '@material-ui/core';



// import Settings from "../Settings"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 900,
      height: 450,
    },
  }),
);

const ImageGrid = ({
  photos,
  limit = 999,
  paging = false,
  view = "grid",
  sortBy,
  setRatingOnImage,   // from mapDispatchToProps
  setMetadataOnImage, // from mapDispatchToProps
  token }) => {


  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(limit);
  const increaseValue = 30

  const [targetRef, isVisible] = useVisible((vi: number) => {
    return vi > 0.02
  })

  // updated in limitPhotosAndSort
  let currentRenderer = undefined

  const openLightbox = useCallback((event, { index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };



  const imageRenderer = (
    ({ index, left, top, key, photo, onClick }) => (
      <ImageGridImage
        selected={ false }
        onClick={ onClick }
        key={ key }
        margin={ "2px" }
        index={ index }
        photo={ photo }
        left={ left }
        top={ top }
      />
    )
  );

  const imageRendererDetails = (
    ({ index, left, top, key, photo, onClick }) => (
      <ImageGridImage
        selected={ false }
        onClick={ onClick }
        key={ key }
        view="details"
        ratingCallback={ ratingCallback }
        margin={ "2px" }
        index={ index }
        photo={ photo }
        left={ left }
        top={ top }
      />
    )
  );

  useEffect(() => {
    if (isVisible === true) {
      console.log("loadMore .. increaseLimit ... ")
      increaseLimit()
    }
  })

  const increaseLimitImpl = () => {
    console.log("increaseLimit", currentLimit)

    const newLimit = +currentLimit + increaseValue;
    if (newLimit > photos.length) {
      setCurrentLimit(photos.length)
    }
    else {
      // increase limit when possible
      setCurrentLimit(newLimit)
    }

  }


  const increaseLimit = () => {

    setTimeout(() => {
      increaseLimitImpl()
    }, 200);

  }

  // could be replaced by updateMetadataCallback
  const ratingCallback = (id, rating) => {

    if (setRatingOnImage === undefined) {
      console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
      return;
    }
    console.log("callbackLocal", id, rating, setRatingOnImage)
    setRatingOnImage(id, rating, token.access)

  }

  const updateMetadataCallback = (id, what, newValue) => {

    // if (setRatingOnImage === undefined) {
    //   console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
    //   return;
    // }
    console.log("Update '" + what + "' to '" + newValue + "' ImageID : " + id)
    setMetadataOnImage(id, what, newValue, token.access)

  }

  const limitPhotosAndSort = (images, size = 999999) => {

    // console.log("limitPhotosAndSort called, size : ", size)

    let retImages = images

    if (view === "details") {
      currentRenderer = imageRendererDetails
      retImages = images.map((image) => {
        return Object.assign({}, image, {
          width: image.width * 2
        })
      })
    }
    else {
      currentRenderer = imageRenderer
    }


    // limit
    if (+currentLimit > photos.length) {
      setCurrentLimit(photos.length)
    }
    return retImages.slice(0, size) // reduce    
  }

  // 
  const currentPhotos = limitPhotosAndSort(photos, currentLimit, sortBy);

  const showPaging = (photos) => {

    // Hide more button when all images loaded!
    if (currentLimit === photos.length) {
      return false;
    }
    return paging
  }

  // targetRowHeight={170} 
  // <h6> EBUG # {photos.length }, {currentPhotos.length} {currentLimit}</h6>
  // { viewerIsOpen ? (
  //   ) : (  

  return (
    <>
      { photos.length > 0 &&
        <>
            <Dialog open={ viewerIsOpen } fullScreen={ true } >
              <DialogContent style={ { height: "100vh", width: "100vw" } }>
                <ImageCarousel
                  photos={ photos }
                  currentIndex={ currentImage }
                  closeCallback={ closeLightbox }
                  ratingCallback={ ratingCallback }
                  updateMetadataCallback={ updateMetadataCallback } />
              </DialogContent>
            </Dialog>

            <Gallery photos={ currentPhotos } renderImage={ currentRenderer } onClick={ openLightbox } />
            { showPaging(photos) && <>
              <div ref={ targetRef } className="col offset-s3 s6 btn grey darker-2 m-2" onClick={ increaseLimit } >  more </div><span className="blue-text" >{ currentLimit } / { photos.length }</span>
            </>
            }          
        </> }
    </>
  )
}


const mapStateToProps = state => {

  // const photos = state.photos
  // const photos = filterFiles(state.photos, state.query)
  const token = state.token

  return { token } // photos:photos
}


const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRatingOnImage, setMetadataOnImage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageGrid);
// export default connect(null, mapDispatchToProps)(ImageGrid);

