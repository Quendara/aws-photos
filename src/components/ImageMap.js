import React from "react";

import { SimpleMap } from "./SimpleMap"

export const ImageMap = ({
    photos,
    limit = 30,
    paging = false,
    view = "grid",
    sortBy,
    setRatingOnImage,   // from mapStateToProps
    token,              // from mapStateToProps
    ...rest }) => {

    const getMarker = (images) => {

        const list = images.filter(image => {
            if (image.lat === undefined || parseInt( image.lat ) === 0) return false
            console.log( image.lat )
            return true
        })

        return list.map((image) => {
            return [image.lat, image.long]
        })
    }

    const marker = getMarker(photos)

    return (
        <div className="row">
            <div className="col s12">
                <h1> { marker.length } / { photos.length }</h1>
                <div className="leaflet-container ">
                    <SimpleMap markers={ marker } />
                </div>
            </div>
        </div >

    )

}
