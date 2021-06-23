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
import { Dialog, DialogContent, DialogActions, DialogTitle, Card, Hidden, Button } from '@material-ui/core';
import { Clipboard } from "./Clipboard"

import { DatePicker } from "../atoms/DatePicker"
import { CancelFilter } from "../components/CancelFilter"



import AddCircleIcon from '@material-ui/icons/AddCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import { List, ListItem, IconButton, ListItemText, ListItemAvatar, ListItemSecondaryAction, Divider } from '@material-ui/core';

import Avatar from '@material-ui/core/Avatar';

import { makeStyles } from '@material-ui/core/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({

  orange: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

const bull = <span>•</span>;


const ImageGpsInfo = ({
  image,
  locationClipboard,
  copyGPSToClipboardCTA,
  setLocationClipboardCTA
}) => {

  const classes = useStyles();



  return (
    <div>
      { image.country !== "-" ? (
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                { locationClipboard.length > 0 ? ( // Something in Clipboard
                  <IconButton onClick={ setLocationClipboardCTA } >
                    <LibraryAddIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={ copyGPSToClipboardCTA } >
                    <Icon icon="location" />
                  </IconButton>
                )
                }
              </Avatar>
            </ListItemAvatar>

            <ListItemText primary={ <> { image.country } { bull } { image.state } </> } secondary={ image.city } />
          </ListItem>
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText primary={ <>{ image.lat }, { image.long }</> } secondary="GPS" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={ (locationClipboard.length === 0) ? "" : classes.orange } >
                <IconButton disabled={ locationClipboard.length === 0 } onClick={ setLocationClipboardCTA } >
                  <LibraryAddIcon />
                </IconButton>
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText primary={ <>{ image.lat }, { image.long } { bull } { image.status }</> } secondary="GPS" />
            
          </ListItem>

        </List>
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

  const [dayClipboard, setDayClipboard] = useState("");
  const [folderClipboard, setFolderClipboard] = useState("");

  const [replacedCountry, setReplacedCountry] = useState("");

  const classes = useStyles();

  useEffect(() => {
    // check if user is already logged in
    setCurrentLimit(limit)
  }, [photos]);

  const clearClipboard = () => {
    setCityClipboard("") // call callback 
    setCountryClipboard("") // call callback 
    setStateClipboard("") // call callback     
    setFolderClipboard("") // call callback     
    setDayClipboard("") // call callback     
  }


  const getCaptionFromPhoto = (image) => {
    const setFolderFromClipboardCTA = () => {
      updateMetadata("dirname", folderClipboard) // call callback 
    }

    const setDateFromClipboardCTA = () => {
      updateMetadata("day", dayClipboard) // call callback 
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
            <Avatar className={ (folderClipboard.length === 0) ? "" : classes.orange } >
              { folderClipboard.length > 0 ? ( // Something in Clipboard
                <IconButton onClick={ setFolderFromClipboardCTA } >
                  <LibraryAddIcon />
                </IconButton>
              ) : (
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
            <Avatar className={ (dayClipboard.length === 0) ? "" : classes.orange } >
              { dayClipboard.length > 0 ? (
                <IconButton onClick={ setDateFromClipboardCTA } >
                  <LibraryAddIcon />
                </IconButton>
              ) : (
                <Icon icon="day" />
              ) }
            </Avatar>
          </ListItemAvatar>


          <ListItemText
            primary={ image.day }
          />

        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Icon icon="star" />
            </Avatar>
          </ListItemAvatar>
          <Box fontSize="h4.fontSize" >
            <Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating>
          </Box>
        </ListItem>

        {/* <ListItem>
          <Hidden mdDown>
            <Box color="text.secondary" >{ image.id } </Box> 
          </Hidden>
        </ListItem> */}
      </List >
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

    return (<ImageGpsInfo
      image={ image }
      locationClipboard={ countryClipboard }
      copyGPSToClipboardCTA={ copyGPSToClipboardCTA }
      setLocationClipboardCTA={ setLocationClipboardCTA } />)
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

  const limitPhotosAndSortFixMissingCountry = (images, size = 999999, sortBy) => {

    console.log("limitPhotosAndSort called")
    images = sortPhotos(images, sortBy)

    let retImages = []

    for (let i = 0; i < images.length; i++) {
      const previous_image = images[i - 1]
      const c_image = images[i]
      const next_image = images[i + 1]

      if (c_image.country === "-") {
        if (previous_image !== undefined) {
          if (previous_image.country !== "-") {
            retImages.push(previous_image)
          }
        }
        retImages.push(c_image)
      }
    }

    return retImages.slice(0, size) // reduce    
  }


  // 
  const currentPhotos = limitPhotosAndSort(photos, currentLimit, sortBy);


  const handleSetCountryToMissing = ( dry = true ) => {

    const missingCountry = photos.filter(image => {
      return image.country === "-"
    })

    console.log("missingCountry : ", missingCountry)

    const ret = missingCountry.map((image, index) => {

      if( dry === false ){
        setMetadataOnImage( image.id, "country", countryClipboard, token.access)
      }

      return (
        <ListItem>
            <Grid item xs={ 2 }  >
              <ImageOnDemand onClick={ () => openLightbox(index) } className="responsive-img" image={ image } />
            </Grid>          
            <Grid item xs={ 10 }  >
              <ListItemText primary={ <>{ image.country } { bull } { image.lat }, { image.long } { bull } { image.status } </> } secondary={ "Counter " + index } />
            </Grid>
          
        </ListItem>
      )

    })

    setReplacedCountry(ret)

  }


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
        <Grid container justify="center" alignItems="center" spacing={3}>
          <Grid item xs={ 3 } md={ 3 }>
            <DatePicker label="Datum für Bilder" callback={ (day) => setDayClipboard(day) } />
          </Grid>
          <Grid item xs={ 3 } md={ 3 }>
            <CancelFilter photos={ photos } value={ countryClipboard } filter="country" callback={ (key, value) => setCountryClipboard(value) } showNext={ false } />
            { countryClipboard.length > 0 &&
              <>
                <Button onClick={ () => handleSetCountryToMissing() } > Set missing country to { countryClipboard } </Button>

                <Dialog open={ replacedCountry.length > 0 } >
                  <DialogTitle id="simple-dialog-title">Replace Country on the following images.</DialogTitle>
                  <DialogContent style={ { height: "70vh" } }>
                  <Grid item xs={ 12 } >
                    <List>
                      { replacedCountry }
                    </List>
                  </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={ () => setReplacedCountry("") }>Close</Button>
                    <Button variant="contained" color="primary" onClick={ () => {
                      handleSetCountryToMissing(false) // force changes
                      setReplacedCountry("") 
                    }
                    }>Run</Button>
                  </DialogActions>
                </Dialog>
              </>
            }
          </Grid>
        </Grid>

        { (countryClipboard.length > 0 || folderClipboard.length > 0 || dayClipboard.length > 0) &&
          <div style={ { position: "fixed", bottom: '2%', left: '0%', width: '100%', zIndex: '999' } } className="image-carousel-text" >
            <Grid container justify="center" alignItems="center">
              <Grid item xs={ 12 } md={ 3 }>
                <Card>
                  <Clipboard
                    country={ countryClipboard }
                    state={ stateClipboard }
                    city={ cityClipboard }
                    folder={ folderClipboard }
                    day={ dayClipboard }
                    closeCallback={ clearClipboard } />
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
