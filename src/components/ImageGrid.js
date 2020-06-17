import React, { useState, useCallback, useEffect, useRef } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";

import { Rating } from "./Rating"
import { sortPhotos } from "./helpers"

import ImageGridImage from "./ImageGridImage"
import { ImageCarousel } from "./ImageCarousel"



import { setRatingOnImage } from "../redux/actions"; // import default 
import Settings from "../Settings"


export const ImageGrid = ({ photos, limit = 100, paging = false, sortBy, setRatingOnImage, ...rest }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(limit);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  // useCallback
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



  const increaseLimit = () => {
    console.log("increaseLimit", currentLimit)
    if (+currentLimit > photos.length) {
      setCurrentLimit(photos.length)
    }
    setCurrentLimit(+currentLimit + 20)
  }

  const ratingCallback = (id, rating) => {

    if (setRatingOnImage === undefined) {
      console.error("callbackLocal - setRatingOnImage is undefined", id, rating)
    }
    console.log("callbackLocal", id, rating, setRatingOnImage)
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


  return (
    <>
      { photos.length > 0 && <>

        <div>
          <Gallery photos={ currentPhotos } renderImage={ imageRenderer } onClick={ openLightbox } />
          <ModalGateway>
            { viewerIsOpen ? (
              <Modal onClose={ closeLightbox }>
                <ImageCarousel photos={ currentPhotos } currentIndex={ currentImage } closeCallback={closeLightbox} ratingCallback={ratingCallback} />

              </Modal>
            ) : null }
          </ModalGateway>

          { paging && <>
            <div className="col offset-s3 s6 btn grey darker-2 m-2" onClick={ increaseLimit } >  more </div><span className="blue-text" >{ currentLimit } / { photos.length }</span></> }
        </div>

      </> }
    </>
  )
}



const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRatingOnImage }, dispatch)
}

export default connect(null, mapDispatchToProps)(ImageGrid);

