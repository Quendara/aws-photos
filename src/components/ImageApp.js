import React, { useState } from "react";
// import Settings from "./Settings"
// import { sortBy, groupBy } from "underscore";

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


import { Images } from "./ImagesRouter";
import { TopList } from "./TopList";
import { CancelFilterAll } from "./CancelFilter";
import { SelectionView } from "./SelectionView";
import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";

// import Settings from "../Settings"

import { setQueryFilter } from "../redux/actions"; // import default 
import { Rating } from "./Rating";

import { Icon } from "./Icons"

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
                            <div  >
                                <h3 className="blue-text text-lighten-4 center">No images, please deselect at least one filter.</h3>
                                <div className="divider" /><br /><br />
                                <CancelFilterAll query={query} callbackFilter={ callbackFilter } />
                            </div>

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


    // <button className="btn blue" onClick={ setToday } >Today</button>
    // <TopList photos={ photos } title="rating" icon="rating" limit="5" sortByCount={ false } callback={ callbackFilter } />

    return (
        <>
            <div className="row">
                <div className="col s12">
                    <div className="m-2" ></div>
                </div>
                <div className="col s12 m3 l2 ">
                    { sortedPhotos.length > 0 && <>

                        <h6><Icon icon="rating" className="mr-2" /> Rating </h6>
                        <div className="row">
                            <div className="col m-1 offset-s1  s11" >
                                <Rating rating={ query.rating } id="rating" callback={ callbackFilter } ></Rating>
                            </div>
                        </div>

                        <TopList photos={ photos } title="year" icon="year" limit="10" sortByCount={ false } callback={ callbackFilter } />

                        { query.year.length > 0 &&
                            <>
                                <TopList photos={ photos } title="month" icon="month" limit="12" sortByCount={ false } callback={ callbackFilter } />                            
                            </>
                        }
                        <TopList photos={ photos } title="dirname" icon="dirname" limit="9" sortByCount={ false } callback={ callbackFilter } />

                        <div className="hide-on-med-and-down">
                            
                            <TopList photos={ photos } title="country" icon="location" limit="5" callback={ callbackFilter } />
                            <TopList photos={ photos } title="state" icon="location" limit="5" callback={ callbackFilter } />
                            <TopList photos={ photos } title="city" icon="location" limit="5" callback={ callbackFilter } />
                        </div>
                    </> }

                </div>
                <div className="col s12 m9 l10">
                    <div className="row">
                        <div className="col l6 center hide-on-med-and-down">
                            <CancelFilterAll query={query} callbackFilter={ callbackFilter } />
                        </div>
                        <div className="col m12 s12  l6 center" >
                            <SelectionView currentValue={ view_images } valueArr={ [ 'group', 'grid', 'list', 'map'] } callback={ callbackView } />

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



const mapStateToProps = state => {

    const t0 = performance.now()

    let photos = state.photos

    let copyOfphotos = addSrcAndDirname(photos)
    copyOfphotos = filterFiles(copyOfphotos, state.query)

    const t1 = performance.now()
    console.log("filtering took " + (t1 - t0).toFixed(2) + " milliseconds.")

    console.log("photos[0]:", photos[0])

    const query = state.query

    return { photos: copyOfphotos, query } // photos:photos
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setQueryFilter }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(ImageApp);

// export { ImageApp };
