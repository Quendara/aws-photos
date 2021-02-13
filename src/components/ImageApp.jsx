import React, { useState } from "react";
// import Settings from "./Settings"
// import { sortBy, groupBy } from "underscore";

import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


import { Images } from "./ImagesRouter";

import { CancelFilterAll } from "./CancelFilter";
import { SelectionView } from "./SelectionView";
import { LeftMenu } from "./LeftMenu";

import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";

// import Settings from "../Settings"

import { setQueryFilter, addToQueryFilter, removeFromQueryFilter } from "../redux/actions"; // import default 
// import { Rating } from "./Rating";
// import { Icon } from "./Icons"

import Grid from '@material-ui/core/Grid';
// import Hidden from '@material-ui/core/Hidden';
// import Divider from '@material-ui/core/Divider';


// This class contains the business logic of the application
const ImageApp = ({
    photos,
    photos_all,
    query,
    setQueryFilter,
    addToQueryFilter,
    removeFromQueryFilter,
    view,
    menu = true }) => {

    const [view_images, setViewImages] = useState(view); // group, list, grid
    const [view_sort, setViewSort] = useState("date"); // rating, date

    const callbackFilter = (key, value, add = true) => { // add = false means remove from ARRAY

        console.log("callbackFilter : ", key, " : ", value)
        console.log("query ", query )
        console.log("add ", add )
        console.log("typeof value ", typeof value )

        if (key === "faces") {
            if (add === true) {
                addToQueryFilter(key, value)
            }
            else {
                removeFromQueryFilter(key, value)
            }
        }
        else {
            setQueryFilter(key, value)
        }
    }

    const callbackSort = (view) => {
        setViewSort(view)
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
                                <CancelFilterAll query={ query } callbackFilter={ callbackFilter } photos={ photos }  photos_all={ photos_all }  />
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


    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start" >

            <Grid item xs={ 12 } lg={ 2 }  >
                { (menu && photos.length > 0) && <LeftMenu photos={ photos } query={ query } callbackFilter={ callbackFilter } /> }
            </Grid>

            <Grid item xs={ 12 } lg={ 10 } >
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start" >

                    <Grid item xs={ 12 } lg={ 6 } >
                        <CancelFilterAll query={ query } callbackFilter={ callbackFilter } photos={ photos }  photos_all={ photos_all }  />
                    </Grid>
                    <Grid item xs={ 12 } lg={ 6 } >
                        
                        {/* 
                        <span className="m-2 blue-text">Sorting</span>
                        <SelectionView currentValue={ view_sort } iconsOnly={ true } valueArr={ ['date', 'rating'] } callback={ callbackSort } /> */}
                    </Grid>
                    <Grid item xs={ 12 } >
                        { imageApp }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}



const mapStateToProps = state => {

    const t0 = performance.now()

    let photos = state.photos

    const copyOfphotos      = addSrcAndDirname(photos)
    const filterOfphotos    = filterFiles(copyOfphotos, state.query)

    const t1 = performance.now()
    console.log("filtering took " + (t1 - t0).toFixed(2) + " milliseconds.")

    console.log("photos[0]:", photos[0])

    const query = state.query

    return { photos: filterOfphotos, photos_all: copyOfphotos, query } // photos:photos
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        setQueryFilter,
        addToQueryFilter,
        removeFromQueryFilter
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(ImageApp);

// export { ImageApp };