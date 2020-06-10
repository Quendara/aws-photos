import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "./Icons"
import { sortBy, groupBy } from "underscore";

export const TopList = ({ photos, icon, title, callback }) => {

    const findUnique = (list, group) => {
        let groups = groupBy(list, group);
        let uniqueItems = []
        for (var key in groups) {
            if (groups.hasOwnProperty(key)) {
                // console.log(key + " - " + groups[key]);

                const item = {
                    value: key,
                    count: groups[key].length
                }
                uniqueItems.push(item)

            }
        }
        // 
        uniqueItems = sortBy(uniqueItems, 'count'); // sort is ascending 
        uniqueItems = uniqueItems.reverse() // to reverse the order, of course replace with better impl

        console.log("uniqueItems : ", uniqueItems);
        return uniqueItems
    }    

    const getItems = ( photos ) => {
        let locations = findUnique(photos, title)
        return locations
    }

    const getResetClass = () => {
        return "badge"
    }

    return (
        <>
            <h6><Icon icon={icon} /> {title} <span  onClick={() => callback("")}  className={getResetClass()} >Reset</span> </h6>
            <div className="collection z-depth-5">
                { getItems( photos ).map((item, index) => (
                    
                    <div className="collection-item" onClick={() => callback(item.value)} key={index}>
                        <Icon icon={icon} /> 
                        {item.value}  <span class="badge">{item.count}</span> </div>
                ))}


            </div>
            <br />
        </>
    )
}

