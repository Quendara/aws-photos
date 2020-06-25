import React, { useState } from "react";
// import Settings from "./Settings"
// import { sortBy, groupBy } from "underscore";

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


import { Images } from "./ImagesRouter";
import { TopList } from "./TopList";
import { CancelFilter } from "./CancelFilter";
import { SelectionView } from "./SelectionView";
import { leadingZeros, sortPhotos } from "./helpers";

import Settings from "../Settings"

import { setQueryFilter } from "../redux/actions"; // import default 

// import { Icon } from "./components/Icons";

// This class contains the business logic of the application
const ImageApp = ({ photos, query, setQueryFilter }) => {

    const [view_images, setViewImages] = useState("group"); // group, list, grid
    const [view_sort, setViewSort] = useState("date"); // rating, date

    const callbackFilter = (key, value) => {

        console.log("callbackFilter : ", key, " : ", value)
        // current_filter[key] = value;
        // setCurrentFilter(current_filter)
        // filterFiles(current_filter)

        setQueryFilter(key, value)
    }

    // setQueryFilter("rating", 3)

    const callbackView = (view) => {
        setViewImages(view)
    }
    const callbackSort = (view) => {
        setViewSort(view)
    }

    const setToday = () => {
        const date = new Date()
        let today = leadingZeros(date.getMonth() + 1)
        today += "-" + leadingZeros(date.getDate())

        callbackFilter('sameday', today)
    }

    const sortedPhotos = sortPhotos(photos, view_sort)

    const filteredOn = () => {
        let size = query.sameday.length
        size += query.dirname.length
        size += query.year.length
        size += query.month.length
        size += query.rating.length

        return (size > 0) // return true when one filter is active

    }


    const imageApp = sortedPhotos.length ? (
        <Images photos={ sortedPhotos } view={ view_images } sortBy={ view_sort } />
    ) : (
            <div className="row" >
                <div className="offset-s3 col s6" >
                    <h1><br /></h1>
                    <div className="card-panel blue darken-4 " >

                        { filteredOn() ? (
                            <>
                                <h3 className="blue-text text-lighten-4 center">No images, please deselect at least one filter.</h3>
                                <div className="divider" /><br /><br />
                                <CancelFilter value={ query.sameday } filter={ "sameday" } callback={ callbackFilter } />
                                <CancelFilter value={ query.dirname } filter={ "dirname" } callback={ callbackFilter } />
                                <CancelFilter value={ query.year } filter={ "year" } callback={ callbackFilter } />
                                <CancelFilter value={ query.month } filter={ "month" } callback={ callbackFilter } />
                                <CancelFilter value={ query.rating } filter="rating" callback={ callbackFilter } />
                                <CancelFilter value={ query.country } filter="country" callback={ callbackFilter } />
                                <CancelFilter value={ query.state } filter="state" callback={ callbackFilter } />
                                <CancelFilter value={ query.city } filter="city" callback={ callbackFilter } />
                            </>

                        ) :
                            (
                                <>
                                    <h5 className="blue-text text-lighten-4 center">Loading...</h5>
                                    <h1><br /></h1>
                                    <div className="progress">
                                        <div className="indeterminate"></div>
                                    </div>
                                    <h1><br /></h1>
                                </>
                            )
                        }

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
                <div className="col s12 l2 hide-on-med-and-down">

                    { sortedPhotos.length>0 && <>
                        <button className="btn blue" onClick={ setToday } >Today</button>

                        <TopList photos={ photos } title="year" icon="year" limit="10" sortByCount={ false } callback={ callbackFilter } />
                        { query.year.length > 0 &&
                            <TopList photos={ photos } title="month" icon="month" limit="12" sortByCount={ false } callback={ callbackFilter } />
                        }

                        <TopList photos={ photos } title="dirname" icon="dirname" limit="7" callback={ callbackFilter } />
                        <TopList photos={ photos } title="rating" icon="rating" limit="5" sortByCount={ false } callback={ callbackFilter } />
                        <TopList photos={ photos } title="country" icon="location" limit="5" callback={ callbackFilter } />
                        <TopList photos={ photos } title="state" icon="location" limit="5" callback={ callbackFilter } />
                        <TopList photos={ photos } title="city" icon="location" limit="5" callback={ callbackFilter } />
                    </> }

                </div>
                <div className="col s12 l10">
                    <div className="row">
                        <div className="col offset-m1  m6 s12 center">
                            <CancelFilter value={ query.sameday } filter={ "sameday" } callback={ callbackFilter } />
                            <CancelFilter value={ query.dirname } filter={ "dirname" } callback={ callbackFilter } />
                            <CancelFilter value={ query.year } filter={ "year" } callback={ callbackFilter } />
                            <CancelFilter value={ query.month } filter={ "month" } callback={ callbackFilter } />
                            <CancelFilter value={ query.rating } filter="rating" callback={ callbackFilter } />
                            <CancelFilter value={ query.country } filter="country" callback={ callbackFilter } />
                            <CancelFilter value={ query.state } filter="state" callback={ callbackFilter } />
                            <CancelFilter value={ query.city } filter="city" callback={ callbackFilter } />
                        </div>
                        <div className="col m5 s12  center" >
                            <SelectionView currentValue={ view_images } valueArr={ ['group', 'grid', 'list', 'map'] } callback={ callbackView } />

                            <span className="m-2 blue-text">Sorting</span>
                            <SelectionView currentValue={ view_sort } iconsOnly={ true } valueArr={ ['date', 'rating'] } callback={ callbackSort } />
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

const filterFiles = (images, query) => {

    const list = images.filter(image => {

        // filter all below 0
        // missing & deleted -1

        let rating = 0;
        if (query.rating != "") {
            rating = query.rating
        }

        const boolWidth = image.width !== 666 // remove images with the initial width of 666 (error state)

        const bool1 = +image.rating >= rating

        // return true keeps the item in the list
        const bool2 = query.year === "" || +image.year === +query.year // true when year is not given or equel
        const bool3 = query.dirname === "" || image.dirname === query.dirname

        if (boolWidth === false || bool1 === false || bool2 === false || bool3 === false) { // if one is false return false, skip this photo
            return false; // realy exit
        }

        const bool4 = query.month === "" || image.month === query.month
        const bool5 = query.day === "" || image.country === query.day
        const bool6 = query.sameday === "" || image.sameday === query.sameday

        const bool7 = query.country === "" || image.country === query.country
        const bool8 = query.state === "" || image.state === query.state
        const bool9 = query.city === "" || image.city === query.city


        // console.log("+image.year === +year : ", +image.year, year, +image.year === +year)
        // console.log(bool1, bool2, bool3)
        // #return (bool1 && bool2 && bool3 && bool4 && bool5 && bool6 && bool7 && bool8 && bool9)
        return (bool4 && bool5 && bool6 && bool7 && bool8 && bool9)
    })

    console.log("filterFiles : ", list.length);

    // updateViews(list)
    // setCurrentItems(list)
    return list
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setQueryFilter }, dispatch)
}

