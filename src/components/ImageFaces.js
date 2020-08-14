import React, { useState } from "react"; // , { useState }
import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import { LeftMenu } from "./LeftMenu"
import ImageGroup from "./ImageGroup"


import { setQueryFilter } from "../redux/actions"; // import default 
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";


import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";
import { values } from "underscore";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';


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

    const callbackFilter = (key, value, add = true) => { // add = false means remove from ARRAY

        console.log("callbackFilter : ", key, " : ", value)
        // current_filter[key] = value;
        // setCurrentFilter(current_filter)
        // filterFiles(current_filter)

        let valueA = value

        console.log("query ", query)

        if (key === "faces") {
            valueA = []
            if (typeof query.faces === "object") {
                valueA = query.faces
            }

            if (add === true) {
                if (value === "") {
                    valueA = []
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
                justify="flex-start"
                alignItems="flex-start" >

                <Grid container item xs={ 12 } lg={2}  >
                    { photos.length > 0 && <LeftMenu photos={ photos } query={ query } callbackFilter={ callbackFilter } /> }
                </Grid>                 
                <Grid container item xs={ 12 } lg={10} spacing={2} >

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