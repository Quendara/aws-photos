import React, { useState } from "react"; // , { useState }
import { Provider } from 'react-redux'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


import { TopList } from "./TopList"
import { CancelFilter } from "./CancelFilter"
import { ImageCarousel } from "./ImageCarousel"
import ImageGrid from "./ImageGrid"


import { setQueryFilter } from "../redux/actions"; // import default 
import { setRatingOnImage, setMetadataOnImage } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";


import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";
import { values } from "underscore";

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
    
    const callbackFilter = (key, value) => {

        console.log("callbackFilter : ", key, " : ", value)
        // current_filter[key] = value;
        // setCurrentFilter(current_filter)
        // filterFiles(current_filter)

        console.log( "query.faces ", query.faces )
        console.log( "query.faces typeof", typeof query.faces )

        let valueA = []
        if( typeof query.faces === "object" ){
            valueA = query.faces

        }

        

        if( value === "" ){
            valueA = []
        }
        else{
            // valueA = [value]
            valueA.push( value )
            // if( typeof query.faces === "string" )
            // {
            //     valueA = [value]
            // }
            // else{ // expect ARRAY
            //     valueA = query.faces.push( value )
            // }
            
        }

        console.log( "valueA", valueA )

        

        setQueryFilter(key, valueA )
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

    //  

    const printQuery = (query) => {
        return query.join( ", ")
    }

    return (
        <>

            <div className="row" >

                <div className="col s12 m3 l2 " >
                    { photos.length > 0 && <>

                        <TopList photos={ photos } title="year" icon="year" limit="10" sortByCount={ false } callback={ callbackFilter } />

                        { query.year.length > 0 &&
                            <>
                                <TopList photos={ photos } title="month" icon="month" limit="12" sortByCount={ false } callback={ callbackFilter } />
                            </>
                        }
                        <TopList photos={ photos } title="dirname" icon="dirname" limit="9" sortByCount={ false } callback={ callbackFilter } />

                        <div className="hide-on-med-and-down">

                            <TopList photos={ photos } title="country" icon="location" limit="5" callback={ callbackFilter } />
                            <TopList photos={ photos } title="state" icon="location" limit="5" callback={ callbackFilter } />
                            <TopList photos={ photos } title="city" icon="location" limit="5" callback={ callbackFilter } />
                        </div>
                    </> }
                </div>

                <div className="col s12 m9 l10" >

                        

                        <button className="btn red m-2" onClick={ () => callbackFilter("faces", "" ) } >{ printQuery( query.faces ) }</button>

                   

                    <button className="btn m-2" onClick={ () => callbackFilter("faces", "Andre" ) } >Andre</button>
                    <button className="btn m-2" onClick={ () => callbackFilter("faces", "Irena" ) } >Irena</button>
                    <button className="btn m-2" onClick={ () => callbackFilter("faces", "Juri" ) } >Juri</button>
                    <button className="btn m-2" onClick={ () => callbackFilter("faces", "Jonna" ) } >Jonna</button>
                    <button className="btn m-2" onClick={ () => callbackFilter("faces", "Gaby" ) } >Gaby</button>
                    <button className="btn m-2" onClick={ () => callbackFilter("faces", "Reinhard" ) } >Reinhard</button>
                    <button className="btn m-2" onClick={ () => callbackFilter("faces", "Marian" ) } >Marian</button>
                    


                    { (showImage && photos.length > 0) &&
                        <>
                            <ImageGrid photos={ photos } limit="15" />
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



export default connect(mapStateToProps, mapDispatchToProps)(ImageFaces);