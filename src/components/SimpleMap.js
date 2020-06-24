import React, { Component } from "react";
import { Map, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import {toGeoJSON}  from "./toGeoJSON"
// import "react-leaflet-markercluster/dist/styles.min.css";
import './map_style.css';

const  SimpleMap = ({tracks = [], markers = []}) => {

  const zoom = 4
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     tracks: [],
  //     markerArr: [], // getRandPositions(10, position);
  //     centerPosition: [],
  //     zoom: 11
  //   };
  //   // get center of the    
  // }

  const calcCenter = () => {
    if( tracks.length > 0 ){
      return tracks[0].trackCoords[0];
    }
    if( markers.length > 0 ){
      return markers[0] // .trackCoords[0];
    }        
  }

    return (
      <Map center={ calcCenter() } zoom={ zoom } >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
        />

      { tracks.map((track, index) => (
          <>
            <Marker position={track.trackCoords[0]}>
              <Popup>
                <b>Tour</b> <br/> {track.name}
                <hr />
                {track.time}
                <hr />
                {track.trackCoords[0]}, {track.trackCoords[1]}
              </Popup>
            </Marker>

            <Polyline color={track.color} positions={track.trackCoords} />
          </>
        ))}  

        { markers.map((item, index) => (
          <Marker key={index} position={item}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
              <hr />
              {item[0]}, {item[1]}
            </Popup>
          </Marker>
        ))}                   



  
      </Map>

    )
}

export { SimpleMap };
