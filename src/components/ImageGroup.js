import React, { useState } from "react";
import { Rating } from "./Rating"
import { Icon } from "./Icons"
import { sortBy, groupBy } from "underscore";

import { findUnique } from "./helpers"
import { ImageGrid } from "./ImageGrid"
import { SelectionView } from "./SelectionView";
// import { ImageListSimple } from "./ImageListSimple"



export const ImageGroup = ({ photos, deleteTodoHandle }) => {

    const [group, setGroup] = useState("country");
    const [current, setCurrent] = useState({ name: "", photos: [] });

    const getGroupedItems = (photos) => {
        const sortByCount = false
        let locations = findUnique(photos, group, sortByCount)
        return locations
    }

    const sortPhotos = (images, sortByKey = 'rating') => {
        images = sortBy(images, sortByKey);
        images = images.reverse()
        return images; // .slice(0, 5);
    }

    const filterCurrent = (images) => {

        return images.slice(0, 5);
    }

    const adaptColSize = (nImages) => {
        if (nImages > 4) return "col s12"
        return "col s6"
    }

    const callbackGroupBy = (value) => {
        setGroup(value)
    }

    const returnValuesAsString = ( list ) => {
        let valueArr = list.map(x => x.value ); // map object to simple str arr
        let str = valueArr.join(', ') // join to string
        return str;
    }

    const getContext = ( currentGrouping, photos) => {
        switch (currentGrouping) {
            case "year":
                // list countries form given photos
                return returnValuesAsString( findUnique( photos, 'country' ) ); 
            case "dirname":{
                let  listToUse = findUnique( photos, 'country' ) 


                return returnValuesAsString( listToUse ); 
            }
                
                
            case "country":                
                // list year form given photos
                return returnValuesAsString( findUnique( photos, 'year' ) );
            default:
                return "Bla, Bla, Bla"


        }

    }

    // condition ? true : false.

    return (
        <div>

            { (current.name.length != 0) ? (
                <div className="row" >
                    <div className="col s12 " onClick={ () => setCurrent({ name: "", photos: [] }) }>
                        <h5><button className="btn blue mr-2">Back </button>{ current.name } </h5>
                    </div>

                    <div className="col s12 mouse-pointer" >
                        <ImageGrid photos={ current.photos } />
                    </div>
                </div>
            ) :
                (<></>) }

            <>
                { current.photos.length == 0 ? (
                    <>
                        <div className="row" >
                            <div className="col s12 right" >
                                <SelectionView currentValue={ group } valueArr={ ['year', 'dirname', 'country'] } callback={ callbackGroupBy } />
                            </div>
                        </div>

                        { getGroupedItems(photos).map((item, index) => (
                            <div className="row" >
                                <div className="col s11 mouse-pointer" key={ index } onClick={ () => setCurrent({ name: item.value, photos: item.photos }) } >
                                    <h5>
                                        <Icon icon={ group } className="mr-2" />

                                        { item.value }
                                        <span className="ml-2 blue-text text-darken-2" >
                                            { getContext(group, item.photos) }
                                        </span>
                                        <span class="badge ">{ item.count }</span>
                                    </h5>
                                </div>
                                <div className={ adaptColSize(item.count) } key={ index }>
                                    <ImageGrid photos={ sortPhotos(item.photos, 'rating') } limit="5" />
                                </div>
                            </div>
                        )) }
                    </>) : (
                        <></>
                    )
                }

            </>
        </div>
    );
};

