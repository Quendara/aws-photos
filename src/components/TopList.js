import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "./Icons"
import { findUnique } from "./helpers"

export const TopList = ({ photos, icon, title, sortByCount = true, callback = undefined }) => {

    const getItems = (photos) => {
        const group = title

        let locations = findUnique(photos, group, sortByCount)
        return locations
    }

    const getResetClass = () => {
        return "badge"
    }

    return (
        <>
            <h6><Icon icon={ icon } /> { title } <span onClick={ () => callback(title, "") } className={ getResetClass() } >Reset</span> </h6>
            <div className="collection grey-blue darken-4 z-depth-5">
                { getItems(photos).map((item, index) => (
                    <div className="collection-item" onClick={ () => callback(title, item.value) } key={ index }>
                        <Icon icon={ icon } className="mr-2" />
                        <span className="text-ellipsis">{ item.value }</span>
                        <span className="badge text-blue ">{ item.count }</span> </div>
                )) }
            </div>
            <br />
        </>
    )
}

/*

*/