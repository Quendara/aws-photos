import React, { useState } from "react";

import { useWindowSize } from "./useWindowSize"

import { ImageGridImage } from "./ImageGridImage"
import ImageCarousel from "./ImageCarousel"
import Gallery from 'react-photo-gallery';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Typography, Hidden } from '@material-ui/core/';
import { Dialog, DialogContent } from '@material-ui/core';


import { ImageOnDemand } from "./ImageOnDemand";
import { sortPhotos } from "./helpers"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        // gridList: {
        //     width: 800,
        //     height: 450,
        // },
        titleBar: {
            fontSize: '2.2rem',
            background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
    }),
);

// import Settings from "../Settings"



export const ImageGrid2View = ({ photos, title, ratingCallback, updateMetadataCallback }) => {

    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const size = useWindowSize();
    const classes = useStyles();

    const view_sort = "rating"
    const sortedPhotos = sortPhotos(photos, view_sort)

    const height = size.width / 20

    const openLightbox = (index) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    };

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const imageRenderer = (
        ({ index, left, top, key, photo, onClick }) => (
            <ImageGridImage
                selected={ false }
                onClick={ onClick }
                key={ key }
                index={ index }
                photo={ photo }
                left={ left }
                top={ top }
            />
        )
    );

    return (
        <>

            { viewerIsOpen ?
                <Dialog open={ viewerIsOpen } fullScreen={ true } >
                    <DialogContent style={ { height: "100vh", width: "100vw" } }>
                        <ImageCarousel
                            photos={ sortedPhotos }
                            closeCallback={ closeLightbox }
                            currentIndex={ currentImage }
                            ratingCallback={ ratingCallback }
                            updateMetadataCallback={updateMetadataCallback}
                        />
                    </DialogContent>
                </Dialog>
                : (
                    <>
                        <Hidden smDown>
                            { photos.length > 3 && 
                                <>
                                    { photos.length % 2 === 0 ? (
                                    <Group_1_2 offset={0} onClick={ openLightbox} title={ title } photos={ sortedPhotos.slice(0, 3) } height={ height } ></Group_1_2>
                                    ):(
                                    <Group_2_1 offset={0} onClick={ openLightbox} title={ title } photos={ sortedPhotos.slice(0, 3) } height={ height } ></Group_2_1>
                                    )}
                                </>
                             }
                            { photos.length > 7 && <Group_3  offset={3} onClick={ openLightbox } photos={ sortedPhotos.slice(3, 3 + 3) } height={ height } ></Group_3> }
                            { photos.length > 10 && <Group_6  offset={6}  onClick={ openLightbox } photos={ sortedPhotos.slice( 6, 6 + 6) } height={ height } ></Group_6> }
                        </Hidden>
                        <Hidden mdUp>
                            { photos.length > 3 &&
                                < Grid item xs={ 12 } >
                                    <Typography

                                        titlePosition="top"
                                        className={ classes.titleBar }>
                                        { title }
                                    </Typography>
                                    <ImageOnDemand onClick={ () => openLightbox(0) } className="responsive-img" image={ sortedPhotos[0] } />
                                </Grid>
                            }
                            { photos.length > 6 && <Grid item xs={ 12 } ><Gallery targetRowHeight={ 10 } spacing={ 3 } photos={ sortedPhotos.slice(1, 1 + 2) } renderImage={ imageRenderer } /></Grid> }
                            { photos.length > 10 && <Grid item xs={ 12 } ><Gallery targetRowHeight={ 10 } spacing={ 3 } photos={ sortedPhotos.slice(3, 3 + 3) } renderImage={ imageRenderer } /></Grid> }


                        </Hidden>

                    </>) } </>)
}



const Group_1_2 = ({ photos, title, height, offset, onClick }) => {

    const classes = useStyles();

    const localOnClick = ( index ) => {
        onClick( offset + index )
    }

    return (
        <>
            <Grid item xs={ 8 } >
                {/* <ImageOnDemand className="responsive-img" image={ photos[0] } /> */ }
                <GridList cellHeight={ 8 * height +8 } cols={ 1 } spacing={ 8 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand onClick={() => localOnClick(0)} className="responsive-img" image={ photos[0] } />
                        <GridListTileBar
                            title={ <h2>{ title }</h2> }
                            titlePosition="top"
                            className={ classes.titleBar }>

                        </GridListTileBar>
                    </GridListTile>
                </GridList>
            </Grid>
            <Grid item xs={ 4 } >
                <GridList cellHeight={ (4 * height) } cols={ 1 } spacing={ 8 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand onClick={() => localOnClick(1)}  className="responsive-img" image={ photos[1] } />
                    </GridListTile>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand onClick={() => localOnClick(2)} className="responsive-img" image={ photos[2] } />
                    </GridListTile>
                </GridList>
            </Grid>
        </>
    )
}


const Group_2_1 = ({ photos, title, height, offset, onClick }) => {

    const classes = useStyles();

    const localOnClick = ( index ) => {
        onClick( offset + index )
    }

    return (
        <>
            <Grid item xs={ 4 } >
                <GridList cellHeight={ (4 * height) } cols={ 1 } spacing={ 8 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand onClick={() => localOnClick(0)}  className="responsive-img" image={ photos[0] } />
                    </GridListTile>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand onClick={() => localOnClick(1)} className="responsive-img" image={ photos[1] } />
                    </GridListTile>
                </GridList>
            </Grid>
            <Grid item xs={ 8 } >
                {/* <ImageOnDemand className="responsive-img" image={ photos[0] } /> */ }
                <GridList cellHeight={ 8 * height +8 } cols={ 1 } spacing={ 8 }>
                    <GridListTile cols={ 1 } rows={ 1 } >
                        <ImageOnDemand onClick={() => localOnClick(2)} className="responsive-img" image={ photos[2] } />
                        <GridListTileBar
                            title={ <h2>{ title }</h2> }
                            titlePosition="top"
                            className={ classes.titleBar }>

                        </GridListTileBar>
                    </GridListTile>
                </GridList>
            </Grid>            
        </>
    )
}


const Group_6 = ({ photos, height, offset, onClick }) => {
    const localOnClick = ( index ) => {
        onClick( offset + index )
    }
    return (
        <>
            <Grid item xs={ 12 }   >
                <GridList cellHeight={ height } cols={ 12 } spacing={ 8 }>
                    { photos.map((photo, index) => (
                        <GridListTile key={ index } cols={ index === 99 ? 6 : 2 } rows={ index === 99 ? 4 : 2 } >
                            <ImageOnDemand onClick={ () => localOnClick( index ) } className="responsive-img" image={ photo } />
                        </GridListTile>
                    ))
                        // 
                    }
                </GridList>
            </Grid>
        </>
    )
}


const Group_3 = ({ photos, height, offset, onClick }) => {


    const localOnClick = ( index ) => {
        onClick( offset + index )
    }

    return (
        <>

            <Grid item xs={ 12 }    >
                <GridList cellHeight={ height } cols={ 12 } spacing={ 8 }>
                    { photos.map((photo, index) => (
                        <GridListTile key={ index } cols={ 4 } rows={ 4 } >
                            <ImageOnDemand onClick={ () => localOnClick( index ) } className="responsive-img" image={ photo } />
                        </GridListTile>
                    ))
                        // 
                    }
                </GridList>
            </Grid>
        </>
    )
}
