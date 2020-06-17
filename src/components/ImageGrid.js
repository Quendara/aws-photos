import React, { useState, useCallback, useEffect, useRef } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";

import { Rating } from "./Rating"
import { sortPhotos } from "./helpers"


import { setRatingOnImage } from "../redux/actions"; // import default 
import Settings from "../Settings"

export const ImageGrid = ({ photos, limit = 10, paging = false, sortBy, setRatingOnImage, ...rest }) => {

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



  const getCaptionFromPhoto = (image) => {
    return (
      <div >
        { image.filename }
        <h5><Rating rating={ image.rating } id={ image.id } callback={ callbackLocal } ></Rating></h5>
        { image.year }
        <h5>{ image.country }</h5>
        { image.city }
      </div>)
  }

  const increaseLimit = () => {
    console.log("increaseLimit", currentLimit)
    if (+currentLimit > photos.length) {
      setCurrentLimit(photos.length)
    }
    setCurrentLimit(+currentLimit + 20)
  }

  const callbackLocal = (id, rating) => {

    if (setRatingOnImage === undefined) {
      console.error("callbackLocal - setRatingOnImage is undefined", id, rating)
    }
    console.log("callbackLocal", id, rating, setRatingOnImage)
    setRatingOnImage(id, rating)
  }

  const limitPhotosAndSort = (images, size = 999999, sortBy) => {

    console.log( "limitPhotosAndSort called" )
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
          <Gallery photos={ currentPhotos} onClick={ openLightbox } />
          <ModalGateway>
            { viewerIsOpen ? (
              <Modal onClose={ closeLightbox }>
                <Carousel
                  currentIndex={ currentImage }
                  views={ currentPhotos.map(x => ({
                    ...x,
                    srcset: x.srcSet,
                    caption: getCaptionFromPhoto(x)

                  })) }
                />
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

