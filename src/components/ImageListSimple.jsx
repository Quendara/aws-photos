
import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";


import { ImageOnDemand } from "./ImageOnDemand";

import { Rating } from "./Rating"
import { sortPhotos } from "./helpers"
import { Icon } from "./Icons";


import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 

// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Grid, Box } from "@material-ui/core";
import ImageCarousel from "./ImageCarousel";
import { Dialog, DialogContent, Card, Hidden } from '@material-ui/core';
import { Clipboard } from "./Clipboard"


import AddCircleIcon from '@material-ui/icons/AddCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import { List, ListItem, IconButton, ListItemText, ListItemAvatar, ListItemSecondaryAction, Divider } from '@material-ui/core';

import Avatar from '@material-ui/core/Avatar';

const ImageGpsInfo = ({
  image,
  copyGPSToClipboardCTA,
  setLocationClipboardCTA
}) => {

  const [isShown, setIsShown] = useState(false);

  // const bull = <span className={classes.bullet}>•</span>;
  const bull = <span>•</span>;

  return (
    <div>
      { image.country !== "-" ? (
        <List
          onMouseEnter={ () => setIsShown(true) }
          onMouseLeave={ () => setIsShown(false) }
        >
          <ListItem>
            
            <ListItemText primary={ <> { image.country } { bull } { image.state } </> } />

            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={ copyGPSToClipboardCTA }>
                { isShown && <FileCopyIcon /> }
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={ image.city } />
          </ListItem>
          <ListItem>
            <ListItemText primary={ <>{ image.lat }, { image.long }</> } secondary="GPS" />
          </ListItem>
        </List>
      ) : (
          <AddCircleIcon onClick={ setLocationClipboardCTA } />
        ) }
    </div>)
}

