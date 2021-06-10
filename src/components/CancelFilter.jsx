/* eslint-disable no-unused-vars */
import React from "react";
import { Icon } from "./Icons"
import { Chip, Button, Box, Menu, MenuItem } from '@material-ui/core/';
import { findUnique, findUniqueFacesItems } from "./helpers"
import { useStyles } from "./Styles"

import { leadingZeros, sortPhotos, filterFiles, addSrcAndDirname } from "./helpers";

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import DoneIcon from '@material-ui/icons/Done';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


export const CancelFilterAll = ({ query, callbackFilter, photos, photos_all }) => {
    const classes = useStyles();

    const photos_filtered = filterFiles( photos_all, 
        {
                dirname:query['dirname']?query.dirname:"", 
                year:query['year']?query.year:"", 
                rating:2   } )

    console.log( "photos_all : ", photos_all.length )
    console.log( "photos_filtered : ", photos_filtered.length )

    return (
        <span className={ classes.spacing }>
            {/* <CancelFilter value={ query.sameday } filter={ "sameday" } callback={ callbackFilter } showNext={false} /> */}
            <CancelFilter photos={ photos_filtered } value={ query.year } filter={ "year" } callback={ callbackFilter } showNext={false} showAlways={true}/>
            <CancelFilter photos={ photos_filtered } value={ query.dirname } filter={ "dirname" } callback={ callbackFilter } showNext={false} />
            <CancelFilter photos={ photos_filtered } value={ query.month } filter={ "month" } callback={ callbackFilter } showNext={false}/>
            <CancelFilter photos={ photos_filtered } value={ query.day } filter={ "day" } callback={ callbackFilter } showNext={false} />
            <CancelFilter photos={ photos_filtered } value={ query.country } filter="country" callback={ callbackFilter } showNext={false} />
            <CancelFilter photos={ photos_filtered } value={ query.state } filter="state" callback={ callbackFilter } showNext={false} />
            <CancelFilter photos={ photos_filtered } value={ query.city } filter="city" callback={ callbackFilter } showNext={false} />
            <CancelFilterArray value={ query.faces } filter="faces" callback={ callbackFilter } showNext={false} />
        </span>
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

// <CancelFilter photos={ photos_all } 
// value={ query.dirname }
//  filter={ "dirname" }
//  callback={ callbackFilter } />
export const CancelFilter = ({ value, filter, callback, photos, showNext=true, showAlways=false }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    let prev_value = undefined
    let next_value = undefined

    const handleClick = (event) => {
        if (items.length > 0) {
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

        if (value.length > 0) {

            let foundIndex = -1
            for (let i = 0; i < items.length; ++i) {
                const item = items[i]

                if (item.value === value) {
                    // reducedItemList.push( item.value )
                    foundIndex = i
                    break
                }
            }

            if (foundIndex >= 0) {


                prev_value = items[foundIndex - 1]
                next_value = items[foundIndex + 1]

                const delta = 3
                let beginIdx = foundIndex - delta;
                let endIdx = foundIndex + delta + 1;

                if (beginIdx < 0) { beginIdx = 0 }
                if (endIdx >= items.length) { endIdx = items.length - 1 }

                reducedItemList = items.slice(beginIdx, endIdx)
            }
        }

        return reducedItemList
    }

    const items = getItems(photos)

    return (
        <>
            { ( showAlways || items.length < 10 || value.length > 0 ) &&
                <>
                    {/* <Chip onClick={ handleClick }
                        size="small"
                        anchorEl={ anchorEl }
                        icon={ <Icon icon={ filter } /> }
                        label={ printQuery(value) }
                        color="secondary"
                        onDelete={ () => callback(filter, "") }

                        onClick={ () => callback(filter, "") } 
            />*/}

               

                    { ( prev_value !== undefined && showNext ) &&
                        <Button size="small" onClick={ () => { callback(filter, prev_value.value) } } >
                            <KeyboardArrowLeft />{ prev_value.value }
                        </Button>
                    }
                    
                    {/* <Button size="small" anchorEl={ anchorEl } variant={ value.length > 0?'contained':"" }  onClick={ handleClick } >                                              
                    </Button> */}

                    <Chip
                        label={ value.length > 0 ?
                            <>{ printQuery(value) } </>: 
                            <>{ filter } </>                            
                        }  
                        icon={ items.length > 1?<ArrowDropDownIcon/>:""  }
                        onClick={handleClick}
                        variant={ value.length > 0?"outlined":"" }
                        onDelete={ value.length > 0? () => { callback(filter, ""); handleClose() }:undefined  }
                        
                        />                    

                    <Menu
                        id="simple-menu"
                        anchorEl={ anchorEl }
                        keepMounted
                        open={ Boolean( anchorEl )  }
                        onClose={ handleClose }
                    >
                        {/* <MenuItem key="CLOSE" onClick={ () => { callback(filter, ""); handleClose() }  }><KeyboardArrowLeft />Close</MenuItem> */}

                        { items.map((item, index) => (
                            <MenuItem key={index} onClick={ () => { callback(filter, item.value); handleClose() } }>{ item.value }</MenuItem>
                        )) }
                        
                    </Menu>                     


                    { ( next_value !== undefined && showNext ) &&
                    <Button size="small"  onClick={ () => { callback(filter, next_value.value) } } > 
                        { next_value.value }
                        <KeyboardArrowRight />
                    </Button>
                    }

                </>

            }
        </>
    )
}

{/* <Button   onClick={ () => callback(filter, "") }  >
<Icon icon={ filter } className="mr-2" /><b>{ printQuery( value ) } </b><Icon icon="cancel" className="ml-2" />
</Button> } */}


// <button className="btn red m-2" onClick={ () => callbackFilter("faces", "" ) } >{ printQuery( query.faces ) }</button>
