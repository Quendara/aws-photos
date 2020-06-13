import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "./Icons"
import { findUnique } from "./helpers"

export const TopList = ({ photos, icon, title, callback }) => {

    const getItems = (photos) => {
        let locations = findUnique(photos, title)
        return locations
    }

    const getResetClass = () => {
        return "badge"
    }

    return (
        <>
            <h6><Icon icon={ icon } /> { title } <span onClick={ () => callback("") } className={ getResetClass() } >Reset</span> </h6>
            <div className="collection z-depth-5">
                { getItems(photos).map((item, index) => (
                    <div className="collection-item" onClick={ () => callback(item.value) } key={ index }>
                        <Icon icon={ icon } className="mr-2" />
                        <span className="text-ellipsis">{ item.value }</span>
                          <span class="badge ">{ item.count }</span> </div>
                )) }
            </div>
            <br />
        </>
    )
}

