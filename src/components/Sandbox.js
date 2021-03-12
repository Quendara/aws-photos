import React, { useState, useEffect } from "react"; // , { useState }
// import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import { CancelFilter } from "./CancelFilter"

import { TopAutoComplete } from "./TopAutoComplete"
import { Clipboard } from "./Clipboard"
import { Dropzone } from "./Dropzone"


// import ImageGrid from "./ImageGrid"
// import ImageGrid2 from "./ImageGrid2"

import { setQueryFilter } from "../redux/actions"; // import default 
import { setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";
import { Grid, Divider } from '@material-ui/core';

import { restCallToBackendAsync } from "./helpers"


import ImageCarousel from "./ImageCarousel"
import { ImageOnDemand } from "./ImageOnDemand"



import { filterFiles, addSrcAndDirname } from "./helpers";

// init with function
export const store = createStore(rootReducer)


const Video = ({ folder, item }) => {

    const endpoint = " https://srxdhyyhm2.execute-api.eu-central-1.amazonaws.com/dev/photoData"

    const [surl, setSUrl] = useState("")

    const url = [endpoint, folder, item, "raw"].join("/")

    useEffect(() => {
        // const signed_url = ""
        restCallToBackendAsync(url).then(data => {
            console.log( "signed_url", data )
            setSUrl(data.presigned_url)
        })
    }, [item]);

    // <b>{ folder } -- { item }</b>
    // <Divider />
    // <p>{ url }</p>
    // <Divider />
    // {surl}


    return (
        <>
            {surl &&
                <video controls style={ { backgroundColor: "#2D2D31", width: "100%" } } preload="metadata" muted>
                    <source src={surl} type="video/mp4" />
                </video>
            }
        </>

    )

    // <p>{signed_url}</p>

}


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
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start" >

            { /* photos.length > 0 && <ImageCarousel photos={photos} currentIndex={0} /> */ }
            {/* https://srxdhyyhm2.execute-api.eu-central-1.amazonaws.com/dev/2020%20-%20Porto/20200731_164555000_iOS.MOV/raw */ }

            <Grid item xs={ 12 } md={4} >
                <Video folder={"2020 - Porto"} item={"20200731_164555000_iOS.MOV"} />
            </Grid>
            <Grid item xs={ 12 } md={4} >
                <Video folder={"2020 - Porto"} item={"20200729_222429000_iOS.MOV"} />
            </Grid>
            <Grid item xs={ 12 } md={4} >
                <Video folder={"2020 - Porto"} item={"20200801_222246000_iOS.MOV"} />
            </Grid>            
        </Grid>
    )
}

// https://quendara-images-original.s3.amazonaws.com/2020%20-%20Porto/20200731_164555000_iOS.MOV?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUDZ4WIUOP6O2V4N3%2F20210312%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20210312T132601Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=33c72b5c3933df8accace43401c38384cc376d74785a419a49e100d35060e5ca



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