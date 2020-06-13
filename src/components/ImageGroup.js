import React, { useState } from "react";
import { Rating } from "./Rating"
import { Icon } from "./Icons"
import { sortBy, groupBy } from "underscore";

import { ImageGrid } from "./ImageGrid"
import { ImageListSimple } from "./ImageListSimple"


import { findUnique } from "./helpers"

export const ImageGroup = ({ photos, deleteTodoHandle }) => {

    const [group, setGroup] = useState("country");
    const [current, setCurrent] = useState({ name: "", photos: [] });

    const getItems = (photos) => {
        const sortByCount = false
        let locations = findUnique(photos, group, sortByCount)
        return locations
    }

    const sortAndReduce = (images) => {
        images = sortBy(images, 'rating');
        images = images.reverse()
        return images.slice(0, 5);
    }

    const filterCurrent = (images) => {

        return images.slice(0, 5);
    }

    const adaptColSize = (nImages) => {
        if (nImages > 4) return "col s12"
        return "col s6"
    }



    return (
        <div>
            <div className="col s12 " onClick={ () => setCurrent({ name: "", photos: [] }) }>
                <h3>{ current.name } </h3>
            </div>

            <>

                { current.photos.length == 0 ? (
                    <>
                        { getItems(photos).map((item, index) => (
                            <div className="row" >
                                <div className="col s11 mouse-pointer" key={ index } onClick={ () => setCurrent({ name: item.value, photos: item.photos }) } >
                                    <h5>
                                        <Icon icon={ group } className="mr-2" />
                                        { item.value }  <span class="badge ">{ item.count }</span>
                                    </h5>
                                </div>
                                <div className={ adaptColSize(item.count) } key={ index }>
                                    <ImageGrid photos={ sortAndReduce(item.photos) } />
                                </div>
                            </div>
                        )) }
                    </>) : (
                        <>
                            <div className="row" >
                                <div className="col s12 mouse-pointer" >
                                    <ImageGrid photos={ current.photos } />
                                </div>
                            </div>

                        </>
                    )
                }

            </>
        </div>
    );
};

