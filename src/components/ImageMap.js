import React, { useState } from "react";

import { SimpleMap } from "./SimpleMap"
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { setRatingOnImage, setQueryFilter } from "../redux/actions"; // import default 
import { findUnique } from "./helpers"
import { ImageOnDemand } from "./ImageOnDemand";

import { Map, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { values } from "underscore";

const ImageMap = ({
    photos,
    limit = 30,
    paging = false,
    view = "grid",
    sortBy,
    setRatingOnImage,   // from mapDispatchToProps
    setQueryFilter,     // from mapDispatchToProps
    token,              // from mapStateToProps
    ...rest }) => {

    const [zoom, setZoom] = useState(4);

    const getMarker = (images) => {

        const group = "city"
        const sortByCount = true
        const limit = 40

        const groups = findUnique(images, group, sortByCount, limit)

        let list = []

        groups.map((item, index) => {
            // list.app item.photos             
            list.push(...item.photos.slice(0, 10))
        })

        return list;

        const filterAll = false

        if (filterAll) {

            const list = images.filter(image => {
                if (image.lat === undefined || isNaN(image.lat) || parseInt(image.lat) === 0) {
                    console.log("OUT : ", image.lat)
                    return false
                }
                console.log("IN  : ", image.lat)
                return true
            })

            return list;
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
                        <a className="btn blue m-2" onClick={ () => setMissing(image.id) }  >Missing</a>
                    </div>
                </div>
            </Popup>
        </Marker >

    )

    return (
        <div className="row">
            <div className="col s12">

                <div>
                    <SimpleMap markers={ markers } markerHtml={ markerHtml } zoom={ zoom } center={ calcCenter(markers) } />
                </div>
                <h6> { markers.length } / { photos.length }</h6>
            </div>
        </div >

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

