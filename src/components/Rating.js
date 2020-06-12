import React from "react";
import { Icon } from "./Icons"

export const Rating = ({ rating }) => {

    const whichStar = ( index, rat ) => {
        if( index < rat )  {
            return "active mr-1"
        }
        else{
            return "deactive mr-1"
        }
    }

    const getStars= ( v ) => {
        return [...Array(5).keys()].map( index => {
            // console.log( index )
            return( <Icon key={index}  icon="star" className={whichStar(index, v)} >  </Icon>)
        } ) 

        // className={whichStar(index, v)} 

        // photos.map(image => {
        //     return (
    }

    return (
        <div className="rating">
            { getStars( rating ) }
        </div> )
}