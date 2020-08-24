import React, { useState } from "react"; // , { useState }
import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import { LeftMenu } from "./LeftMenu"
import ImageGroup from "./ImageGroup"
import ImageGrid from "./ImageGrid"

import { useWindowSize } from "./useWindowSize"

import { Icon } from "./Icons"

import { setQueryFilter } from "../redux/actions"; // import default 
import { setRatingOnImage, setMetadataOnImage, addToQueryFilter, removeFromQueryFilter } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";


import { findUnique, findUniqueFacesItems, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";
import { values } from "underscore";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Hidden from '@material-ui/core/Hidden';
import { ImageOnDemand } from "./ImageOnDemand";
import { CancelFilterAll } from "./CancelFilter";

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';

// import InfoIcon from '@material-ui/icons/Info';

// init with function
export const store = createStore(rootReducer)

const FaceTile = ({ item, query, callbackFilter }) => {

    const names = ( value ) => {
        const multiple = value.split(",")

        const filterNamesInQuery = ( images ) => {

            return images; 

            const list = images.filter(image => {
                return !query.faces.includes(image) // (image.imported === imported)
            })
            return list;
        }

        return (
            <>
            { filterNamesInQuery( multiple ).map( (name) => (
                <Button
                    onClick={ () => callbackFilter("faces", name, !query.faces.includes(value)) }
                 >{name}</Button> ) 
            ) }
            </>
        )
    }
    
    return (
        <>
            <GridListTileBar
                title={ names( item.value ) }
                

            />
        </>
    )

    // subtitle={ <span>{ item.count }</span> }                

    // actionIcon={
    //     <IconButton aria-label={ `info about ${item.value}` } onClick={ () => callbackFilter("faces", item.value, !query.faces.includes(item.value)) } >
    //         <Icon Icon="face" />
    //     </IconButton>
    // }       
}

const ImageFaces = ({
    photos,
    query,
    setQueryFilter,     // from mapDispatchToProps
    addToQueryFilter,
    removeFromQueryFilter,   
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token               // from mapStateToProps    
}) => {


    const [showImage, setShowImage] = useState(true); // group, list, grid
    const [view_sort, setViewSort] = useState("date"); // rating, date

    const size = useWindowSize();

    const sortedPhotos = sortPhotos(photos, view_sort)

    const callbackFilter = (key, value, add = true) => { // add = false means remove from ARRAY

        console.log("callbackFilter : ", key, " : ", value)
        console.log("query ", query)
        console.log("typeof value ", typeof value)

        if (key === "faces") {
            if (add === true) {
                addToQueryFilter(key, value)
            }
            else{
                removeFromQueryFilter(key, value)
            } 
        }
        else{
            setQueryFilter(key, value)
        }
    }

    const test = (image) => {
        console.log("getSrcUrlWhenVisible : ", image)
    }



    const closeView = () => {
        setShowImage(false)
    }

    const ratingCallback = (id, rating) => {

        if (setRatingOnImage === undefined) {
            console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
            return;
        }
        console.log("callbackLocal", id, rating)
        // setRatingOnImage(id, rating, token.access )

    }

    const updateMetadataCallback = (id, what, newValue) => {

        // if (setRatingOnImage === undefined) {
        //   console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
        //   return;
        // }
        console.log("Update '" + what + "' to '" + newValue + "' ImageID : " + id)
        setMetadataOnImage(id, what, newValue, token.access)
    }

    const facesHeaderClass = (name, array) => {

        if (array.includes(name)) {
            return "secondary"
        }
        return "primary"

    }




    const facesHeader = (query) => {

        const names = ["Andre", "Irena", "Jonna", "Juri", "Gaby", "Reinhard", "Marian", "Matthias", "Petra"]

        return names.map(name => {
            return (<Button color={ facesHeaderClass(name, query.faces) } onClick={ () => callbackFilter("faces", name, !query.faces.includes(name)) } >{ name }</Button>)
        })
    }

    return (
        <>

            <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start" >

                <Grid container item xs={ 12 } lg={ 9 } >

                    { query.faces.length === 0 ?

                        (<>

                            <h2>Personen</h2>
                            {/* {facesHeader(query)} */}

                            <GridList cols={ (size.width > 600) ? 6 : 2 } >
                                { findUniqueFacesItems(photos, true, 12).map((item, index) => (
                                    <GridListTile cols={ 1 } rows={ 1 } key={index} >
                                        {/* <img src={ sortPhotos(item.photos, "rating", false)[0].source_url } alt="face" /> */}
                                        <ImageOnDemand className="responsive-img"  image={ sortPhotos(item.photos, "rating", false)[0] } />
                                        <FaceTile item={ item } query={ query } callbackFilter={ callbackFilter } />
                                    </GridListTile>
                                )) }
                            </GridList>
                          
                        </>) :
                        (<>
                            
                            <Grid item xs={ 6 }  >
                                <h2>Personen</h2>
                            </Grid>
                            <Grid item xs={ 6 }  >
                                <CancelFilterAll query={ query } callbackFilter={ callbackFilter } photos={ photos } />
                            </Grid>

                            <GridList cols={ (size.width > 600) ? 6 : 2 } >
                                { findUniqueFacesItems(photos, true, 6).map((item, index) => (
                                    <GridListTile cols={ 1 } rows={ 1 }  key={index} >
                                        {/* <img src={ sortPhotos(item.photos, "rating", false)[0].source_url } alt="face" /> */}
                                        <ImageOnDemand className="responsive-img"  image={ sortPhotos(item.photos, "rating", false)[0] } />
                                        <FaceTile item={ item } query={ query } callbackFilter={ callbackFilter } />
                                    </GridListTile>
                                )) }
                            </GridList>


                            {/* <ButtonGroup variant="text" color="primary">
                                
                            </ButtonGroup> */}
                            { photos.length > 0 ?                            
                                (
                                    <Grid item xs={ 12 }  >
                                        <h1>Fotos von {query.faces.join(", ")}</h1>
                                        <ImageGrid photos={ sortedPhotos } initialGroup="year" showGroupSelector={ false } />
                                    </Grid>
                                )
                                : (<>
                                    <div className="card-panel blue darken-4 " >
                                        <h3 className="blue-text text-lighten-4 center">Keine Fotos von { query.faces.join(", ") } zusammen abgebildet sind. </h3>
                                    </div>
                                </>) }
                        </>) }

                </Grid>
            </Grid>
        </>
    )
}


const mapStateToProps = state => {

    const t0 = performance.now()

    let photos = state.photos

    let copyOfphotos = addSrcAndDirname(photos)
    copyOfphotos = filterFiles(copyOfphotos, state.query)

    const t1 = performance.now()
    console.log("filtering took " + (t1 - t0).toFixed(2) + " milliseconds.")

    // console.log("photos[0]:", photos[0])

    const query = state.query
    const token = state.token

    return { photos: copyOfphotos, query, token } // photos:photos
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ 
        setQueryFilter, 
        setMetadataOnImage, 
        addToQueryFilter, 
        removeFromQueryFilter }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(ImageFaces);