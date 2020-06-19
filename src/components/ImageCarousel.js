import React, { useState, useCallback, useEffect, useRef } from "react";
import { Rating } from "./Rating"
import { useSwipeable } from "react-swipeable";

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
                <p className="grey-text" > { image.city }</p>
            </div>)
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => nextImage(),
        onSwipedRight: () => previousImage(),
        onSwipedUp: () => increaseRating(),
        onSwipedDown: () => decreaseRating(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const handleKeyPress = (event) => {

        switch (event.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                ratingCallback(photo.id, event.key);
                break;
            case 'd':
                setDeleted(photo.id, event.key);
                break;
            case 'm':
                setMissing(photo.id, event.key);
                break;
            case 27:
                closeCallback()
                break;
            case 'ArrowUp':
                increaseRating()
                break;
            case 'ArrowDown':
                decreaseRating()
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

    const setMissing = () => {
        const newRating = -10
        ratingCallback(photo.id, newRating);
    }

    const setDeleted = () => {
        const newRating = -1
        ratingCallback(photo.id, newRating);
    }

    const increaseRating = () => {
        const newRating = photo.rating + 1
        if (newRating <= 5) { // prevent to access negative arr
            ratingCallback(photo.id, newRating);
        }
    }
    const decreaseRating = () => {
        const newRating = photo.rating - 1
        if (newRating > 0) { // prevent to access negative arr
            ratingCallback(photo.id, newRating);
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
        if (newIndex >= 0) {
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
            <div { ...handlers } >
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

            <div style={ { top: '90%', right: '20px' } } className="image-carousel" >
                <a className="btn red m-2" onClick={ setDeleted } >Delete</a>
                <a className="btn blue m-2" onClick={ setMissing }  >Missing</a>
                <h5 className="grey-text text-darken-5 right-align" ><b>{ index + 1 } / { photos.length }</b></h5>
            </div>
        </>
    )
}