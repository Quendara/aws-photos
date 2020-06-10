import React, { useState } from "react";
import Settings from "./Settings"
import { Images } from "./Images";
import { sortBy, groupBy } from "underscore";

import { TopList } from "./components/TopList";
import { CancelFilter } from "./components/CancelFilter";

import { Icon } from "./components/Icons";
import {mockdata} from "./data/mockdata"



// This class contains the business logic of the application
const ImageApp = (props) => {

    const dummyLocations = []
    const dummyYear = []
    const dummyRating = []

    const [items, setItems] = useState(mockdata);
    const [rating, setRating] = useState(dummyRating);
    const [year, setYear] = useState(dummyYear);
    const [location, setLocation] = useState(dummyLocations);

    // filtered
    const [current_items, setCurrentItems] = useState(mockdata);
    const [current_city, setCurrentCity] = useState("");
    const [current_year, setCurrentYear] = useState("");
    const [current_rating, setCurrentRating] = useState("");

    const [view_images, setViewImages] = useState("grid"); // list, grid


    const filterFiles = (year, city, rating) => {

        const list = items.filter(image => {

            // return true keeps the item in the list
            const bool1 = year === "" || +image.year === +year
            const bool2 = rating === "" || +image.rating >= +rating            
            const bool3 = city === "" || image.city === city

            // console.log("+image.year === +year : ", +image.year, year, +image.year === +year)
            console.log(bool1, bool2, bool3)
            return (bool1 && bool2 && bool3)
        })

        console.log("filterFiles year: ", year, list.length);
        console.log("filterFiles rating: ", rating, list.length);
        console.log("filterFiles city: ", city, list.length);

        // updateViews(list)
        setCurrentItems(list)
    };

    const callbackYear = (x) => {

        console.log("year : ", x)
        setCurrentYear(x)
        filterFiles(x, current_city, current_rating)

    }
    const callbackLocation = (x) => {
        console.log("loc : ", x)
        setCurrentCity(x)
        filterFiles(current_year, x, current_rating)
    }
    const callbackRating = (x) => {
        console.log("rating : ", x)
        setCurrentRating(x)
        filterFiles(current_year, current_city, x)
    }

    // Settings.baseS3Bucket + "thumbs/
    // <button className="btn" onClick={() => listFiles} >Load </button>

    const imageApp = items.length ? (
        <Images photos={current_items} view={view_images} />
    ) : (
            <div className="" >
                <p className="center">
                    No images loaded
                    <br />
                    
                </p>
            </div>
        )

    const toogleView = ( {view } ) => {
        
        if( view_images == "grid" ){
            setViewImages( "list" )            
        }
        else{
            setViewImages( "grid" )
        }
    }

    return (
        <>
            
            <div className="row">
                <div className="offset-s2 col s6 center">
                    <CancelFilter value={current_year} callback={ callbackYear }  />
                    <CancelFilter value={current_rating} callback={ callbackRating }   />
                    <CancelFilter value={current_city} callback={ callbackLocation }   />
                </div>
                <div className="offset-s2 col s2 center" onClick={ toogleView }>
                {view_images}
                </div>
            </div>


            <div className="row">
                <div className="col s12 m2">
                    <TopList photos={current_items} title="year" icon="year" items={year} callback={callbackYear} />
                    <TopList photos={current_items} title="rating" icon="rating" items={rating} callback={callbackRating} />
                    <TopList photos={current_items} title="city" icon="location" items={location} callback={callbackLocation} />
                </div>
                <div className="col s12 m10">
                    {imageApp}
                </div>
            </div>
        </>

    )
}



export { ImageApp };
