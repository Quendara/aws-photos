import React, { useState, useCallback } from "react";
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";

import Settings from "../Settings"

export const ImageGrid = ({ photos, limit=10,  ...rest }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const customStyles = {

    view: () => ({
      // none of react-images styles are passed to <View />

      width: "190vh",
      height: "190vh",
    }),
  }

  const limitPhotos = (images, size=999999) => {

    return images.slice(0, size) // reduce    

 
  }  

  return (
    <>
      { photos.length > 0 && <>

        <div>
            <Gallery photos={ limitPhotos( photos, limit) } onClick={ openLightbox } />
            <ModalGateway>
              { viewerIsOpen ? (
                <Modal onClose={ closeLightbox }>
                  <Carousel

                    currentIndex={ currentImage }
                    views={ photos.map(x => ({
                      ...x,
                      srcset: x.srcSet,
                      caption: x.filename,

                    })) }
                  />
                </Modal>
              ) : null }
            </ModalGateway>
          </div>
      
      </> }
    </>
  )
}




