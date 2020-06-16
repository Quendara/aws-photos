import React, { useState, useCallback, useEffect, useRef  } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";
import { Rating } from "./Rating"

import { setRatingOnImage } from "../redux/actions"; // import default 
import Settings from "../Settings"

export const ImageGrid = ({ photos, limit=10, paging=false,  ...rest }) => {

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


  const limitPhotos = (images, size=999999) => {
    return images.slice(0, size) // reduce    
  }  

  const getCaptionFromPhoto = ( image ) => {
    return ( 
      <div >
        { image.filename }
        <Rating rating={image.rating}></Rating>
        { image.year }
      </div> )
  }

  const increaseLimit = ( ) => {
    console.log( "increaseLimit", currentLimit )
    setCurrentLimit( +currentLimit + 20 )
  }


  return (
    <>
      { photos.length > 0 && <>

        <div>            
            <Gallery photos={ limitPhotos( photos, currentLimit) } onClick={ openLightbox } />
            <ModalGateway>
              { viewerIsOpen ? (
                <Modal onClose={ closeLightbox }>
                  <Carousel
                    currentIndex={ currentImage }
                    views={ limitPhotos( photos, currentLimit * 3).map(x => ({
                      ...x,
                      srcset: x.srcSet,
                      caption: getCaptionFromPhoto( x )

                    })) }
                  />
                </Modal>
              ) : null }
            </ModalGateway>
            
            { paging && <>
            <div className="col offset-s3 s6 btn grey darker-2 m-2" onClick={increaseLimit} >  more </div><span className="blue-text" >{currentLimit}</span></> }
          </div>
      
      </> }
    </>
  )
}



const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRatingOnImage }, dispatch)
}

export default connect(null, mapDispatchToProps)(ImageGrid);

