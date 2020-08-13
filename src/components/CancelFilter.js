import React from "react";
import { Icon } from "./Icons"
import {Button} from '@material-ui/core';

export const CancelFilterAll = ({ query, callbackFilter }) => {
    return (

        <>
            <CancelFilter value={ query.sameday } filter={ "sameday" } callback={ callbackFilter } />
            <CancelFilter value={ query.dirname } filter={ "dirname" } callback={ callbackFilter } />
            <CancelFilter value={ query.year } filter={ "year" } callback={ callbackFilter } />
            <CancelFilter value={ query.month } filter={ "month" } callback={ callbackFilter } />
            <CancelFilter value={ query.rating } filter="rating" callback={ callbackFilter } />
            <CancelFilter value={ query.country } filter="country" callback={ callbackFilter } />
            <CancelFilter value={ query.state } filter="state" callback={ callbackFilter } />
            <CancelFilter value={ query.city } filter="city" callback={ callbackFilter } />
            <CancelFilter value={ query.faces } filter="faces" callback={ callbackFilter } />
        </>
    )
}

const printQuery = (query) => {
    if( typeof query === "object"){
        return query.join( ", ")
    }
    else {
        return query
    }   
}

export const CancelFilter = ({ value, filter, callback }) => {

    return (
        <>
            { value.length > 0 &&
                <Button className="btn blue ml-2" onClick={ () => callback(filter, "") }  >
                    <Icon icon={ filter } className="mr-2" /><b>{ printQuery( value ) } </b><Icon icon="cancel" className="ml-2" />
                </Button> }
        </>
    )
}

// <button className="btn red m-2" onClick={ () => callbackFilter("faces", "" ) } >{ printQuery( query.faces ) }</button>
