import React, { } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import {toGeoJSON}  from "./toGeoJSON"
// import "react-leaflet-markercluster/dist/styles.min.css";
import './map_style.css';

// item is [x,y]
const basicMarkerHtml = (item, index) => (
  <Marker key={ index } position={ item }>
    <Popup>
      Passed in PopUp<br /> Easily customizable.
      <hr />
      { item[0] }, { item[1] }
    </Popup>
  </Marker>

)

const SimpleMap = ({ tracks = [], markers = [], zoom = 4, center = [40, 10], markerHtml = basicMarkerHtml }) => {

  // const zoom = 4

  // const calcCenter = () => {
  //   if( tracks.length > 0 ){
  //     return tracks[0].trackCoords[0];
  //   }
  //   if( markers.length > 0 ){
  //     // return markers[0] // .trackCoords[0];
  //   }        
  // }

  return (
    <Map center={ center } zoom={ zoom } >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
      />

      { tracks.map((track, index) => (
          <Marker key={index} position={ track.trackCoords[0] }>
            <Popup>
              <b>Tour</b> <br /> { track.name }
              <hr />
              { track.time }
              <hr />
              { track.trackCoords[0] }, { track.trackCoords[1] }
            </Popup>
          </Marker>
      )) }

      { markers.map((item, index) => (
        <span key={index} >
          { markerHtml(item, index) }
        </span>
      )) }




    </Map>

  )
}

export { SimpleMap };
