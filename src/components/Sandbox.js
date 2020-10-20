import React, { useState } from "react"; // , { useState }
// import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

// import SandboxList from "./SandboxList"

import { TopList } from "./TopList"
import { TopAutoComplete } from "./TopAutoComplete"
import { Clipboard } from "./Clipboard"


import ImageCarousel from "./ImageCarousel"
// import ImageGrid from "./ImageGrid"
// import ImageGrid2 from "./ImageGrid2"


import { setQueryFilter } from "../redux/actions"; // import default 
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";
import { Grid } from '@material-ui/core';



import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";

// init with function
export const store = createStore(rootReducer)





const Sandbox = ({
    photos,
    query,
    setQueryFilter,     // from mapDispatchToProps
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token               // from mapStateToProps    
}) => {

    const [showImage, setShowImage] = useState(true); // group, list, grid

    const [textmessage, setTextmessage] = useState(""); // group, list, grid

    const callbackFilter = (key, value) => {

        console.log("callbackFilter : ", key, " : ", value)
        // current_filter[key] = value;
        // setCurrentFilter(current_filter)
        // filterFiles(current_filter)

        setQueryFilter(key, value)
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

    const callbackTest = (key, value) => {
        let msg = key
        msg += ", "
        msg += value
        setTextmessage(msg)
    }



    return (
        <>

            <div className="row" >

                <div className="col s12 m3 l2 " >
                    { photos.length > 0 && <>

                        <div className="hide-on-med-and-down">
                            <TopAutoComplete photos={ photos } title="city" icon="location" limit="50" callback={ callbackTest } />
                        </div>
                    </> }
                </div>

                <div className="col s12 m9 l10" >
                    <Grid container>

                        <Clipboard state="Germany" country="NRW" city="Bochum" ></Clipboard>




                        { (showImage && photos.length > 0) &&
                            <>
                                { textmessage }
                                {/* <ImageGrid photos={ photos } limit="10" /> */ }
                                {/* <ImageCarousel photos={photos} currentIndex="0" /> */ }

                            </> }

                    </Grid>

                </div >
            </div >


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