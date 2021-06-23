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

import { Button, Card, Box, Badge, Typography } from '@material-ui/core';
import { ButtonGroup } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';


import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Dialog, DialogContent } from '@material-ui/core';
import { useStyles } from "./Styles"



import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';

export const ImageGroupHeader = ({ groupKey, groupValue, secondGroupKey, secondGroupValues, callback }) => {

    const classes = useStyles();

    const callbackLocal = (value) => {
        callback(groupKey, groupValue, secondGroupKey, value)
    }

    return (
        <div className={ classes.spacing }>{ secondGroupValues.map(x => (
            <Chip color="primary" key={ x.value } size="small" onClick={ () => callbackLocal(x.value) } label={ x.value } />
        ))
        }
        </div>
    )

}

const getGroupedItems = (photos, groupA) => {
    const sortByCount = false
    const limit = 131;
    return findUnique(photos, groupA, sortByCount, limit)
}


const StatsRow = ({ photos }) => {

    const getClass = (key) => {
        switch (key) {

            case '1': return '#494949';
            case '2': return '#757575';
            case '3': return '#ffea00';
            case '4': return '#ff9100';
            case '5': return '#ff3d00';

            default:
                break;
        }
    }

    const rowHeight = "80"

    return (
        <>
            <table width="99%">
                <tr>
                    {
                        getGroupedItems(photos, 'rating').map((item, index) => (
                            <td height={ rowHeight } width={ ((item.photos.length / photos.length) * 100) + "%" } style={ { verticalAlign: "top", backgroundColor: getClass(item.value) } }  >
                                { item.value }<br></br>
                                { Math.round((item.photos.length / photos.length) * 100) } %
                            </td>
                        ))
                    }
                </tr>
            </table>
            <table width="99%">
                <tr>
                    {
                        getGroupedItems(photos, 'country').map((item, index) => (
                            <td height={ rowHeight } width={ ((item.photos.length / photos.length) * 100) + "%" } style={ { verticalAlign: "top", backgroundColor: red[((index + 1) * 100)] } }  >
                                { item.value }<br></br>
                                { Math.round((item.photos.length / photos.length) * 100) } %<br></br>
                                { item.photos.length }
                            </td>
                        ))
                    }
                </tr>
            </table>
            <table width="99%">
                <tr>
                    {
                        getGroupedItems(photos, 'month').map((item, index) => (
                            <td height={ rowHeight } width={ ((item.photos.length / photos.length) * 100) + "%" } style={ { verticalAlign: "top", backgroundColor: blue[((index + 1) * 100)] } }  >
                                { item.value }<br></br>
                                { Math.round((item.photos.length / photos.length) * 100) } %
                            </td>
                        ))
                    }
                </tr>
            </table>
        </>
    )
}

const ImageListTile = ({ item, group, index, queryOnGroup, getContext }) => {
    const [photoPreviewIndex, setPhotoPreviewIndex] = useState(0);

    const shuffleIndex = () => {

        let randInt = Math.floor(Math.random() * Math.floor(item.photos.length));
        console.log("randInt : " + randInt)

        randInt = randInt % item.photos.length
        setPhotoPreviewIndex(randInt)
    }

    return (
        <>
            <ImageOnDemand className="responsive-img" onClick={ () => shuffleIndex() } image={ item.photos[photoPreviewIndex] } />
            <GridListTileBar
                title={
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-start"
                    >
                        <Grid item>
                            <Button onClick={ () => queryOnGroup(group, item.value) } >
                                <Icon icon={ group } className="mr-2" />{ item.value }
                            </Button>
                        </Grid>
                        <Grid item>
                            <Typography color="textSecondary"> { item.photos.length }</Typography>
                        </Grid>
                    </Grid>
                }
                subtitle={ getContext(group, item.value, item.photos) }
            />
        </>
    )
}

export const ImageStats = ({ photos, setQueryFilter, sortBy, initialGroup = "dirname", showGroupSelector = true, initialStats = true }) => {

    const classes = useStyles();
    const size = useWindowSize();

    const [group, setGroup] = useState(initialGroup);
    const [stats, setStats] = useState(initialStats);

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

    const groups = getGroupedItems(photos, group)

    return (
        <div>
            { showGroupSelector &&
                <SelectionView currentValue={ group } valueArr={ ['dirname', 'country', 'city', 'year', 'month', 'day'] } callback={ callbackGroupBy } />
            }
            { groups.length === 1 ? (
                <Grid xs={ adaptColSize(groups[0].count) }  >
                    <ImageGrid photos={ groups[0].photos } sortBy={ sortBy } limit="100" />
                </Grid>
            ) : (
                <>
                    <GridList spacing={ 10 } cellHeight={ 240 } cols={ (size.width > 600) ? 4 : 2 } >
                        { groups.map((item, index) => (
                            <GridListTile cols={ 1 } rows={ 1 } key={ index } >
                                { stats === true ? (
                                    <>
                                        <StatsRow photos={ item.photos } />
                                        {/* <GridListTileBar 
                                        
                                        title={
                                            <Button onClick={ () => queryOnGroup(group, item.value) } >
                                                <Icon icon={ group } className="mr-2" />{ item.value }
                                            </Button>
                                        } /> */}

                                        <GridListTileBar
                                            titlePosition="top"
                                            title={
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="space-between"
                                                    alignItems="flex-start"
                                                >
                                                    <Grid item>
                                                        <Button onClick={ () => queryOnGroup(group, item.value) } >
                                                            <Icon icon={ group } className="mr-2" />{ item.value }
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography color="textSecondary"> { item.photos.length }</Typography>
                                                    </Grid>
                                                </Grid> }
                                                />
                                    </>
                                ) : (
                                    <ImageListTile
                                        item={ item }
                                        group={ group }
                                        index={ index }
                                        queryOnGroup={ queryOnGroup }
                                        getContext={ getContext } />
                                ) }
                            </GridListTile>
                        )) }
                    </GridList>
                </>) }
        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setQueryFilter }, dispatch)
}

export default connect(null, mapDispatchToProps)(ImageStats);