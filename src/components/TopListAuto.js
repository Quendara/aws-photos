import React from "react";
import { findUnique } from "./helpers"

import { TopList } from "./TopList";
import { TopAutoComplete } from "./TopAutoComplete";
import Divider from '@material-ui/core/Divider';


export const TopListAuto = ({ photos, icon, title, titleAlt = "", sortByCount = true, limit = 9999, callback = undefined, rendering = "menu" }) => {

    const getItems = (photos) => {
        const group = title

        let locations = findUnique(photos, group, sortByCount, limit)
        return locations
    }

    return (
        <>
            { getItems(photos).length > 5 ? 
            (
                <div className="ml-2" >
                    <TopAutoComplete photos={ photos } title={title} titleAlt={titleAlt} icon={icon} sortByCount={ sortByCount } callback={ callback } />
                    <br />
                </div>
            ) 
            : (
                <>
                <TopList photos={ photos } title={title} titleAlt={titleAlt} limit="9" sortByCount={ sortByCount } callback={ callback } /> 
                <br />
                <Divider variant="middle" />
                <br />
                </>
            ) }
            
            
        </>
    )

}
