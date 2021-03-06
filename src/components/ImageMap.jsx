import React, { useState } from "react";

import { SimpleMap } from "./SimpleMap"
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { setRatingOnImage, setQueryFilter } from "../redux/actions"; // import default 
import { findUnique } from "./helpers"
import { ImageOnDemand } from "./ImageOnDemand";

import { Marker, Popup } from "react-leaflet";

import Grid from '@material-ui/core/Grid';

const ImageMap = ({
    photos,
    limit = 30,
    paging = false,
    sortBy,
    setRatingOnImage,   // from mapDispatchToProps
    setQueryFilter,     // from mapDispatchToProps
    token,              // from mapStateToProps
    ...rest }) => {

    const [zoom, setZoom] = useState(4);

    const filterImagesWithoutCoords = (images ) => {

        let inCount = 0
        let inQuantCount = 0
        let outCount = 0

        let uniqueLocations = {}

        const imagesWithCoords = images.filter(image => {

            if (image.lat === undefined || isNaN(image.lat) || parseInt(image.lat) === 0) {
                //console.log("OUT : ", image.lat)
                ++outCount
                return false
            }
            ++inCount

            const intLat = parseInt(image.lat*1000)

            if( uniqueLocations[intLat] === undefined ){
                uniqueLocations[intLat] = { count:0 };
                ++inQuantCount
                return true
            }
            else {
                
            }

            // if( inCount > 100 ){ return false}
            // console.log("IN  : ", image.lat)
            return false
        })

        console.log("filterImagesWithoutCoords in/total : ", inCount, (inCount+outCount) , inQuantCount )

        return imagesWithCoords;
    }        

    const getMarker = (images) => {

        let imagesWithCoords = filterImagesWithoutCoords( images )

        if (images.length > 500) {

            // group by cities

            const group = "city"
            const sortByCount = true
            const limit = 80

            const groups = findUnique(imagesWithCoords, group, sortByCount, limit)

            let imagesFromGroups = []

            groups.map((item, index) => {
                // list.app item.photos             
                imagesFromGroups.push(...item.photos.slice(0, 10))
                return undefined
            }) 
            return imagesFromGroups;
        } 
        else {
            return imagesWithCoords; 
        }
    }

    const setMissing = (photo_id) => {
        const newRating = -10
        ratingCallback(photo_id, newRating);
    }

    const ratingCallback = (id, rating) => {

        if (setRatingOnImage === undefined) {
            console.error("callbackLocal - setRatingOnImage is undefined", id, rating);
            return;
        }
        console.log("callbackLocal", id, rating, setRatingOnImage)
        setRatingOnImage(id, rating, token.access)
    }

    const markers = getMarker(photos)

    const setQueryFilterLocal = (group, value) => {
        setZoom(6)
        setQueryFilter(group, value)
    }


    const calcCenter = (markers) => {

        if (markers.length > 0) {
            const markerC = markers[parseInt(markers.length / 2)]
            return [markerC.lat, markerC.long]
            // return markers[0] // .trackCoords[0];
        }
    }

    // 
    // <h5><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></h5>
    const markerHtml = (image, index) => (

        <Marker key={ index } position={ [image.lat, image.long] }>
            <Popup>
                <div className="row" >
                    <div className="col s12" >
                        <h5 className="mouse-pointer" onClick={ () => setQueryFilterLocal("country", image.country) }>{ image.country } </h5>
                    </div>
                    <div className="col s12" >
                        <span className="mouse-pointer grey-text" onClick={ () => setQueryFilterLocal("city", image.city) }>{ image.city }  </span>
                        <span className="badge grey-text mouse-pointer" onClick={ () => setQueryFilterLocal("month", image.month) } >{ image.month }</span>
                        <ImageOnDemand className="responsive-img" image={ image } />
                    </div>
                    <div className="col s12" >
                        <h5>
                            <span className="mouse-pointer blue-text" onClick={ () => setQueryFilterLocal("dirname", image.dirname) } >{ image.dirname }</span>
                            <span className="grey-text text-lighten-4" > / { image.filename } </span>
                        </h5>
                    </div>
                    <div className="col s12" >
                        <hr />
                        <span className="badge">{ image.lat }, { image.long } </span>
                        <button className="btn blue m-2" onClick={ () => setMissing(image.id) }  >Missing</button>
                    </div>
                </div>
            </Popup>
        </Marker >

    )

    return (
        <Grid container item xs={ 12 } lg={12}  >
            <div style={{width:"100%"}}> 
                <div>
                    <SimpleMap markers={ markers } markerHtml={ markerHtml } zoom={ zoom } center={ calcCenter(markers) } />
                </div>
                <h6> { markers.length } / { photos.length }</h6>
            </div>
        </Grid >

    )
}

const mapStateToProps = state => {

    // const photos = state.photos
    // const photos = filterFiles(state.photos, state.query)
    const token = state.token

    return { token } // photos:photos
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setRatingOnImage, setQueryFilter }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageMap);

