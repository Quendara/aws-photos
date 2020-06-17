import React, { useState } from "react";
// import Settings from "./Settings"
// import { sortBy, groupBy } from "underscore";

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


import { Images } from "./components/Images";
import { TopList } from "./components/TopList";
import { CancelFilter } from "./components/CancelFilter";
import { SelectionView } from "./components/SelectionView";
import { leadingZeros } from "./components/helpers";

import { setQueryFilter } from "./redux/actions"; // import default 

// import { Icon } from "./components/Icons";

// This class contains the business logic of the application
const ImageApp = ( {photos, query, setQueryFilter} ) => {

    const [view_images, setViewImages] = useState("grid"); // group, list, grid
    const [view_sort, setViewSort] = useState("rating"); // group, list, grid

    const callbackFilter = (key, value) => {

        console.log("callbackFilter : ", key, " : ", value)
        // current_filter[key] = value;
        // setCurrentFilter(current_filter)
        // filterFiles(current_filter)

        setQueryFilter(key, value)
    }

    const callbackView = (view) => {
        setViewImages(view)
    }
    const callbackSort = (view) => {
        setViewSort(view)
    }    

    const setToday = () => {
        const date = new Date()
        let today = leadingZeros(date.getMonth()+1)
        today += "-" + leadingZeros(date.getDate())

        callbackFilter('sameday', today)
    }


    const imageApp = photos.length ? (
        <Images photos={ photos } view={ view_images } sortBy={view_sort} />
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
                <div className="col s12 l2 hide-on-med-and-down">
                    <button className="btn blue" onClick={ setToday } >Today</button>


                    <TopList photos={ photos } title="year" icon="year" sortByCount={ false } callback={ callbackFilter } />
                    <TopList photos={ photos } title="rating" icon="rating" sortByCount={ false }  callback={ callbackFilter } />
                    <TopList photos={ photos } title="dirname" icon="dirname"  callback={ callbackFilter } />
                    <TopList photos={ photos } title="country" icon="location" callback={ callbackFilter } />
                    <TopList photos={ photos } title="state" icon="location" callback={ callbackFilter } />
                    <TopList photos={ photos } title="city" icon="location" callback={ callbackFilter } />

                </div>
                <div className="col s12 l10">
                    <div className="row">
                        <div className="col offset-m1  m6 s12 center">

                            <CancelFilter value={ query.sameday } filter={ "sameday" } callback={ callbackFilter } />
                            <CancelFilter value={ query.dirname } filter={ "dirname" } callback={ callbackFilter } />
                            <CancelFilter value={ query.year } filter={ "year" } callback={ callbackFilter } />
                            <CancelFilter value={ query.rating } filter="rating" callback={ callbackFilter } />
                            <CancelFilter value={ query.country } filter="country" callback={ callbackFilter } />
                            <CancelFilter value={ query.state } filter="state" callback={ callbackFilter } />
                            <CancelFilter value={ query.city } filter="city" callback={ callbackFilter } />
                        </div>
                        <div className="col offset-m1 m4 s12  center" >
                            <SelectionView currentValue={ view_images } valueArr={ ['group', 'grid', 'list', ] } callback={ callbackView } />
                            
                            <span className="m-2 blue-text">Sorting</span>                             
                            <SelectionView currentValue={ view_sort } iconsOnly={true} valueArr={ ['date', 'rating' ] } callback={ callbackSort } />
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

const filterFiles = (photos, query) => {

    const t0 = performance.now()

    const list = photos.filter(image => {

        // return true keeps the item in the list
        const bool1 = query.year === "" || +image.year === +query.year
        const bool2 = query.rating === "" || +image.rating >= +query.rating
        const bool3 = query.country === "" || image.country === query.country
        const bool4 = query.sameday === "" || image.sameday === query.sameday

        const bool5 = query.state === "" || image.state === query.state
        const bool6 = query.city === "" || image.city === query.city
        const bool7 = query.dirname === "" || image.dirname === query.dirname

        // console.log("+image.year === +year : ", +image.year, year, +image.year === +year)
        // console.log(bool1, bool2, bool3)
        return (bool1 && bool2 && bool3 && bool4 && bool5 && bool6 && bool7)
    })


    const t1 = performance.now()
    console.log("filtering took " + (t1 - t0) + " milliseconds.")

    console.log("filterFiles : ", list.length);

    // updateViews(list)
    // setCurrentItems(list)
    return list
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators( { setQueryFilter  }, dispatch )
}

const mapStateToProps = state => {

    // const photos = state.photos
    const photos = filterFiles(state.photos, state.query)
    const query = state.query
 
    return { photos, query } // photos:photos
}


export default connect(mapStateToProps, mapDispatchToProps)(ImageApp);

// export { ImageApp };
