import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { useVisible } from 'react-hooks-visible'

import { useWindowSize } from "./useWindowSize"

import { ImageGridImage } from "./ImageGridImage"
import { ImageGrid2View } from "./ImageGrid2View"

import ImageCarousel from "./ImageCarousel"
import Gallery from 'react-photo-gallery';


import { SelectionView } from "./SelectionView"
import { sumArray } from "./helpers"
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Typography, Hidden, Box } from '@material-ui/core/';
import { Dialog, DialogContent } from '@material-ui/core';

import { ImageOnDemand } from "./ImageOnDemand";
import { findUnique, sortPhotos } from "./helpers"

const ImageGrid2 = ({
    photos,
    limit = 30,
    paging = false,
    view = "grid",
    sortBy,
    initialGroup = "month",
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token,              // from mapStateToProps
    ...rest }) => {

    const [group, setGroup] = useState(initialGroup);

    const callbackGroupBy = (value) => {
        setGroup(value)
    }

    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [currentLimit, setCurrentLimit] = useState(limit);
    const increaseValue = 30

    const [targetRef, isVisible] = useVisible((vi: number) => {
        return vi > 0.02
    })

    // const classes = useStyles();

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

    const calcColsPerImage = (photo) => {

        const sumWidth = sumArray(currentPhotos, "width")

        const cols = Number((photo.width / sumWidth) * 99)

        console.log("sumWidth : " + sumWidth)
        console.log("cols : " + cols)

        return cols;
    }

    const getGroupedItems = (photos, groupA) => {
        const sortByCount = false
        const limit = 131;
        return findUnique(photos, groupA, sortByCount, limit)
    }

    // create groups
    const groups = getGroupedItems(photos, group)

    const showGroupSelector = true

    return (
        <>
            { photos.length > 0 && <>
                { showGroupSelector &&
                    <Grid
                        container
                        justify="center"
                        alignItems="flex-start" >
                        <Box className="group-menu" boxShadow={ 3 }  >
                            <SelectionView currentValue={ group } valueArr={ ['dirname', 'country', 'city', 'year', 'month', 'day'] } callback={ callbackGroupBy } />
                            {/* <Button onClick={ () => setStats(!stats) }><Icon icon="arrowUp" /></Button> */ }
                        </Box>
                    </Grid>
                }

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={ 1 } >
                    { groups.map((item, index) => (
                        <ImageGrid2View title={ item.value } photos={ item.photos } ratingCallback={ ratingCallback } updateMetadataCallback={ updateMetadataCallback }  >
                        </ImageGrid2View>
                    )) }
                </Grid>

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

