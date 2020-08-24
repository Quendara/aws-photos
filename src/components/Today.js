import React, { useState } from "react"; // , { useState }

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


import { CancelFilterAll } from "./CancelFilter"
import { ImageToday } from "./ImageToday"


import { setQueryFilter } from "../redux/actions"; // import default 
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";


import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";
import Grid from '@material-ui/core/Grid';

// init with function
export const store = createStore(rootReducer)



export const Today = ({
    photos,
    flavor = 'today',   // today, or imported
    query,
    setQueryFilter,     // from mapDispatchToProps
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token               // from mapStateToProps    
}) => {


    const callbackFilter = (key, value) => {

        console.log("callbackFilter : ", key, " : ", value)
        // current_filter[key] = value;
        // setCurrentFilter(current_filter)
        // filterFiles(current_filter)

        setQueryFilter(key, value)
    }

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start" >

            <Grid item xs={ 12 } lg={ 9 } >
                <CancelFilterAll query={ query } callbackFilter={ callbackFilter } photos={ photos } />
            </Grid>
            <Grid item xs={ 12 } lg={ 9 } >

                { (photos.length > 0) &&
                    <>
                        <ImageToday photos={ photos } flavor={ flavor } />
                    </> }
            </Grid>
        </Grid>

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



export default connect(mapStateToProps, mapDispatchToProps)(Today);