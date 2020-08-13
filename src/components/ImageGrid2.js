import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { useVisible } from 'react-hooks-visible'

import { Modal, ModalGateway } from "react-images";

import { ImageGridImage } from "./ImageGridImage"
import ImageCarousel from "./ImageCarousel"

import { sumArray } from "./helpers"
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: 800,
            height: 450,
        },
    }),
);

// import Settings from "../Settings"

const ImageGrid2 = ({
    photos,
    limit = 30,
    paging = false,
    view = "grid",
    sortBy,
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token,              // from mapStateToProps
    ...rest }) => {

    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [currentLimit, setCurrentLimit] = useState(limit);
    const increaseValue = 30

    const [targetRef, isVisible] = useVisible((vi: number) => {
        return vi > 0.02
    })

    const classes = useStyles();

    // updated in limitPhotosAndSort
    let currentRenderer = undefined


    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    useEffect(() => {
        if (isVisible === true) {
            console.log("loadMore .. increaseLimit ... ")
            increaseLimit()
        }
    })

    const increaseLimitImpl = () => {
        console.log("increaseLimit", currentLimit)

        const newLimit = +currentLimit + increaseValue;
        if (newLimit > photos.length) {
            setCurrentLimit(photos.length)
        }
        else {
            // increase limit when possible
            setCurrentLimit(newLimit)
        }

    }


    const increaseLimit = () => {

        setTimeout(() => {
            increaseLimitImpl()
        }, 200);

    }

    // could be replaced by updateMetadataCallback
    const ratingCallback = (id, rating) => {

        if (setRatingOnImage === undefined) {
            console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
            return;
        }
        console.log("callbackLocal", id, rating, setRatingOnImage)
        setRatingOnImage(id, rating, token.access)

    }

    const updateMetadataCallback = (id, what, newValue) => {

        // if (setRatingOnImage === undefined) {
        //   console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
        //   return;
        // }
        console.log("Update '" + what + "' to '" + newValue + "' ImageID : " + id)
        setMetadataOnImage(id, what, newValue, token.access)

    }

    const limitPhotosAndSort = (images, size = 999999, sortBy) => {

        // console.log("limitPhotosAndSort called, size : ", size)

        let retImages = images

        if (view === "details") {
            retImages = images.map((image) => {
                return Object.assign({}, image, {
                    width: image.width * 2
                })
            })
        }


        // limit
        if (+currentLimit > photos.length) {
            setCurrentLimit(photos.length)
        }
        return retImages.slice(0, size) // reduce    
    }

    // 
    const currentPhotos = limitPhotosAndSort(photos, limit, sortBy);

    const showPaging = (photos) => {

        // Hide more button when all images loaded!
        if (currentLimit === photos.length) {
            return false;
        }
        return paging
    }

    // targetRowHeight={170} 
    // <h6> EBUG # {photos.length }, {currentPhotos.length} {currentLimit}</h6>

    const calcColsPerImage = ( photo ) => {

        const sumWidth = sumArray( currentPhotos, "width" )
        
        const cols = Number( ( photo.width / sumWidth ) * 99 )

        console.log( "sumWidth : " + sumWidth )
        console.log( "cols : " + cols )

         return cols;
    }

    



    return (
        <>
            { photos.length > 0 && <>

                <div>
                    {/* { currentPhotos.map((photo, index) => (
                            <p>{index} {photo.filename} </p>
                    )) } */}

                <br></br>
                    <div className={ classes.root }>
                        
                        <GridList cellHeight={ 160 }  cols={ 100 }>
                            { currentPhotos.map( (photo, index)  => (
                                <GridListTile key={ index } cols={ calcColsPerImage( photo ) }>
                                    <img src={ photo.source_url } alt={ index } />
                                </GridListTile>
                            )) 
                            // <ImageOnDemand image={photo} />
                            }
                        </GridList>
                    </div>


                    { isVisible }

                    { showPaging(photos) && <>
                        <div ref={ targetRef } className="col offset-s3 s6 btn grey darker-2 m-2" onClick={ increaseLimit } >  more </div><span className="blue-text" >{ currentLimit } / { photos.length }</span>

                    </>

                    }





                </div>

            </> }
        </>
    )
}


const mapStateToProps = state => {

    // const photos = state.photos
    // const photos = filterFiles(state.photos, state.query)
    const token = state.token

    return { token } // photos:photos
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setRatingOnImage, setMetadataOnImage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageGrid2);
// export default connect(null, mapDispatchToProps)(ImageGrid);

