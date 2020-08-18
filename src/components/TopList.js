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
import Box from '@material-ui/core/Box';

export const TopList = ({ photos, icon, title, titleAlt = "", sortByCount = true, limit = 1, callback = undefined, rendering = "menu" }) => {

    const getItems = (photos) => {
        const group = title

        let locations = findUnique(photos, group, sortByCount, limit)
        return locations
    }


    // <div className="col m-1 offset-s1  s11" onClick={ () => callback(title, item.value) } key={ index }></div>

    return (
        <>
            { (rendering === "menu") ? (
                <Grid item xs={ 11 }>
                    <Box lineHeight={ 2.5 } fontWeight="fontWeightMedium">
                        <Box  className="text-ellipsis" style={ { 'textTransform': 'capitalize' } }>
                            <Icon icon={ icon } className="mr-2" />{ title }
                        </Box >
                        <Box textAlign="right" color="text.secondary" onClick={ () => callback(title, "") } >Reset</Box>
                    </Box>


                    { getItems(photos).map((item, index) => (

                        <Box lineHeight={ 1.7 } key={index}>
                            <div className="ml-4 mouse-pointer text-ellipsis" onClick={ () => callback(title, item.value) }>                                
                                 { item.value }
                            </div>
                            <Box textAlign="right" color="primary.main" >{ item.count }</Box >
                        </Box>
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
                                    <span onClick={ () => callback(title, "") } >X</span>
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