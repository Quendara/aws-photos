import React, { useState } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import { Icon } from "./Icons"

import { findUnique } from "./helpers"
import ImageGrid from "./ImageGrid"
import { SelectionView } from "./SelectionView";
import { setQueryFilter } from "../redux/actions"; // import default 

import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';



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

const getGroupedItems = (photos, groupA) => {
    const sortByCount = false
    const limit = 18;
    return findUnique(photos, groupA, sortByCount, limit)
}


const StatsRow = ({ photos }) => {

    const getClass = (key) => {
        switch (key) {

            case '1': return 'grey darken-3';
            case '2': return 'grey darken-2';
            case '3': return 'yellow darken-4';
            case '4': return 'yellow darken-3';
            case '5': return 'yellow darken-1';

            default:
                break;
        }
    }

    return (
        <table width="95%">
            <tr>
                {
                    getGroupedItems(photos, 'rating').map((item, index) => (
                        <td width={ item.photos.length / item.photos.length } class={ getClass(item.value) } >
                            { item.photos.length }
                        </td>
                    ))
                }
            </tr>
        </table>
    )
}


export const ImageGroup = ({ photos, setQueryFilter, sortBy, initialGroup = "dirname", showGroupSelector = true, initialStats = false }) => {

    const [group, setGroup] = useState(initialGroup);
    const [stats, setStats] = useState(initialStats);
    // const [current, setCurrent] = useState({ name: "", photos: [] });

    // descending == absteigend
    // ascending == aufstseigend
    // const filterCurrent = (images) => {

    //     return images.slice(0, 5);
    // }

    const adaptColSize = (nImages) => {
        if (nImages === 1) return "col s4"
        if (nImages >= 4) return "col s12"
        return "col s6"
    }

    const callbackGroupBy = (value) => {
        setGroup(value)
    }

    const getContext = (currentGrouping, currentValue, photos) => {
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
            case "city":
                // list countries form given photos
                return (<ImageGroupHeader
                    callback={ queryOnTwoGroups }
                    groupKey={ currentGrouping }
                    groupValue={ currentValue }
                    secondGroupKey={ 'day' }
                    secondGroupValues={ findUnique(photos, 'day') } />)
            default:
                return "Bla, Bla, Bla"
        }
    }

    // condition ? true : false.

    const queryOnTwoGroups = (group1, value1, group2, value2) => {
        setQueryFilter(group1, value1)
        setQueryFilter(group2, value2)

        console.log("queryOnTwoGroups", group1, value1, group2, value2)
        // setQueryFilter("country", "Deutschland")
    }

    const queryOnGroup = (currentGrouping, value) => {
        setQueryFilter(currentGrouping, value)

        console.log("queryOnGroup", currentGrouping, value)
        // setQueryFilter("country", "Deutschland")
    }

    //  () => setCurrent({ name: item.value, photos: item.photos })

    const groups = getGroupedItems(photos, group)

    return (
        <div>
            <>
                { showGroupSelector &&
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start" >

                        <Grid container item xs={ 12 } >
                            <SelectionView currentValue={ group } valueArr={ ['dirname', 'country', 'city', 'year', 'month', 'day'] } callback={ callbackGroupBy } />
                            <Button onClick={ () => setStats(!stats) }><Icon icon="arrowUp" /></Button>
                        </Grid>
                    </Grid>
                }
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


                                { stats === true ? (
                                    <StatsRow photos={ item.photos } />


                                ) : (
                                        <>{
                                            groups.length > 1 ?
                                                (
                                                    <ImageGrid photos={ item.photos } sortBy={ sortBy } limit="6" />
                                                ) :
                                                (
                                                    <span>
                                                        <ImageGrid photos={ photos } sortBy={ sortBy } limit="1000" paging={ true } />
                                                    </span>
                                                )
                                        }</>
                                    )
                                }



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