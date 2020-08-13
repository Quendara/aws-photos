import React from "react";
import { Icon } from "./Icons"
import { findUnique } from "./helpers"

import Grid from '@material-ui/core/Grid';

export const TopList = ({ photos, icon, title, sortByCount = true, limit = 1, callback = undefined, rendering = "menu" }) => {

    const getItems = (photos) => {
        const group = title

        let locations = findUnique(photos, group, sortByCount, limit)
        return locations
    }

    const getResetClass = () => {
        return "badge"
    }

    // <div className="col m-1 offset-s1  s11" onClick={ () => callback(title, item.value) } key={ index }></div>

    return (
        <>
            { (rendering === "menu") ? (
                <>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start" >
                        
                        <Grid item xs={12}>

                        <h6><Icon icon={ icon } className="mr-2" /> <span style={ { 'textTransform': 'capitalize' } }>{ title }</span> <span onClick={ () => callback(title, "") } className={ getResetClass() } >Reset</span> </h6>

                        </Grid>

                        { getItems(photos).map((item, index) => (

                            <Grid container item xs={ 12 } >
                                <div className="mouse-pointer text-ellipsis"><Icon icon={ icon } className="mr-2 grey-text text-darken-2" /> { item.value }</div>
                                <span className="badge blue-text ">{ item.count }</span>
                            </Grid>
                        )) }


                    </Grid>
                </>
            ) :
                (
                    <ul className="collection indigo darken-4">
                        <li className="collection-header  mouse-pointer">
                            <h4><Icon icon={ icon } className="ml-2 mr-2" /> <span style={ { 'textTransform': 'capitalize' } }>{ title }</span> <span onClick={ () => callback(title, "") } className={ getResetClass() } >X</span> </h4>
                        </li>

                        { getItems(photos).map((item, index) => (
                            <li className="collection-item mouse-pointer grey darken-4" onClick={ () => callback(title, item.value) } key={ index }>

                                <Icon icon={ icon } className="mr-2 grey-text " /> { item.value }
                                <span className="secondary-content ">{ item.count }</span>
                            </li>
                        )) }
                    </ul>
                )
            }
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