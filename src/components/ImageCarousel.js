import React, { useState, useCallback, useEffect, useRef } from "react";
import { Rating } from "./Rating"

import { ImageOnDemand } from "./ImageOnDemand";
import { Icon } from "./Icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const ImageCarousel = ({ photos, currentIndex, closeCallback, ratingCallback  }) => {

    const [index, setIndex] = useState(currentIndex);

    const getCaptionFromPhoto = (image) => {
        return (
            <div >
                { image.filename }
                <h5><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></h5>
                { image.year }
                <h5>{ image.country }</h5>
                { image.city }

            --{  image.width }x{image.height }--
            </div>)
    }

    const handleKeyPress = (event) => {



        switch (event.key) {
            case 1:
            case 2:
            case 3:
            case 5:
            case 5:
                ratingCallback( photo.id, event.key  );
                break;
            case 27:
                closeCallback()
                break;
            case 'ArrowRight':
                nextImage()
                break;
            case 'ArrowLeft':
                nextImage()
                break;


            default:
                console.log('key pressed here !! ' + event.key)
        }

        if (event.key === 27) {

        }
    }



    const nextImage = () => {
        const newIndex = index + 1
        if (newIndex < photos.length) { // prevent to access negative arr
            setIndex(index + 1)
        }

    }
    const previousImage = () => {
        const newIndex = index - 1 // prevent to access out of range arr
        if (newIndex > 0) {
            setIndex(newIndex)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress, false);

        return () => {
            document.removeEventListener("keydown", handleKeyPress, false);
        };
    });

    const photo = photos[index]

    return (
        <>
            <div >
                <ImageOnDemand
                    image={ photo }
                    className="responsive-carousel"
                    alt={ photo.title } />
            </div>

            <div className="image-carousel"  >
                <div className="row"  >
                    <div className="col offset-s11 s1 grey-text" onClick={ closeCallback } ><h1><Icon icon="close" /></h1> </div>
                </div>
            </div>

            <div className="image-carousel" style={ { top: '45%' } } >
                <div className="row"  >
                    <div className="col s1 grey-text" onClick={ previousImage } ><h1><Icon icon="arrow-left" /></h1> </div>
                    <div className="col offset-s10 s1 grey-text" onClick={ nextImage } ><h1><Icon icon="arrow-right" /></h1> </div>
                </div>
            </div>

            <div className="image-carousel" style={ { top: '80%' } }>
                <div className="row"  >

                    <div className="col s5">
                        { getCaptionFromPhoto(photo) }
                    </div>
                    <div className="col offset-s5 s2">
                        <span className="grey-text" >{ index + 1 } / { photos.length + 1 }</span>
                    </div>

                </div>
            </div>
        </>
    )
}