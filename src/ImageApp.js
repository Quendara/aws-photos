import React, { useState } from "react";
import Settings from "./Settings"

// import { sortBy, groupBy } from "underscore";

import { Images } from "./components/Images";
import { TopList } from "./components/TopList";
import { CancelFilter } from "./components/CancelFilter";
import { SelectionView } from "./components/SelectionView";
import { leadingZeros } from "./components/helpers";



import { Icon } from "./components/Icons";

import { mockdataBerlin } from "./data/mockdata_Berlin.js"
import { mockdataSizilien } from "./data/mockdata_Sizilien.js"
import { mockdataMadeira } from "./data/mockdata_Madeira.js"
import { mockdataHamburg } from "./data/mockdata_Hamburg.js"
import { mockdataPrag } from "./data/mockdata_Prag.js"
import { mockdataKroatien } from "./data/mockdata_Kroatien.js"
import { mockdataDenHaag } from "./data/mockdata_DenHaag.js"
import { mockdataItalien } from "./data/mockdata_Italien.js"

// import { mockdata } from "./data/mockdata_full"

let mockdata = []
mockdata = mockdata.concat(mockdataBerlin)
mockdata = mockdata.concat(mockdataSizilien)
mockdata = mockdata.concat(mockdataMadeira)
mockdata = mockdata.concat(mockdataHamburg)
mockdata = mockdata.concat(mockdataPrag)
mockdata = mockdata.concat(mockdataKroatien)
mockdata = mockdata.concat(mockdataDenHaag)
mockdata = mockdata.concat(mockdataItalien)




// This class contains the business logic of the application
const ImageApp = (props) => {

    const dummyLocations = []
    const dummyYear = []
    const dummyRating = []

    const [items, setItems] = useState(mockdata);
    const [rating, setRating] = useState(dummyRating);
    const [year, setYear] = useState(dummyYear);
    const [location, setLocation] = useState(dummyLocations);

    const filter = {
        country: "",
        state: "",
        city: "",
        sameday: "",
        dirname: "",
        year: "",
        rating: "",
        city: "",
    }

    // filtered
    const [current_items, setCurrentItems] = useState(mockdata);
    // const [current_city, setCurrentCity] = useState("");
    // const [current_country, setCurrentCountry] = useState("");
    // const [current_year, setCurrentYear] = useState("");
    // const [current_rating, setCurrentRating] = useState("");
    // const [current_dirname, setCurrentDirname] = useState("");
    const [current_filter, setCurrentFilter] = useState(filter);

    const [view_images, setViewImages] = useState("group"); // group, list, grid


    const filterFiles = (filter) => {

        const t0 = performance.now()

        const list = items.filter(image => {

            // return true keeps the item in the list
            const bool1 = filter.year === "" || +image.year === +filter.year
            const bool2 = filter.rating === "" || +image.rating >= +filter.rating
            const bool3 = filter.country === "" || image.country === filter.country
            const bool4 = filter.sameday === "" || image.sameday === filter.sameday

            const bool5 = filter.state === "" || image.state === filter.state
            const bool6 = filter.city === "" || image.city === filter.city
            const bool7 = filter.dirname === "" || image.dirname === filter.dirname

            // console.log("+image.year === +year : ", +image.year, year, +image.year === +year)
            // console.log(bool1, bool2, bool3)
            return (bool1 && bool2 && bool3 && bool4 && bool5 && bool6 && bool7)
        })


        const t1 = performance.now()
        console.log("filtering took " + (t1 - t0) + " milliseconds.")

        console.log("filterFiles : ", list.length);

        // updateViews(list)
        setCurrentItems(list)
    };

    const callbackFilter = (key, value) => {

        console.log("callbackFilter : ", key, " : ", value)
        current_filter[key] = value;
        setCurrentFilter(current_filter)
        filterFiles(current_filter)
    }

    const callbackView = (view) => {
        setViewImages(view)
    }

    const setToday = () => {
        const date = new Date()
        let today = leadingZeros(date.getMonth()+1)
        today += "-" + leadingZeros(date.getDate())

        callbackFilter('sameday', today)
    }


    const imageApp = current_items.length ? (
        <Images photos={ current_items } view={ view_images } />
    ) : (
            <div className="row" >
                <div className="offset-s2 col s8" >
                    <div className="card-panel blue-grey darken-1" >
                        <p className="blue-text center">
                            <h5>No images selected, please remove filter.</h5>
                        </p>
                    </div>
                </div>
            </div>
        )


    return (
        <>
            <div className="row">
                <div className="col s12">
                    <div className="m-2" ></div>
                </div>
                <div className="col s12 m2">
                    <button className="btn blue" onClick={ setToday } >Today</button>


                    <TopList photos={ current_items } title="year" icon="year" sortByCount={ false } items={ year } callback={ callbackFilter } />
                    <TopList photos={ current_items } title="rating" icon="rating" sortByCount={ false } items={ rating } callback={ callbackFilter } />
                    <TopList photos={ current_items } title="dirname" icon="dirname" items={ year } callback={ callbackFilter } />
                    <TopList photos={ current_items } title="country" icon="location" items={ location } callback={ callbackFilter } />
                    <TopList photos={ current_items } title="state" icon="location" items={ location } callback={ callbackFilter } />
                    <TopList photos={ current_items } title="city" icon="location" items={ location } callback={ callbackFilter } />

                </div>
                <div className="col s12 m10">
                    <div className="row">
                        <div className="offset-s2 col s6 center">

                            <CancelFilter value={ current_filter.sameday } filter={ "sameday" } callback={ callbackFilter } />
                            <CancelFilter value={ current_filter.dirname } filter={ "dirname" } callback={ callbackFilter } />
                            <CancelFilter value={ current_filter.year } filter={ "year" } callback={ callbackFilter } />
                            <CancelFilter value={ current_filter.rating } filter="rating" callback={ callbackFilter } />
                            <CancelFilter value={ current_filter.country } filter="country" callback={ callbackFilter } />
                            <CancelFilter value={ current_filter.state } filter="state" callback={ callbackFilter } />
                            <CancelFilter value={ current_filter.city } filter="city" callback={ callbackFilter } />
                        </div>
                        <div className="offset-s2 col s2 center" >
                            <SelectionView currentValue={ view_images } valueArr={ ['grid', 'list', 'group'] } callback={ callbackView } />
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
