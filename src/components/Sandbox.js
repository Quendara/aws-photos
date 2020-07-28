import React, { useState } from "react"; // , { useState }
import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import SandboxList from "./SandboxList"

import { TopList } from "./TopList"
import { CancelFilter } from "./CancelFilter"
import { ImageCarousel } from "./ImageCarousel"


import { setQueryFilter } from "../redux/actions"; // import default 
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";


import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";

// init with function
export const store = createStore(rootReducer)



export const Sandbox = ({ 
    photos, 
    query, 
    setQueryFilter,     // from mapDispatchToProps
    setRatingOnImage,   // from mapDispatchToProps
    setMetadataOnImage, // from mapDispatchToProps
    token               // from mapStateToProps    
}) => {

    const [showImage, setShowImage] = useState(true); // group, list, grid

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

    // <div className="col s3" >
    //     <TopList photos={ photos } title="year" icon="rating" sortByCount={ false } callback={ callbackFilter } />
    //     <TopList photos={ photos } title="city" icon="city" sortByCount={ true } callback={ callbackFilter } />
    // </div>    

    const closeView = () => {
        setShowImage( false )
    }

    const ratingCallback = (id, rating) => {

        if (setRatingOnImage === undefined) {
          console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
          return;
        }
        console.log("callbackLocal", id, rating )
        // setRatingOnImage(id, rating, token.access )
    
      }    

      const updateMetadataCallback = (id, what, newValue ) => {

        // if (setRatingOnImage === undefined) {
        //   console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
        //   return;
        // }
        console.log("Update '" + what + "' to '" + newValue + "' ImageID : " + id )
        setMetadataOnImage( id, what, newValue, token.access )
    
      }    



      

    return (
        <>

            <div className="row" >

                <div className="col s9" >

                    <h1>HELLO SANDBOX ;) { photos.length }</h1>

                    { (showImage && photos.length > 0) &&
                        <>
                            <ImageCarousel photos={ photos } currentIndex={ 0 } closeCallback={ closeView } ratingCallback={ratingCallback} updateMetadataCallback={updateMetadataCallback} />

                        </> }

                </div>
            </div>


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