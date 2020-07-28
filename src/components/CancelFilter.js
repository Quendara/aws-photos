import React from "react";
import { Icon } from "./Icons"

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
        </>
    )
}

export const CancelFilter = ({ value, filter, callback }) => {

    return (
        <>
            { value.length > 0 &&
                <button className="btn blue ml-2" onClick={ () => callback(filter, "") }  >
                    <Icon icon={ filter } className="mr-2" /><b>{ value } </b><Icon icon="cancel" className="ml-2" />
                </button> }
        </>
    )
}

