import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { useVisible } from 'react-hooks-visible'

import { useWindowSize } from "./useWindowSize"

import { Modal, ModalGateway } from "react-images";

import { ImageGridImage } from "./ImageGridImage"
import ImageCarousel from "./ImageCarousel"

import { sumArray } from "./helpers"
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {Typography} from '@material-ui/core/';


import { ImageOnDemand } from "./ImageOnDemand";
import { findUnique, sortPhotos } from "./helpers"

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
        titleBar: {
            fontSize: '2.2rem',
            background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
    }),
);

// import Settings from "../Settings"



const Group = ({ photos, title }) => {

    const size = useWindowSize();

    const view_sort = "rating"
    const sortedPhotos = sortPhotos(photos, view_sort)

    const height = size.width / 22

    return (<>
    
        { photos.length > 3 && <Group_1_2 title={ title } photos={ sortedPhotos.slice(0, 3) } height={height} ></Group_1_2> }
        { photos.length > 7 && <Group_3 photos={ sortedPhotos.slice(8, 8 + 3) } height={height} ></Group_3> }
        { photos.length > 10 && <Group_6 photos={ sortedPhotos.slice(2, 2 + 6) } height={height} ></Group_6> }

    </>)
}



const Group_1_2 = ({ photos, title, height }) => {

    const classes = useStyles();

    return (
        <>
            <Grid item xs={ 8 } >
                {/* <ImageOnDemand className="responsive-img" image={ photos[0] } /> */ }
                <GridList cellHeight={ 8 * height } cols={ 1 } spacing={ height/6 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[0] } />
                        <GridListTileBar
                            title={ <h1>{ title }</h1> } 
                            titlePosition="top"
                            className={ classes.titleBar }>

                        </GridListTileBar>
                    </GridListTile>
                </GridList>
            </Grid>
            <Grid item xs={ 4 } >
                <GridList cellHeight={ (4 * height) * 0.98 } cols={ 1 } spacing={ height/6 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[1] } />
                    </GridListTile>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[2] } />
                    </GridListTile>
                </GridList>
            </Grid>
        </>
    )
}

const Group_1_4 = ({ photos, title, height }) => {


    return (
        <>
            <Grid item xs={ 8 } >
                {/* <ImageOnDemand className="responsive-img" image={ photos[0] } /> */ }
                <GridList cellHeight={ 8 * height } cols={ 1 } spacing={ height/6 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[0] } />
                    </GridListTile>
                </GridList>
            </Grid>
            <Grid item xs={ 4 } >
                <GridList cellHeight={ 2 * height } cols={ 2 } spacing={ height/6 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[1] } />
                    </GridListTile>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[2] } />
                    </GridListTile>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[3] } />
                    </GridListTile>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand className="responsive-img" image={ photos[4] } />
                    </GridListTile>

                </GridList>
            </Grid>
        </>
    )
}

const Group_6 = ({ photos, title, height }) => {

    return (
        <>
            <Grid item xs={ 12 }   >
                <GridList cellHeight={ height } cols={ 12 } spacing={ 15 }>
                    { photos.map((photo, index) => (
                        <GridListTile key={ index } cols={ index === 99 ? 6 : 2 } rows={ index === 99 ? 4 : 2 } >
                            <ImageOnDemand className="responsive-img" image={ photo } />
                        </GridListTile>
                    ))
                        // 
                    }
                </GridList>
            </Grid>
        </>
    )
}

const Group_3 = ({ photos, title, height }) => {

    return (
        <>

            <Grid item xs={ 12 }    >
                <GridList cellHeight={ height } cols={ 12 } spacing={ 15 }>
                    { photos.map((photo, index) => (
                        <GridListTile key={ index } cols={ 4 } rows={ 4 } >
                            <ImageOnDemand className="responsive-img" image={ photo } />
                        </GridListTile>
                    ))
                        // 
                    }
                </GridList>
            </Grid>
        </>
    )
}

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

    const groups = getGroupedItems(photos, "day")

    return (
        <>
            { photos.length > 0 && <>

                <div>
                    <div className={ classes.root }>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={ 1 } >
                            { groups.map((item, index) => (
                                <Group title={ item.value } photos={ item.photos } >
                                </Group>
                            )) }
                        </Grid>
                    </div>
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

