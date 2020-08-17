import React, { useState } from "react"; // , { useState }
import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import { LeftMenu } from "./LeftMenu"
import ImageGroup from "./ImageGroup"

import { useWindowSize } from "./useWindowSize"

import { Icon } from "./Icons"

import { setQueryFilter } from "../redux/actions"; // import default 
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";


import { findUnique, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";
import { values } from "underscore";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Hidden from '@material-ui/core/Hidden';
import { ImageOnDemand } from "./ImageOnDemand";

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';

// import InfoIcon from '@material-ui/icons/Info';

// init with function
export const store = createStore(rootReducer)

const ImageFaces = ({
    photos,
    query,
    setQueryFilter,     // from mapDispatchToProps
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token               // from mapStateToProps    
}) => {


    const [showImage, setShowImage] = useState(true); // group, list, grid

    const size = useWindowSize();

    const callbackFilter = (key, value, add = true) => { // add = false means remove from ARRAY

        console.log("callbackFilter : ", key, " : ", value)
        // current_filter[key] = value;
        // setCurrentFilter(current_filter)
        // filterFiles(current_filter)

        let valueA = value

        console.log("query ", query)
        console.log("typeof value ", typeof value)

        if (key === "faces") {
            valueA = []
            if (typeof query.faces === "object") {
                valueA = query.faces
            }

            if (add === true) {
                const multiple = value.split(",")
                if (value === "") {
                    valueA = []
                }
                if (multiple.length >= 2) {
                    valueA = multiple
                }
                else {
                    // valueA = [value]
                    valueA.push(value)
                }
            }
            else {
                // remove
                const index = valueA.indexOf(value)
                if (index >= 0) {
                    valueA.splice(index, 1); // index, how many
                    // delete valueA[index];  
                }

            }

            console.log("valueA", valueA)
        }

        setQueryFilter(key, valueA)
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

    const getUniqueFacesItems = (photos) => {
        const group = "faces"
        const sortByCount = true
        const limit = 100

        let faces = findUnique(photos, group, sortByCount, limit)

        const list = faces.filter(image => {
            if( image === undefined ) return false
            if( image.value === undefined ) return false
            if( image.value === "undefined" ) return false
            if( image.value.length === 0 ) return false
            return image.value.split(",").length < 2
            return true
        })
        return list
    }


    const facesHeader = (query) => {

        const names = ["Andre", "Irena", "Jonna", "Juri", "Gaby", "Reinhard", "Marian", "Matthias", "Petra"]


        return names.map(name => {
            return (<Button color={ facesHeaderClass(name, query) } onClick={ () => callbackFilter("faces", name, !query.includes(name)) } >{ name }</Button>)
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

                            <GridList cols={ (size.width > 600) ? 5 : 2 } >
                                { getUniqueFacesItems(photos).map((item, index) => (

                                        <GridListTile cols={1} rows={1} >
                                            {/* onClick={ () => callback(title, item.value) } */ }
                                            {/* callbackFilter("faces", item.value, !query.includes(item.value)) */ }

                                            <img src={ sortPhotos( item.photos, "rating", false  )[0].source_url } alt={ index } />
                                            <GridListTileBar
                                                    title={ item.value }
                                                    subtitle={<span>count : { item.count }</span>}
                                                    onClick={ () => callbackFilter("faces", item.value, !query.faces.includes(item.value)) }
                                                    actionIcon={
                                                        <IconButton aria-label={`info about ${item.value}`} >
                                                            <Icon Icon="face" />
                                                        </IconButton>
                                                   }
                                                    />
                                        </GridListTile>
                                )) }
                            </GridList>
                        </>) :
                        (<>
                            <ButtonGroup variant="text" color="primary">
                                { facesHeader(query.faces) }
                            </ButtonGroup>
                            { photos.length > 0 ?
                                (<ImageGroup photos={ photos } initialGroup="year" showGroupSelector={ false } />)
                                : (<>
                                    <div className="card-panel blue darken-4 " >
                                        <h3 className="blue-text text-lighten-4 center">Keine Fotos von wo { query.faces.join(", ") } zusammen abgebildet sind. </h3>
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
    return bindActionCreators({ setQueryFilter, setMetadataOnImage }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(ImageFaces);