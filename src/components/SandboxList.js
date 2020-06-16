import React, { Component } from "react";
import { connect } from 'react-redux'

import { Rating } from "./Rating"
import { bindActionCreators } from "redux";

import { setRatingOnImage } from "../redux/actions"; // import default 


const SandboxList = ({ photos, setRatingOnImage, query }) => {

    const callbackLocal = (id, rating) => {
        console.log("callbackLocal", id, rating)
        setRatingOnImage(id, rating)
    }

    return (
        <>


            <div className="divider" />
            { photos.splice(0, 10).map((image, index) => {

                return (
                    <div className="row " key={ image.id } >
                        <div className="col s6 m2" >
                            <img className="responsive-img" src={ image.src } />
                        </div>
                        <div className="col s6 m10">
                            <span class="badge">{ image.dirname } / { image.filename }</span>
                            <h5>{ image.country }</h5>
                            <h6>{ image.city }</h6>
                            <h6>{ image.day }</h6>
                            <Rating rating={ image.rating } id={ image.id } callback={ callbackLocal }  ></Rating>
                        </div>
                    </div>
                );
            }) }
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
    return bindActionCreators( { setRatingOnImage }, dispatch )
}

const mapStateToProps = state => {

    // const photos = state.photos
    const photos = filterFiles(state.photos, state.query)
    const query = state.query
 
    return { photos, query } // photos:photos

}


export default connect(mapStateToProps, mapDispatchToProps)(SandboxList);
// export default SandboxList;


