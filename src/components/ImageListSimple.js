
import React, { useState } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import Carousel, { Modal, ModalGateway } from "react-images";

import { Rating } from "./Rating"
import { setRatingOnImage } from "../redux/actions"; // import default 

export const ImageListSimple = ({ photos, photosState, setRatingOnImage }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = index => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const getCaptionFromPhoto = (image) => {
    return (
      <div >
        { image.filename }
        <Rating rating={ image.rating }></Rating>
        { image.year }
      </div>)
  }

  const callbackLocal = (id, rating) => {
    
    if( setRatingOnImage === undefined ){
      console.error("callbackLocal - setRatingOnImage is undefined", id, rating)
    }
    console.log("callbackLocal", id, rating, setRatingOnImage)
    setRatingOnImage(id, rating)
  }

  const imageList = photos.length ? (
    photos.map((image, index) => {
      return (
        <div className="row " key={ image.id } >
          <div className="col s6 m2" onClick={ () => openLightbox(index) } >
            <img className="responsive-img" src={ image.src } />
          </div>
          <div className="col s6 m10">
            <span className="badge">{ image.dirname } / { image.filename }</span>
            <h5>{ image.country }</h5>
            <h6>{ image.city }</h6>
            <h6>{ image.day }</h6>
            <Rating rating={ image.rating } id={ image.id } callback={ callbackLocal } ></Rating>
          </div>
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
            <Carousel
              currentIndex={ currentImage }
              views={ photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: getCaptionFromPhoto(x)

              })) }
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
