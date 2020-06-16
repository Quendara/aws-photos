import React from "react";
import { Icon } from "./Icons"

export const Rating = ({ rating, id, callback }) => {

    const whichStar = (index, rat) => {
        if (index < rat) {
            return "active mr-1"
        }
        else {
            return "deactive mr-1"
        }
    }

    const callbackLocal = (id, index) => {
        const rating = index+1
        callback( id, rating )
    }

    const getStars = (v) => {
        return [...Array(5).keys()].map(index => {
            // console.log( index )
            return (<a key={ index } onClick={ () => callbackLocal(id, index) }>
                <Icon icon="star" className={ whichStar(index, v) } >  </Icon>
            </a>
            )
        })

        // className={whichStar(index, v)} 

        // photos.map(image => {
        //     return (
    }

    return (
        <div className="rating">
            { getStars(rating) }
        </div>)
}