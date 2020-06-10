import React, { useState, useCallback } from "react";
import Gallery from 'react-photo-gallery';
import { SimpleImageList } from "./components/SimpleImageList";
import Carousel, { Modal, ModalGateway } from "react-images";
import Settings from "./Settings"


const Images = ({ photos, view, ...rest }) => {

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

  const addSrcAndReduce = (images) => {

    const reduceditems = images.slice(0, 15) // reduce

    return reduceditems.map((image) => {
      image["src"] = Settings.baseS3Bucket + "thumbs/" + image.filename
      return image
    })
  }

  const imageApp = view === "grid" ? (
    <div>
        <Gallery photos={addSrcAndReduce(photos)} onClick={openLightbox} />
        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel

                currentIndex={currentImage}
                views={addSrcAndReduce(photos).map(x => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.title,

                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    
  ) : (
    <SimpleImageList photos={addSrcAndReduce(photos)} />
      
    )

  return (
    <>
      {photos.length > 0 && <>{ imageApp }</>
      }
    </>
  )
}



export { Images };
