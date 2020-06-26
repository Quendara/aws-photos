import React, { useState, useCallback } from "react";
import ImageGroup from "./ImageGroup"; // import without {}
import { leadingZeros, sortPhotos } from "./helpers";

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";


export const ImageToday = ({ photos, setQueryFilter, sortBy }) => {

    const date = new Date()

    const findTodaysPhotos = (images) => {


        let today = leadingZeros(date.getMonth() + 1)
        today += "-" + leadingZeros(date.getDate())

        const list = images.filter(image => {
            return (image.sameday === today)
        })
        return list;
    }
    const currentPhotos = findTodaysPhotos(photos);

    // index must be 0..1, example from date.getMonth()
    const getMonthName = (index) => {
        const array = ["Jannuar", "Feburar", "März", "April", "Mai", "Juni", "July", "August"]
        return array[index]
    }

    return (<>
        { currentPhotos.length > 0 ?
            <>
                <h4>
                <span style={{ fontSize:"1.3em"}} >☀️</span>                
                <span className="grey-text text-darken-1" >
                    Erinnerungen an den
                    </span>
                    <span style={{ fontSize:"1.3em"}} className="cyan-text text.accent-2" >
                    { " "}    { date.getDate() }.  { getMonthName(date.getMonth()) } 
                    </span>
                </h4>

                <ImageGroup photos={ currentPhotos } sortBy={ sortBy } initialGroup="year" showGroupSelector={ false } />
            </>
            :
            <>
                <div className="card-panel blue darken-4 " >
                    <h3 className="blue-text text-lighten-4 center">Keine Fotos von diesem Tag.</h3>
                </div>
            </>
        }
    </>)
}