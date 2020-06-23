import React, { useState } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import { Icon } from "./Icons"

import { findUnique } from "./helpers"
import ImageGrid from "./ImageGrid"
import { SelectionView } from "./SelectionView";
import { setQueryFilter } from "../redux/actions"; // import default 

// import { ImageListSimple } from "./ImageListSimple"


export const ImageGroupHeader = ({ groupKey, groupValue, secondGroupKey, secondGroupValues, callback }) => {


    const callbackLocal = (value) => {
        callback(groupKey, groupValue, secondGroupKey, value)
    }

    return (
        <>{ secondGroupValues.map(x => (

            <span key={ x.value } onClick={ () => callbackLocal(x.value) } className="ml-2">{ x.value } </span>
        ))
        }
        </>
    )
}



export const ImageGroup = ({ photos, setQueryFilter, sortBy }) => {

    const [group, setGroup] = useState("dirname");
    // const [current, setCurrent] = useState({ name: "", photos: [] });

    const getGroupedItems = (photos) => {
        const sortByCount = false
        const limit = 10;

        return findUnique(photos, group, sortByCount, limit)
    }

    // descending == absteigend
    // ascending == aufstseigend



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

    const getContext = (currentGrouping, currentValue, photos ) => {
        const sortByCount = false
        const limit = 3;


        switch (currentGrouping) {
            case "year":
            case "month":
                // list countries form given photos
                return (<ImageGroupHeader
                    callback={ queryOnTwoGroups }
                    groupKey={ currentGrouping }
                    groupValue={ currentValue }
                    secondGroupKey={ 'country' }
                    secondGroupValues={ findUnique(photos, 'country') } />)
            case "day":
                // list countries form given photos
                return (<ImageGroupHeader
                    callback={ queryOnTwoGroups }
                    groupKey={ currentGrouping }
                    groupValue={ currentValue }
                    secondGroupKey={ 'country' }
                    secondGroupValues={ findUnique(photos, 'city', sortByCount, limit) } />)
            case "dirname": {
                return (<ImageGroupHeader
                    callback={ queryOnTwoGroups }
                    groupKey={ currentGrouping }
                    groupValue={ currentValue }
                    secondGroupKey={ 'country' }
                    secondGroupValues={ findUnique(photos, 'country') } />)
            }
            case "country":
                // list countries form given photos
                return (<ImageGroupHeader
                    callback={ queryOnTwoGroups }
                    groupKey={ currentGrouping }
                    groupValue={ currentValue }
                    secondGroupKey={ 'year' }
                    secondGroupValues={ findUnique(photos, 'year') } />)
            default:
                return "Bla, Bla, Bla"
        }
    }

    // condition ? true : false.

    const queryOnTwoGroups = (group1, value1, group2, value2) => {
        setQueryFilter(group1, value1)
        setQueryFilter(group2, value2)
        // setQueryFilter("country", "Deutschland")
    }

    const queryOnGroup = (currentGrouping, value) => {
        setQueryFilter(currentGrouping, value)
        // setQueryFilter("country", "Deutschland")
    }

    //  () => setCurrent({ name: item.value, photos: item.photos })

    const groups = getGroupedItems(photos)

    return (
        <div>
            <>
                <div className="row" >
                    <div className="col s12 right" >
                        <SelectionView currentValue={ group } valueArr={ ['year', 'dirname', 'country', 'month', 'day'] } callback={ callbackGroupBy } />
                    </div>
                </div>
                <>
                    { groups.map((item, index) => (

                        <div className="row" key={ item.value } >
                            <div className="col s11 mouse-pointer" key={ index }  >
                                <h5>
                                    <span onClick={ () => queryOnGroup(group, item.value) }>
                                        <Icon icon={ group } className="mr-2" />
                                        { item.value }
                                    </span>
                                    <span>
                                        <span className="ml-2 blue-text text-darken-2" >
                                            { getContext(group, item.value, item.photos) }
                                        </span>
                                        <span className="badge ">{ item.count }</span>
                                    </span>
                                </h5>
                            </div>
                            <div className={ adaptColSize(item.count) } key={ index + 1000 }>
                                { groups.length > 1 ?
                                    (
                                        <ImageGrid photos={ item.photos } sortBy={sortBy} limit="6" />
                                    ) :
                                    (
                                        <span>                                            
                                            <ImageGrid photos={ photos } sortBy={sortBy} limit="1000" paging={ true } />
                                        </span>
                                    ) }
                            </div>
                        </div>
                    )) }
                </>

            </>

        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setQueryFilter }, dispatch)
}

export default connect(null, mapDispatchToProps)(ImageGroup);