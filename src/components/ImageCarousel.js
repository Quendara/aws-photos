import React, { useState, useCallback, useEffect, useRef } from "react";
import { Rating } from "./Rating"

import { ImageOnDemand } from "./ImageOnDemand";
import { Icon } from "./Icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const ImageCarousel = ({ photos, currentIndex, closeCallback, ratingCallback }) => {

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
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                ratingCallback(photo.id, event.key);
                break;
            case 27:
                closeCallback()
                break;
            case 'ArrowRight':
                nextImage()
                break;
            case 'ArrowLeft':
                previousImage()
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

            <div style={ { top: '0px', right: '20px' } } className="image-carousel grey-text text-darken-5" onClick={ closeCallback } ><h3><Icon icon="close" /></h3> </div>

            <div style={ { top: '43%', left: '20px' } } className="image-carousel grey-text text-darken-5" onClick={ previousImage } ><h3><Icon icon="arrow-left" /></h3> </div>
            <div style={ { top: '43%', right: '20px' } } className="image-carousel offset-s10 s1 grey-text text-darken-5" onClick={ nextImage } ><h3><Icon icon="arrow-right" /></h3> </div>

            <div style={ { top: '80%', left: '20px' } } className="image-carousel-text" >
                { getCaptionFromPhoto(photo) }
            </div>

            <div style={ { top: '80%', right: '20px' } } className="image-carousel" >
                <h5 className="grey-text text-darken-5 right-align" ><b>{ index + 1 } / { photos.length + 1 }</b></h5>
            </div>
        </>
    )
}