export const ImageListSimple = ({
  photos,
  sortBy,
  limit = 500,
  setRatingOnImage,
  setMetadataOnImage,
  token,              // from mapStateToProps
}) => {

  // const [] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(limit);

  const [cityClipboard, setCityClipboard] = useState("");
  const [countryClipboard, setCountryClipboard] = useState("");
  const [stateClipboard, setStateClipboard] = useState("");

  const [folderClipboard, setFolderClipboard] = useState("");

  useEffect(() => {
    // check if user is already logged in
    setCurrentLimit(limit)
  }, [photos]);  

  const clearClipboard = () => {
    setCityClipboard("") // call callback 
    setCountryClipboard("") // call callback 
    setStateClipboard("") // call callback     
    setFolderClipboard("") // call callback     
  }


  const getCaptionFromPhoto = (image) => {
    const setFolderFromClipboardCTA = () => {
      updateMetadata("dirname", folderClipboard) // call callback 
    }

    const updateMetadata = (what, value) => {
      if (value.length > 0) {
        console.log("Update '" + what + "' to '" + value + "' ImageID : " + image.id)
        if (value !== image[what]) {
          updateMetadataCallback(image.id, what, value)
        }
        else {
          console.log("No update needed, new and current is the same ", what)
        }
      }
      else {
        // CLOSE
      }
    }    

    return (
      <List>
        <ListItem>
          <ListItemAvatar >
            <Avatar>
              { folderClipboard.length > 0 ?
                // Something in Clipboard
                (
                  <IconButton onClick={ setFolderFromClipboardCTA } >
                    <LibraryAddIcon />
                  </IconButton>
                )
                :
                (
                  <IconButton onClick={ () => setFolderClipboard(image.dirname) } >
                    <Icon icon="dirname" />
                  </IconButton>
                )
              }
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={ <>{ image.dirname }/{ image.filename } </> }
            secondary={ image.dirname_physical } />

        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Icon icon="day" />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={ image.day }
          />

        </ListItem>
        <ListItem>
          <Box fontSize="h5.fontSize" >
            <Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating>
          </Box>
        </ListItem>
        {/* <ListItem>
          <Hidden mdDown>
            <Box color="text.secondary" >{ image.id } </Box> 
          </Hidden>
        </ListItem> */}

      </List>
    )
  }

  const getGpsInfoFromPhoto = (image) => {

    const copyGPSToClipboardCTA = () => {
      setCountryClipboard(image.country)
      setStateClipboard(image.state)
      setCityClipboard(image.city)
    }

    const setLocationClipboardCTA = () => {
      updateMetadata("country", countryClipboard) // call callback 
      updateMetadata("state", stateClipboard) // call callback 
      updateMetadata("city", cityClipboard) // call callback     
    }

    const updateMetadata = (what, value) => {
      if (value.length > 0) {
        console.log("Update '" + what + "' to '" + value + "' ImageID : " + image.id)
        if (value !== image[what]) {
          updateMetadataCallback(image.id, what, value)
        }
        else {
          console.log("No update needed, new and current is the same ", what)
        }
      }
      else {
        // CLOSE
      }
    }

    return (<ImageGpsInfo image={ image } copyGPSToClipboardCTA={ copyGPSToClipboardCTA } setLocationClipboardCTA={ setLocationClipboardCTA } />)
  }



  // const openLightbox = useCallback((event, { photo, index }) => {
  //   setCurrentImage(index);
  //   setViewerIsOpen(true);
  // }, []);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const updateMetadataCallback = (id, what, newValue) => {

    // if (setRatingOnImage === undefined) {
    //   console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
    //   return;
    // }
    console.log("Update '" + what + "' to '" + newValue + "' ImageID : " + id)
    setMetadataOnImage(id, what, newValue, token.access)

  }

  const ratingCallback = (id, rating) => {

    if (setRatingOnImage === undefined) {
      console.error("ratingCallback - setRatingOnImage is undefined", id, rating)
    }
    console.log("ratingCallback", id, rating, setRatingOnImage)
    setRatingOnImage(id, rating, token.access)
  }

  const limitPhotosAndSort = (images, size = 999999, sortBy) => {

    console.log("limitPhotosAndSort called")
    images = sortPhotos(images, sortBy)

    if (+currentLimit > photos.length) {
      setCurrentLimit(photos.length)
    }
    return images.slice(0, size) // reduce    
  }

  // 
  const currentPhotos = limitPhotosAndSort(photos, currentLimit, sortBy);

  // const setLocation = ( ) => {
  //   set
  // }

  const imageList = photos.length ? (
    currentPhotos.map((image, index) => {
      return (
        <Grid
          container
          direction="row"
          justify="center"
          key={ index }
          spacing={ 2 }
          alignItems="flex-start" >

          {/* LATER
          <ImageListItem image={image} openCarouselCallback={ () => openLightbox(index) } */}

          <Hidden smDown>
            <Grid item lg={ 2 } md={ 3 } >
              <ImageOnDemand onClick={ () => openLightbox(index) } className="responsive-img" image={ image } />
            </Grid>
            <Grid item md={ 5 } >
              { getCaptionFromPhoto(image) }
            </Grid>
            <Grid item md={ 4 } >
              { getGpsInfoFromPhoto(image) }
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <Grid item xs={ 6 } >
              <ImageOnDemand onClick={ () => openLightbox(index) } className="responsive-img" image={ image } />
            </Grid>
            <Grid item xs={ 6 } >
              <Divider />
              { getCaptionFromPhoto(image) }
              { getGpsInfoFromPhoto(image) }
            </Grid>
          </Hidden>


        </Grid>

      );
    })
  ) : (
      <p className="center">You have no images left</p>
    );

  return (
    <>
      { viewerIsOpen &&
        <Dialog open={ viewerIsOpen } fullScreen={ true } >
          <DialogContent style={ { height: "100vh", width: "100vw" } }>
            <ImageCarousel
              photos={ photos }
              closeCallback={ closeLightbox }
              currentIndex={ currentImage }
              updateMetadataCallback={ updateMetadataCallback }
              ratingCallback={ ratingCallback }
            />
          </DialogContent>
        </Dialog>
      }
      <>
        { (countryClipboard.length > 0 || folderClipboard.length > 0) &&
          <div style={ { position: "fixed", bottom: '2%', left: '0%', width: '100%', zIndex: '999' } } className="image-carousel-text" >
            <Grid container justify="center" alignItems="center">
              <Grid item xs={ 12 } md={ 3 }>
                <Card>
                  <Clipboard country={ countryClipboard } state={ stateClipboard } city={ cityClipboard } folder={ folderClipboard } closeCallback={ clearClipboard } />
                </Card>
              </Grid>
            </Grid>
          </div>

        }

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start" >


          { imageList }


        </Grid >
      </>
    </>

  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRatingOnImage, setMetadataOnImage }, dispatch)
}

const mapStateToProps = state => {

  // const photos = state.photos
  // const photos = filterFiles(state.photos, state.query)
  const token = state.token

  return { token } // photos:photos
}


export default connect(mapStateToProps, mapDispatchToProps)(ImageListSimple);
