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
import { Typography, Hidden, Box, Button } from '@material-ui/core/';
import { Dialog, DialogContent, IconButton } from '@material-ui/core';

import { Icon } from "./Icons";
import { ImageOnDemand } from "./ImageOnDemand";
import { findUnique, sortPhotos } from "./helpers"
import { GridOff } from "@material-ui/icons";

const ImageGrid2 = ({
    photos,
    limit = 30,
    paging = false,
    view = "grid",
    sortBy,
    initialGroup = "day",
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token,              // from mapStateToProps
    ...rest }) => {

    const [group, setGroup] = useState(initialGroup);

    const [currentImageGroup, setCurrentImageGroup] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openLightbox = useCallback((event, { index }) => {
        setCurrentImageGroup(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImageGroup(0);
        setViewerIsOpen(false);
    };

    const callbackGroupBy = (value) => {
        setGroup(value)
    }

    const [currentLimit, setCurrentLimit] = useState(limit);
    const increaseValue = 30

    const [targetRef, isVisible] = useVisible((vi: number) => {
        return vi > 0.02
    })


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



    const getGroupedItems = (photos, groupA) => {
        const sortByCount = false
        const limit = 200;
        return findUnique(photos, groupA, sortByCount, limit)
    }

    // create groups
    const groups = getGroupedItems(photos, group)

    const showGroupSelector = true

    const imageRenderer = (
        ({ index, left, top, key, photo, onClick }) => (
            <div style={ { position: "relative" } } >
                { photo.count > 1 &&
                    <h2 style={ { position: "absolute", bottom: "0px", left: "10px", zIndex: 99 } } > { photo.count }</h2>
                }
                <ImageGridImage
                    selected={ false }
                    onClick={ onClick }
                    key={ key }
                    margin={ "2px" }
                    index={ index }
                    photo={ photo }
                    left={ left }
                    top={ top }
                />

            </div>
        )
    );

    const groupPhotos = groups.map((item, index) => {

        const view_sort = "rating"
        let sortedPhotos = sortPhotos(item.photos, view_sort)
        let bestPhoto = sortedPhotos[0]

        bestPhoto["count"] = item.photos.length
        return bestPhoto
    })

    return (
        <>
            { photos.length > 0 && <>

                { showGroupSelector &&
                    <SelectionView currentValue={ group } valueArr={ ['dirname', 'country', 'city', 'year', 'month', 'day'] } callback={ callbackGroupBy } />

                }

                <Dialog open={ viewerIsOpen } fullScreen={ true } >
                    <DialogContent style={ { height: "100vh", width: "100vw" } }>



                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={ 1 } >
                            
                            <Grid item xs={12} >
                            <Button onClick={ () => setCurrentImageGroup(currentImageGroup - 1) }  >Previous</Button>
                            <Button onClick={ () => setCurrentImageGroup(currentImageGroup + 1) }  >Next</Button>
                            <Button onClick={ closeLightbox }  >CLOSE</Button>

                            </Grid>

                            <div style={ { top: '0px', right: '20px', zIndex: "999" } } className="image-carousel " ><h3><IconButton onClick={ closeLightbox } ><Icon icon="close" /></IconButton> </h3> </div>

                            <ImageGrid2View title={ groups[currentImageGroup].value } photos={ groups[currentImageGroup].photos } ratingCallback={ ratingCallback } updateMetadataCallback={ updateMetadataCallback }  >
                            </ImageGrid2View>


                        </Grid>

                    </DialogContent>
                </Dialog>

                <Gallery photos={ groupPhotos } renderImage={ imageRenderer } targetRowHeight={ 300 } onClick={ openLightbox } />
            </>
            }
        </>
    )
}

// { groups.map((item, index) => (
//     <ImageGrid2View title={ item.value } photos={ item.photos } ratingCallback={ ratingCallback } updateMetadataCallback={ updateMetadataCallback }  >
//     </ImageGrid2View>    
// )) }



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

