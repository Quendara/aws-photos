
import React, { useState, useCallback } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import { ImageOnDemand } from "./ImageOnDemand";
import { Modal, ModalGateway } from "react-images";

import { Rating } from "./Rating"
import { sortPhotos } from "./helpers"

import { setRatingOnImage } from "../redux/actions"; // import default 
import ImageCarousel from "./ImageCarousel"


  

const ImageSimpleRow = ({ index, image, onClick, ratingCallback }) => {
    

  // const callbackImageLocal = (e) => callbackImage( e, {index, image  } )
  // const callbackImageLocal = (index) => {
  //   callbackImage( index )
  // }

  const callbackImageLocal = (e) => onClick(e, { index, image });


  return (

      <div className="row "  >
          <div className="col s6 m6 l3" onClick={callbackImageLocal}  >            
            <ImageOnDemand className="responsive-img" image={image} />
          </div>
          <div  className="col s6 m6 l9">
            <span className="badge">{ image.dirname } / { image.filename }</span>
            <h5>{ image.country }</h5>
            <h6>{ image.city }</h6>
            <h6>{ image.day }</h6>
            <h5><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }   ></Rating></h5>
            --{  image.width}x{image.height}--
          </div>
      </div>
  );
}

export const ImageListSimple = ({ photos, sortBy, limit=10, setRatingOnImage }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(limit);

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
    
    if( setRatingOnImage === undefined ){
      console.error("ratingCallback - setRatingOnImage is undefined", id, rating)
    }
    console.log("ratingCallback", id, rating, setRatingOnImage)
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


  const imageList = photos.length ? (
    currentPhotos.map((image, index) => {
      return (
        <div className="row " key={ image.id } >
          <ImageSimpleRow index={index} image={image} ratingCallback={ratingCallback} onClick={ openLightbox  } />
        </div>
      );
    })
  ) : (
      <p className="center">You have no images left</p>
    );

  return (
    <>
      { imageList }
      <ModalGateway>
        { viewerIsOpen ? (
          <Modal onClose={ closeLightbox }>
                <ImageCarousel
                  photos={ currentPhotos }
                  currentIndex={ currentImage }
                  closeCallback={ closeLightbox }
                  ratingCallback={ ratingCallback } />
            />
          </Modal>
        ) : null }
      </ModalGateway>
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRatingOnImage }, dispatch)
}

export default connect(null, mapDispatchToProps)(ImageListSimple);
