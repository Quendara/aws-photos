import React, { useState, useEffect } from "react";
import { Rating } from "./Rating"
import { useSwipeable } from "react-swipeable";
import { ImageOnDemand } from "./ImageOnDemand";

import { TopList } from "./TopList";


import { Icon } from "./Icons";
import { values } from "underscore";

export const ImageCarousel = ({ photos, currentIndex, closeCallback, ratingCallback, updateMetadataCallback }) => {

    // ratingCallback(photo.id, newRating);
    // updateMetadataCallback(photo.id, what, newValue );

    const [index, setIndex] = useState(currentIndex);
    const [contextMenu, setContextMenu] = useState("");

    const [cityClipboard, setCityClipboard] = useState("");
    const [countryClipboard, setCountryClipboard] = useState("");
    const [stateClipboard, setStateClipboard] = useState("");

    const getCaptionFromPhoto = (image) => {
        return (
            <div >
                { image.filename }
                <h5><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></h5>
                <Icon icon="day" /> { image.day } - <span className="grey-text">{ image.dirname_physical }</span>

                <h5>
                    <span className="mr-2" onClick={ () => setContextMenu("country") } >{ image.country }</span>
                    <span onClick={ () => setContextMenu("state") } >{ image.state }</span>
                </h5>
                <p onClick={ () => setContextMenu("city") } className="grey-text" > { image.city }</p>
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
                setDeleted();
                break;
            case 'm':
                setMissing();
                break;
            case 27:
            case 'Escape':
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
            case 'c':
                setCountryClipboard(photo.country)
                setStateClipboard(photo.state)
                setCityClipboard(photo.city)
                break;
            case 'v':
                updateMetadata("country", countryClipboard) // call callback 
                updateMetadata("state", stateClipboard) // call callback 
                updateMetadata("city", cityClipboard) // call callback 
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

    const updateMetadata = (what, value) => {

        if (value.length > 0) {
            // console.log("Update '" + what + "' to '" + value + "' ImageID : " + photo.id )
            updateMetadataCallback(photo.id, what, value)
        }
        else {
            // CLOSE
        }
        setContextMenu("")
    }

    const contextMenuFcn = () => {

        return (
            <>
                { countryClipboard.length > 0 &&
                    <p className="blue" >
                        <h3>Clipboard</h3>                        
                        <h5>
                            <span className="m-2">{ countryClipboard.length > 0 && <>{ countryClipboard }</> }                </span>
                            <span className="m-2">{ stateClipboard.length > 0 && <>{ stateClipboard }</> }</span>
                        </h5>
                        { cityClipboard.length > 0 && <>{ cityClipboard }</> }
                    </p>
                }

                { contextMenu.length > 0 &&
                    <TopList rendering="collection" photos={ photos } title={ contextMenu } icon={ contextMenu } limit="12" sortByCount={ true } callback={ updateMetadata } />
                }
            </>
        )
    }

    return (
        <div className="responsive-carousel-bg" >
            <div { ...handlers } >
                <ImageOnDemand
                    image={ photo }
                    className="responsive-carousel"
                    alt={ photo.title } />

            </div>

            <div style={ { top: '0px', right: '20px' } } className="image-carousel grey-text text-darken-5" onClick={ closeCallback } ><h3><Icon icon="close" /></h3> </div>
            <div style={ { top: '43%', left: '20px' } } className="image-carousel grey-text text-darken-5" onClick={ previousImage } ><h3><Icon icon="arrow-left" /></h3> </div>
            <div style={ { top: '43%', right: '20px' } } className="image-carousel offset-s10 s1 grey-text text-darken-5" onClick={ nextImage } ><h3><Icon icon="arrow-right" /></h3> </div>


            <div style={ { bottom: '2%', left: '20%', width: '30%' } } className="image-carousel-text" >
                { contextMenuFcn() }
            </div>

            <div style={ { top: '80%', left: '20px' } } className="image-carousel-text" >
                { getCaptionFromPhoto(photo) }

            </div>

            <div style={ { top: '90%', right: '20px' } } className="image-carousel" >
                <a className="btn red m-2" onClick={ setDeleted } >Delete</a>
                <a className="btn blue m-2" onClick={ setMissing }  >Missing</a>
                <h5 className="grey-text text-darken-5 right-align" ><b>{ index + 1 } / { photos.length }</b></h5>
            </div>
        </div>
    )
}