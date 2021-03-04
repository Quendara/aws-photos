import React, { useState } from "react"; // , { useState }
// import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import {CancelFilter} from "./CancelFilter"

import { TopAutoComplete } from "./TopAutoComplete"
import { Clipboard } from "./Clipboard"
import { Dropzone } from "./Dropzone"


// import ImageGrid from "./ImageGrid"
// import ImageGrid2 from "./ImageGrid2"

import { setQueryFilter } from "../redux/actions"; // import default 
import { setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";
import { Grid, Card } from '@material-ui/core';


import ImageCarousel from "./ImageCarousel"


import { filterFiles, addSrcAndDirname } from "./helpers";

// init with function
export const store = createStore(rootReducer)





const Sandbox = ({
    photos,
    setQueryFilter,     // from mapDispatchToProps
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token               // from mapStateToProps    
}) => {

    const [showImage, setShowImage] = useState(true); // group, list, grid

    const [textmessage, setTextmessage] = useState(""); // group, list, grid








    const callbackTest = (key, value) => {
        let msg = key
        msg += ", "
        msg += value
        setTextmessage(msg)
    }



    return (
        <>

        <h1>Test</h1>


        { photos.length > 0 && <ImageCarousel photos={photos} currentIndex={0} /> }


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



export default connect(mapStateToProps, mapDispatchToProps)(Sandbox);