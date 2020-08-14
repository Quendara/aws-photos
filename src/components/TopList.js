import React from "react";
import { Icon } from "./Icons"
import { findUnique } from "./helpers"
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/Card';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


export const TopList = ({ photos, icon, title, titleAlt = "", sortByCount = true, limit = 1, callback = undefined, rendering = "menu" }) => {

    const getItems = (photos) => {
        const group = title

        let locations = findUnique(photos, group, sortByCount, limit)
        return locations
    }

    const getResetClass = () => {
        return "blue right ml-2"
    }

    // <div className="col m-1 offset-s1  s11" onClick={ () => callback(title, item.value) } key={ index }></div>

    return (
        <>
            { (rendering === "menu") ? (
                <Grid item xs={ 12 }>
                    <Icon icon={ icon } className="mr-2" />
                    <span style={ { 'textTransform': 'capitalize' } }>{ title }</span>
                    <span onClick={ () => callback(title, "") } className={ getResetClass() } >Reset</span>


                    { getItems(photos).map((item, index) => (

                        <Grid container item xs={ 12 } >
                            <div className="ml-2 mouse-pointer text-ellipsis" onClick={ () => callback(title, item.value) }>
                                <Icon icon={ icon } className="mr-2 grey-text text-darken-2" /> { item.value }</div>
                            <span className="badge blue-text ">{ item.count }</span>
                        </Grid>
                    )) }

                    <br />
                    <Divider variant="middle" />
                    <br />
                </Grid>

            ) :
                (
                    <Card>
                        <List >
                            <ListItem >
                                <ListItemText >
                                    <Icon icon={ icon } className="mr-2" />
                                    <span style={ { 'textTransform': 'capitalize' } }>{ titleAlt.length > 0 ? titleAlt : title }</span>
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <span onClick={ () => callback(title, "") } className={ getResetClass() } >X</span>
                                </ListItemSecondaryAction>
                            </ListItem>

                            { getItems(photos).map((item, index) => (
                                <ListItem >
                                    <ListItemText className="collection-item mouse-pointer grey darken-4" onClick={ () => callback(title, item.value) } key={ index }>
                                        <Icon icon={ icon } className="ml-2 mr-2 grey-text " /> { item.value }
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <span className="blue">{ item.count }</span>
                                    </ListItemSecondaryAction>
                                </ListItem >
                            )) }
                        </List>
                    </Card>
                ) }
        </>
    )
}

/*
        <>
            <h6><Icon icon={ icon } /> { title } <span onClick={ () => callback(title, "") } className={ getResetClass() } >Reset</span> </h6>
            <div className="collection grey-blue darken-4 z-depth-5">
                { getItems(photos).map((item, index) => (
                    <div className="collection-item" onClick={ () => callback(title, item.value) } key={ index }>
                        <Icon icon={ icon } className="mr-2" />
                        <span className="text-ellipsis">{ item.value }</span>
                        <span className="badge blue-text ">{ item.count }</span> </div>
                )) }
            </div>
            <br />
        </>
*/