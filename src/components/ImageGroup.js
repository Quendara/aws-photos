import React, { useState } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import { Icon } from "./Icons"

import { findUnique } from "./helpers"
import ImageGrid from "./ImageGrid"
import { SelectionView } from "./SelectionView";
import { ImageOnDemand } from "./ImageOnDemand";

import { setQueryFilter } from "../redux/actions"; // import default 
import { useWindowSize } from "./useWindowSize"

import { Button } from '@material-ui/core';
import { ButtonGroup } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';


import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';


import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        spacing: {
            flexGrow: 1,
            '& > *': {
                margin: theme.spacing(0.5),
            }

        },
        menuButton: {
            marginRight: theme.spacing(6),
            color: "#FFFFFF",
            textDecoration: "none"
        },
        title: {
            flexGrow: 1,
            color: "#FF0000",
            textDecoration: "none"
        },
        selected: {
            color: "#FFFF00",
        }
    }),
);



// import { ImageListSimple } from "./ImageListSimple"


export const ImageGroupHeader = ({ groupKey, groupValue, secondGroupKey, secondGroupValues, callback }) => {

    const callbackLocal = (value) => {
        callback(groupKey, groupValue, secondGroupKey, value)
    }

    return (
        <ButtonGroup color="primary" variant="text" >{ secondGroupValues.map(x => (
            // <span key={ x.value } onClick={ () => callbackLocal(x.value) } className="ml-2">{ x.value } </span>
            // <Chip key={ x.value } size="small" label={ x.value } onClick={ () => callbackLocal(x.value) } />
            <Button key={ x.value } size="small" onClick={ () => callbackLocal(x.value) } >{ x.value }</Button>
        ))
        }
        </ButtonGroup>
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

const ImageListTile = ({ item, group, index, queryOnGroup, getContext }) => {
    const [photoPreviewIndex, setPhotoPreviewIndex] = useState(0);

    const shuffleIndex = () => {

        let randInt = Math.floor(Math.random() * Math.floor(1000));
        console.log("randInt : " + randInt)

        randInt = randInt % item.photos.length
        setPhotoPreviewIndex(randInt)
    }    

    // 

    return (
            <>
            
            {/* <img className="responsive-img" onClick={ () => shuffleIndex() } src={ item.photos[photoPreviewIndex].source_url } alt="face" /> */}

            <ImageOnDemand className="responsive-img" onClick={ () => shuffleIndex() } image={ item.photos[photoPreviewIndex] } />
            <GridListTileBar
                title={
                    <Button onClick={ () => queryOnGroup(group, item.value) } >                       
                        <Icon icon={ group } className="mr-2" />{ item.value }
                    </Button>
                }
                subtitle={ getContext(group, item.value, item.photos) }
                actionIcon={
                    <IconButton onClick={ () => queryOnGroup(group, item.value) } >
                        <Icon icon={ group } className="mr-2" />
                    </IconButton>
                }                
            />
            </>
        
    )
}


export const ImageGroup = ({ photos, setQueryFilter, sortBy, initialGroup = "dirname", showGroupSelector = true, initialStats = false }) => {

    const classes = useStyles();
    const size = useWindowSize();

    const [group, setGroup] = useState(initialGroup);
    const [stats, setStats] = useState(initialStats);

    


    // const [current, setCurrent] = useState({ name: "", photos: [] });

    // descending == absteigend
    // ascending == aufstseigend
    // const filterCurrent = (images) => {

    //     return images.slice(0, 5);
    // }

    const adaptColSize = (nImages) => {
        if (nImages === 1) return 4 //"col s4"
        if (nImages >= 4) return 12 // "col s12"
        return 6 // "col s6"
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

    // <h5>
    //     <span onClick={ () => queryOnGroup(group, item.value) }>
    //         <Icon icon={ group } className="mr-2" />
    //         { item.value }
    //     </span>
    //     <span>
    //     { getContext(group, item.value, item.photos) }

    //     </span>
    // </h5>    

    return (
        <div>
            { groups.length === 1 ? (
                <Grid xs={ adaptColSize(groups[0].count) }  >
                    <ImageGrid photos={ groups[0].photos } sortBy={ sortBy } limit="100" />
                </Grid>
            ) : (
                    <>
                        { showGroupSelector &&
                            <Grid
                                container
                                justify="flex-start"
                                alignItems="flex-start" >

                                <Grid item xs={ 12 } >
                                    <SelectionView currentValue={ group } valueArr={ ['dirname', 'country', 'city', 'year', 'month', 'day'] } callback={ callbackGroupBy } />
                                    <Button onClick={ () => setStats(!stats) }><Icon icon="arrowUp" /></Button>
                                </Grid>
                            </Grid>
                        }
                        <>
                            <GridList spacing={ 10 } cellHeight={ 300 } cols={ (size.width > 600) ? 4 : 2 } >
                                { groups.map((item, index) => (
                                    <GridListTile cols={ 1 } rows={ 1 } key={ index } >
                                        <ImageListTile item={item} group={group} index={index} queryOnGroup={queryOnGroup} getContext={getContext} /> 
                                    </GridListTile>
                                )) }
                            </GridList>


                            {/* { groups.map((item, index) => (

                        <Grid xs={ 12 } key={ item.value }>
                            
                            <Grid className="mouse-pointer" xs={ 9 }  >
                                <br/>
                                <div className={classes.spacing}>
                                <Chip
                                    color="primary"
                                    icon={ <Icon icon={ group } className="mr-2" /> }
                                    label={ item.value }
                                    onClick={ () => queryOnGroup(group, item.value) }
                                />
                                { getContext(group, item.value, item.photos) }
                                </div>
                            </Grid>
                            <Grid className="mouse-pointer blue" xs={ 2 }  >
                                { item.count }
                            </Grid>
                            <Grid className="mouse-pointer" xs={ adaptColSize(item.count) }  >
                                { stats === true ? (
                                    <StatsRow photos={ item.photos } />
                                ) : (
                                        <ImageGrid photos={ item.photos } sortBy={ sortBy } limit="6" />
                                    )
                                }



                            </Grid>
                        </Grid>
                    )) } */}
                        </>

                    </>) }

        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setQueryFilter }, dispatch)
}

export default connect(null, mapDispatchToProps)(ImageGroup);