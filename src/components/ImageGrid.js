import React, { useState, useCallback } from "react";
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";
import Settings from "../Settings"

export const ImageGrid = ({ photos, view, ...rest }) => {

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

  return (
    <>
      { photos.length > 0 && <>

        <div>
            <Gallery photos={ photos } onClick={ openLightbox } />
            <ModalGateway>
              { viewerIsOpen ? (
                <Modal onClose={ closeLightbox }>
                  <Carousel

                    currentIndex={ currentImage }
                    views={ photos.map(x => ({
                      ...x,
                      srcset: x.srcSet,
                      caption: x.title,

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




