import React, { useState } from "react";
import Settings from "./Settings"

// import { sortBy, groupBy } from "underscore";

import { Images } from "./components/Images";
import { TopList } from "./components/TopList";
import { CancelFilter } from "./components/CancelFilter";

import { Icon } from "./components/Icons";

import { mockdataBerlin } from "./data/mockdata_Berlin.js"
import { mockdataSizilien } from "./data/mockdata_Sizilien.js"
import { mockdataMadeira } from "./data/mockdata_Madeira.js"
import { mockdataHamburg } from "./data/mockdata_Hamburg.js"
import { mockdataPrag } from "./data/mockdata_Prag.js"
import { mockdataKroatien } from "./data/mockdata_Kroatien.js"
import { mockdataDenHaag } from "./data/mockdata_DenHaag.js"

// import { mockdata } from "./data/mockdata_full"

let mockdata = []
mockdata = mockdata.concat(mockdataBerlin)
mockdata = mockdata.concat(mockdataSizilien)
mockdata = mockdata.concat(mockdataMadeira)
mockdata = mockdata.concat(mockdataHamburg)
mockdata = mockdata.concat(mockdataPrag)
mockdata = mockdata.concat(mockdataKroatien)
mockdata = mockdata.concat(mockdataDenHaag)




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
    const [current_country, setCurrentCountry] = useState("");
    const [current_year, setCurrentYear] = useState("");
    const [current_rating, setCurrentRating] = useState("");
    const [current_dirname, setCurrentDirname] = useState("");

    const [view_images, setViewImages] = useState("group"); // group, list, grid


    const filterFiles = (year, country, city, rating) => {

        const t0 = performance.now()

        const list = items.filter(image => {

            // return true keeps the item in the list
            const bool1 = year === "" || +image.year === +year
            const bool2 = rating === "" || +image.rating >= +rating
            const bool3 = country === "" || image.country === country
            const bool4 = city === "" || image.city === city

            // console.log("+image.year === +year : ", +image.year, year, +image.year === +year)
            // console.log(bool1, bool2, bool3)
            return (bool1 && bool2 && bool3 && bool4)
        })


        const t1 = performance.now()
        console.log("filtering took " + (t1 - t0) + " milliseconds.")

        console.log("filterFiles : ", list.length);

        // updateViews(list)
        setCurrentItems(list)
    };

    const callbackYear = (x) => {

        console.log("year : ", x)
        setCurrentYear(x)
        filterFiles(x, current_country, current_city, current_rating)

    }
    const callbackCity = (x) => {
        console.log("loc : ", x)
        setCurrentCity(x)
        filterFiles(current_year, current_country, x, current_rating)
    }

    const callbackCountry = (x) => {
        console.log("loc : ", x)
        setCurrentCountry(x)
        filterFiles(current_year, x, current_city, current_rating)
    }

    const callbackRating = (x) => {
        console.log("rating : ", x)
        setCurrentRating(x)
        filterFiles(current_year, current_country, current_city, x)
    }

    const callbackDirname = (x) => {
        console.log("rating : ", x)
        setCurrentDirname(x)
        // filterFiles(current_year, current_country, current_city, x)
    }    

    

    // Settings.baseS3Bucket + "thumbs/
    // <button className="btn" onClick={() => listFiles} >Load </button>

    const imageApp = current_items.length ? (
        <Images photos={ current_items } view={ view_images } />
    ) : (
            <div className="" >
                <p className="center">
                    No images loaded
                    <br />

                </p>
            </div>
        )

    const toogleView = ({ view }) => {

        if (view_images == "grid") {
            setViewImages("group")
        }
        else if (view_images == "group") {
            setViewImages("list")
        }
        else {
            setViewImages("grid")
        }
    }

    return (
        <>




            <div className="row">
                <div className="col s12 m2">
                    <TopList photos={ current_items } title="year" icon="year" items={ year } callback={ callbackYear } />
                    <TopList photos={ current_items } title="rating" icon="rating" items={ rating } callback={ callbackRating } />
                    <TopList photos={ current_items } title="dirname" icon="dirname" items={ year } callback={ callbackDirname } />
                    <TopList photos={ current_items } title="country" icon="country" items={ location } callback={ callbackCountry } />
                    <TopList photos={ current_items } title="city" icon="location" items={ location } callback={ callbackCity } />

                </div>
                <div className="col s12 m10">
                    <div className="row">
                        <div className="offset-s2 col s6 center">
                        <CancelFilter value={ current_dirname } callback={ callbackDirname } />
                            <CancelFilter value={ current_year } callback={ callbackYear } />
                            <CancelFilter value={ current_rating } callback={ callbackRating } />
                            <CancelFilter value={ current_country } callback={ callbackCountry } />
                            <CancelFilter value={ current_city } callback={ callbackCity } />
                        </div>
                        <div className="offset-s2 col s2 center" onClick={ toogleView }>
                            <button className="btn blue" >{ view_images }</button> 
                        </div>
                    </div>
                    <div className="row">
                        { imageApp }
                    </div>

                    
                </div>
            </div>
        </>

    )
}



export { ImageApp };
