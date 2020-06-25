import React from "react";

import { SimpleMap } from "./SimpleMap"
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { setRatingOnImage, setQueryFilter } from "../redux/actions"; // import default 

import { Map, TileLayer, Polyline, Marker, Popup } from "react-leaflet";

const ImageMap = ({
    photos,
    limit = 30,
    paging = false,
    view = "grid",
    sortBy,
    setRatingOnImage,   // from mapStateToProps
    setQueryFilter,
    token,              // from mapStateToProps
    ...rest }) => {

    const getMarker = (images) => {

        const list = images.filter(image => {
            if (image.lat === undefined || isNaN(image.lat) || parseInt(image.lat) === 0){
                console.log("OUT : ",image.lat)
                return false
            } 
            console.log("IN  : ",image.lat)
            return true
        })

        return list;             
    }

    const markers = getMarker(photos)

  const calcCenter = ( markers ) => {

    if( markers.length > 0 ){

        const markerC = markers[0]
        return [markerC.lat, markerC.long]
      // return markers[0] // .trackCoords[0];
    }        
  }    

    // <h5><Rating rating={ image.rating } id={ image.id } callback={ ratingCallback }  ></Rating></h5>
    const markerHtml = (image, index ) => (

        <Marker key={ index } position={ [image.lat, image.long] }>
            <Popup>
                <h4 className="mouse-pointer" onClick={() => setQueryFilter("month", image.month) }>{ image.month }</h4>
                <h5 className="mouse-pointer" onClick={() => setQueryFilter("country", image.country) }>{ image.country }</h5>
                
                <p className="mouse-pointer grey-text" onClick={() => setQueryFilter("city", image.city) }>{ image.city }  </p>
            <hr />
                { image.lat }, { image.long } <br/>
                <h5 className="mouse-pointer grey-text" onClick={() => setQueryFilter("dirname", image.dirname) }>{ image.dirname }</h5>
                { image.filename } <br/>
                { image.id } 
            </Popup>
        </Marker>

    )

    return (
        <div className="row">
            <div className="col s12">

                <div>
                    <SimpleMap markers={ markers } markerHtml={markerHtml} center={calcCenter(markers)}  />
                </div>
                <h6> { markers.length } / { photos.length }</h6>
            </div>
        </div >

    )
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setRatingOnImage, setQueryFilter }, dispatch)
  }
  
export default connect(null, mapDispatchToProps)(ImageMap);
  
