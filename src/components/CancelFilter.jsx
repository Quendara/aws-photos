/* eslint-disable no-unused-vars */
import React from "react";
import { Icon } from "./Icons"
import { Chip, Menu, MenuItem } from '@material-ui/core/';
import { findUnique, findUniqueFacesItems } from "./helpers"
import { useStyles } from "./Styles"




export const CancelFilterAll = ({ query, callbackFilter, photos, photos_all }) => {
    const classes = useStyles();

    return (
        <div className={ classes.spacing }>
            <CancelFilter value={ query.sameday } filter={ "sameday" } callback={ callbackFilter } />
            <CancelFilter photos={ photos_all } value={ query.dirname } filter={ "dirname" } callback={ callbackFilter } />
            <CancelFilter photos={ photos_all } value={ query.year }  filter={ "year" } callback={ callbackFilter } />
            <CancelFilter photos={ photos_all } value={ query.month } filter={ "month" } callback={ callbackFilter } />
            <CancelFilter photos={ photos_all } value={ query.day } filter={ "day" } callback={ callbackFilter } />
            <CancelFilter photos={ photos } value={ query.country } filter="country" callback={ callbackFilter } />
            <CancelFilter photos={ photos } value={ query.state } filter="state" callback={ callbackFilter } />
            <CancelFilter photos={ photos } value={ query.city } filter="city" callback={ callbackFilter } />
            <CancelFilterArray value={ query.faces } filter="faces" callback={ callbackFilter } />
        </div>
    )
}

const printQuery = (query) => {
    if (typeof query === "object") {
        return query.join(", ")
    }
    else {
        return query
    }
}

export const CancelFilterArray = ({ value, filter, callback }) => {

    const getValue = (valueArr) => {

        if (valueArr === undefined) return []
        return valueArr
    }

    return (
        <> { getValue(value).map((x, index) => {
            return (
                <Chip key={ index } onClick={ () => callback(filter, x, false) }
                    size="small"
                    icon={ <Icon icon={ filter } /> }
                    label={ printQuery(x) }
                    color="secondary"
                    onDelete={ () => callback(filter, x, false) }
                />
            )

        }) }
        </>
    )

}

export const CancelFilter = ({ value, filter, callback, photos }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        if( items.length > 1 ){
            setAnchorEl(event.currentTarget);
        }
        
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getItems = (photos) => {
        const group = filter
        const limit = 15
        const sortByCount = false

        let items = []
        const singleperson = true
        if (group === "faces") {
            items = findUniqueFacesItems(photos, singleperson, limit)
        }
        else {
            items = findUnique(photos, group, sortByCount, limit)
        }

        let reducedItemList = items

        if( value.length > 0 ){
            
            let foundIndex = -1
            for( let i=0; i<items.length; ++i ){
                const item = items[i]
                
                if( item.value === value ){
                    // reducedItemList.push( item.value )
                    foundIndex = i
                    break
                }                
            }

            if( foundIndex >= 0 ){
                const delta = 2
                let beginIdx = foundIndex - delta ; 
                let endIdx = foundIndex + delta  + 1 ; 

                if( beginIdx < 0 ){ beginIdx = 0 }
                if( endIdx >= items.length ){ endIdx = items.length-1 }

                reducedItemList = items.slice( beginIdx, endIdx )
            }            
        }

        return reducedItemList
    }

    const items = getItems(photos)

    return (
        <>
            { value.length > 0 &&
                <>
                    <Chip onClick={ handleClick }
                        size="small"
                        anchorEl={ anchorEl }
                        icon={ <Icon icon={ filter } /> }
                        label={ printQuery(value) }
                        color="secondary"
                        onDelete={ () => callback(filter, "") }
                    />

                    <Menu
                        id="simple-menu"
                        anchorEl={ anchorEl }
                        keepMounted
                        open={ Boolean( anchorEl )  }
                        onClose={ handleClose }
                    >
                        { items.map((item, index) => (
                            <MenuItem key={index} onClick={ () => { callback(filter, item.value); handleClose() } }>{ item.value }</MenuItem>
                        )) }
                    </Menu>
                </>

            }
        </>
    )
}

{/* <Button   onClick={ () => callback(filter, "") }  >
<Icon icon={ filter } className="mr-2" /><b>{ printQuery( value ) } </b><Icon icon="cancel" className="ml-2" />
</Button> } */}


// <button className="btn red m-2" onClick={ () => callbackFilter("faces", "" ) } >{ printQuery( query.faces ) }</button>