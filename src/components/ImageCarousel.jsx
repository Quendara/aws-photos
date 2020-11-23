import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import { Rating } from "./Rating"
import { useSwipeable } from "react-swipeable";
import { ImageOnDemand } from "./ImageOnDemand";
import { CancelFilterArray } from "./CancelFilter";

import { setMetadataOnImage } from "../redux/actions"; // import default 

import { TopList } from "./TopList";
import { TopAutoComplete } from "./TopAutoComplete";


import { Card, CardHeader } from '@material-ui/core';
import CardMedia from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';
import { CircularProgress } from '@material-ui/core/';
import { Clipboard } from "./Clipboard"


import { Icon } from "./Icons";
import { addSrcAndDirname, restCallToBackendAsync } from "./helpers";

import { Settings, Role } from "../Settings"

// import { values } from "underscore";

const ImageCarousel = ({
    photos,
    all_photos,          // from redux
    token,               // from redux  
    roles,                // from redux  
    setMetadataOnImage,   // from redux
    currentIndex,
    closeCallback,
    ratingCallback,
    updateMetadataCallback }) => {



    // ratingCallback(photo.id, newRating);
    // updateMetadataCallback(photo.id, what, newValue );

    const [index, setIndex] = useState(currentIndex);

    const [showDetails, setShowDetails] = useState(true);

    const [contextMenu, setContextMenu] = useState("");

    const [cityClipboard, setCityClipboard] = useState("");
    const [countryClipboard, setCountryClipboard] = useState("");
    const [stateClipboard, setStateClipboard] = useState("");
    
    const [seachingFace, setSearchingFace] = useState(false);

    const clearClipboard = () => {
        setCityClipboard("") // call callback 
        setCountryClipboard("") // call callback 
        setStateClipboard("") // call callback     
      }    

    const printQuery = (query) => {
        if (typeof query === "object") {
            return query.join(", ")
        }
    }

    const removeFace = (filter, value, add = false) => {
        alert("removeFace not yet implemented : " + value)
    }

    const searchFacesOnImageLocal = (image) => {


        setSearchingFace(true)
        // ( image.id, token.access )
        const url = [Settings.baseRestApi, 'photos', image.id, 'find_faces'].join("/")

        const loggingMessage = "find_faces"
        restCallToBackendAsync(url, token.access, loggingMessage).then(data => {

            const res = JSON.parse(data)
            console.log("restCallToBackendAsync : ", res.faces)
            // this will be rejected, but the "find_faces" call has already updated the metadata
            if (res.faces.length > 0) {
                setMetadataOnImage(image.id, "faces", res.faces, token.access)
            }

            setSearchingFace(false)
        })
    }
    //         console.log(data)

    const getCaptionFromPhoto = (image) => {
        return (
            <div>
                { showDetails &&
                    <>
                        <Box color="text.secondary" >{ image.id } </Box>
                        { image.filename }
                        - roles {roles.join(", ") }
                        <Box lineHeight={ 3 } fontSize="h5.fontSize" ><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></Box>
                        <Icon icon="day" /> { image.day } - <span onClick={ () => setContextMenu("dirname") } className="grey">{ image.dirname } - { image.dirname_physical }</span>

                        <Box lineHeight={ 2 } fontSize="h6.fontSize" >
                            <span className="mr-2" onClick={ () => setContextMenu("country") } >{ image.country }</span>
                            <span onClick={ () => setContextMenu("state") } >{ image.state }</span>
                        </Box>
                        <p onClick={ () => setContextMenu("city") } className="grey" > { image.city }</p>

                        <CancelFilterArray value={ image.faces } filter="faces" callback={ removeFace } />
                        <Button variant="outlined" className="ml-2" onClick={ () => searchFacesOnImageLocal(image) } >
                            { seachingFace && <CircularProgress /> }
                            Search faces
                        </Button>
                    </>
                }
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

        if (contextMenu.length > 0) {
            console.log("handleKeyPress events blocked, to avoid actions!")
            return;
        }

        console.log("handleKeyPress", event.key)

        switch (event.key) {
            case 27:
                case 'Escape':
                    closeCallback()
                    break;
                case 'ArrowRight':
                    nextImage()
                    break;
                case 'ArrowLeft':
                    previousImage()
                    break;
                default:
                    // console.log('key pressed here !! ' + event.key)
        }


        if ( roles.includes( Role.update_metadata ) ) {
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
                case 'i':
                    setShowDetails(!showDetails)
                    break;
                case 'm':
                    setMissing();
                    break;
                case 'r':
                    // updateMetadata("rotate", 180 ) // call callback ();
                    let rotate = 180;
                    if (photo.rotate !== undefined) {
                        rotate = (photo.rotate + 180) % 360;
                    }
                    setMetadataOnImage(photo.id, "rotate", rotate, token.access)
                    break;
                    case 'ArrowUp':
                        increaseRating()
                        break;
                    case 'ArrowDown':
                        decreaseRating()
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
        else{
            alert( "no admin user : " + roles.join(", "))
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

    const currentPhoto = (photos, index) => {
        if (photos.length === 0) { alert("Oh no"); return undefined }
        if (index >= photos.length) {
            index = photos.length - 1
            setIndex(index)
        }
        return photos[index]
    }

    const photo = currentPhoto(photos, index)

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
            <Card color="primary">                              
                <>
                    { countryClipboard.length > 0 &&
                        <Clipboard country={countryClipboard} state={stateClipboard} city={cityClipboard} closeCallback={ clearClipboard } />
                    }
                    { contextMenu.length > 0 &&


                        <div style={ { padding: "20px" } } >

                            <TopAutoComplete rendering="collection" photos={ all_photos } title={ contextMenu } icon={ contextMenu } limit="999" sortByCount={ true } callback={ updateMetadata } />
                            <br /><br />
                            <TopList rendering="collection" photos={ photos } titleAlt="Local" title={ contextMenu } icon={ contextMenu } limit="5" sortByCount={ true } callback={ updateMetadata } />
                            <br /><br />
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
                    alt={ photo.id }
                    visibilityThreshold={-1}
                    onClick= { () => setShowDetails(!showDetails) } /> 
            </div>
            <div style={ { top: '0px', right: '20px' } } className="image-carousel " onClick={ closeCallback } ><h3><Icon icon="close" /></h3> </div>
            <div style={ { top: '43%', left: '20px' } } className="image-carousel  " onClick={ previousImage } ><h3><Icon icon="arrow-left" /></h3> </div>
            <div style={ { top: '43%', right: '20px' } } className="image-carousel " onClick={ nextImage } ><h3><Icon icon="arrow-right" /></h3> </div>
            <div style={ { bottom: '2%', left: '25%', width: '35%', margin: "5%", zIndex: '1' } } className="image-carousel-text" >
                { contextMenuFcn() }
            </div>
            <div style={ { top: '70%', left: '20px' } } className="image-carousel-text" >
                { getCaptionFromPhoto(photo) }
            </div>
            <div style={ { top: '85%', right: '20px' } } className="image-carousel" >
                { showDetails &&
                    <ButtonGroup variant="contained">
                        <Button color="secondary" onClick={ setDeleted } >Delete</Button>
                        <Button color="primary" onClick={ setMissing }  >Missing</Button>
                    </ButtonGroup>
                }
                <Box lineHeight={ 3 } fontSize="h5.fontSize" i ><b>{ index + 1 } / { photos.length }</b></Box>
            </div>
        </div>
    )
}

const mapStateToProps = state => {

    const t0 = performance.now()

    let photos = state.photos

    let copyOfphotos = addSrcAndDirname(photos)
    // copyOfphotos = filterFiles(copyOfphotos, state.query)
    const token = state.token
    const roles = state.token.roles


    return { all_photos: copyOfphotos, token, roles } // photos:photos
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setMetadataOnImage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageCarousel);