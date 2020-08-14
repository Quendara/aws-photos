import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


import { Rating } from "./Rating"
import { useSwipeable } from "react-swipeable";
import { ImageOnDemand } from "./ImageOnDemand";

import { TopList } from "./TopList";
import { TopAutoComplete } from "./TopAutoComplete";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/Card';

import { Icon } from "./Icons";
import { addSrcAndDirname } from "./helpers";

// import { values } from "underscore";

const ImageCarousel = ({ 
    photos, 
    all_photos, // from redux
    currentIndex,
    closeCallback,
    ratingCallback, 
    updateMetadataCallback }) => {



    // ratingCallback(photo.id, newRating);
    // updateMetadataCallback(photo.id, what, newValue );

    const [index, setIndex] = useState(currentIndex);
    const [contextMenu, setContextMenu] = useState("");
    const [cityClipboard, setCityClipboard] = useState("");
    const [countryClipboard, setCountryClipboard] = useState("");
    const [stateClipboard, setStateClipboard] = useState("");

    const printQuery = (query) => {
        if (typeof query === "object") {
            return query.join(", ")
        }
    }

    const getCaptionFromPhoto = (image) => {
        return (
            <div >

                <p className="grey-text">{ image.id } </p>
                { image.filename }
                <h5><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></h5>
                <Icon icon="day" /> { image.day } - <span onClick={ () => setContextMenu("dirname") } className="grey-text">{ image.dirname } - { image.dirname_physical }</span>

                <h5>
                    <span className="mr-2" onClick={ () => setContextMenu("country") } >{ image.country }</span>
                    <span onClick={ () => setContextMenu("state") } >{ image.state }</span>
                </h5>
                <p onClick={ () => setContextMenu("city") } className="grey-text" > { image.city }</p>

                <button className="btn red m-2"  >{ printQuery(image.faces) }</button>
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

        if( contextMenu.length > 0 ){
            console.log( "handleKeyPress events blocked, to avoid actions!" )
            return;
        }

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

    const currentPhoto = ( photos, index ) => {
        if( photos.length === 0 ){ alert("Oh no" ); return undefined }
        if( index >= photos.length ){
            index = photos.length-1
            setIndex( index )
        }
        return photos[index]
    }

    const photo = currentPhoto( photos, index )

    const updateMetadata = (what, value) => {

        if (value.length > 0) {
            // console.log("Update '" + what + "' to '" + value + "' ImageID : " + photo.id )
            if (value !== photo[what]) {
                updateMetadataCallback(photo.id, what, value)
            }
            else {
                console.log("No update needed, new and current is the same ", what)
            }
        }
        else {
            // CLOSE
        }
        setContextMenu("")
    }

    const contextMenuFcn = () => {
        return (
            <Card>
                   <CardMedia
          
          image={ photo.source_url }
          title="Contemplative Reptile"
        />
                <>
                { countryClipboard.length > 0 &&
                <div style={{ padding: "20px" }} >
                        <h5><Icon icon="clipboard" className="mr-2" />Clipboard</h5>
                        <ul>
                            <li className="m-2">{ countryClipboard.length > 0 && <>{ countryClipboard }</> }</li>
                            <li className="m-2">{ stateClipboard.length > 0 && <>{ stateClipboard }</> }</li>
                            <li className="m-2">{ cityClipboard.length > 0 && <>{ cityClipboard }</> }</li>
                        </ul>
                        
                        </div>
                }
                { contextMenu.length > 0 &&
                    

                        <div style={{ padding: "20px" }} >
                        
                        <TopAutoComplete rendering="collection" photos={ all_photos } title={ contextMenu } icon={ contextMenu } limit="12" sortByCount={ true } callback={ updateMetadata } />                        
                        <TopList rendering="collection" photos={ photos } titleAlt="Local" title={ contextMenu } icon={ contextMenu } limit="5" sortByCount={ true } callback={ updateMetadata } />
                        <TopList rendering="collection" photos={ all_photos } titleAlt="Global" title={ contextMenu } icon={ contextMenu } limit="5" sortByCount={ true } callback={ updateMetadata } />
                        </div>
                }
                </>
            </Card>
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
            <div style={ { top: '0px', right: '20px' } } className="image-carousel " onClick={ closeCallback } ><h3><Icon icon="close" /></h3> </div>
            <div style={ { top: '43%', left: '20px' } } className="image-carousel  " onClick={ previousImage } ><h3><Icon icon="arrow-left" /></h3> </div>
            <div style={ { top: '43%', right: '20px' } } className="image-carousel " onClick={ nextImage } ><h3><Icon icon="arrow-right" /></h3> </div>
            <div style={ { bottom: '2%', left: '25%', width: '35%' , margin:"5%", zIndex: '1' } } className="image-carousel-text" >
                { contextMenuFcn() }
            </div>
            <div style={ { top: '70%', left: '20px' } } className="image-carousel-text" >
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

const mapStateToProps = state => {

    const t0 = performance.now()

    let photos = state.photos

    let copyOfphotos = addSrcAndDirname(photos)
    // copyOfphotos = filterFiles(copyOfphotos, state.query)

    return { all_photos: copyOfphotos } // photos:photos
}



export default connect(mapStateToProps, null)(ImageCarousel);