const addSrcAndDirname = (images) => {

    // const reduceditems = images.slice(0, size) // reduce    

    return images.map((image) => {

        let retImage = Object.assign({}, image)

        // let retImage = image

        if (image.country === undefined) { retImage['country'] = "Unknown Country" }
        if (image.city === undefined) { retImage['city'] = "Unknown City" }
        if (image.state === undefined) { retImage['state'] = "Unknown State" }

        retImage["source_url"] = Settings.baseS3Bucket + image.dirname + "/" + image.filename
        retImage["src"] = image.id

        if (image.dirname_logical !== undefined) {
            retImage['dirname_physical'] = image.dirname
            retImage.dirname = image.dirname_logical
        }

        // swap width height when image is rotated
        if (image.orientation === "90CW" || image.orientation === "90CCW") {
            const oldWidth = image.width
            retImage.width = image.height
            retImage.height = oldWidth
        }

        if (image.width === undefined) {
            console.error("width is invalid : ", image.filename)
        }


        return retImage
    })
}

const mapStateToProps = state => {

    const t0 = performance.now()

    let photos = state.photos

    // photos = photos.map((image) => {
    //     if (image.country === undefined) { image['country'] = "Unknown Country" }
    //     if (image.city === undefined) { image['city'] = "Unknown City" }
    //     if (image.state === undefined) { image['state'] = "Unknown State" }

    //     return image
    // })

    let copyOfphotos = addSrcAndDirname(photos)
    copyOfphotos = filterFiles(copyOfphotos, state.query)

    const t1 = performance.now()
    console.log("filtering took " + (t1 - t0).toFixed(2) + " milliseconds.")

    console.log("photos[0]:", photos[0])

    const query = state.query

    return { photos: copyOfphotos, query } // photos:photos
}


export default connect(mapStateToProps, mapDispatchToProps)(ImageApp);

// export { ImageApp };
