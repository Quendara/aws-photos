import React from "react";
import { Icon } from "./Icons"
import { findUnique } from "./helpers"
import Card from '@material-ui/core/Card';

export const TopList = ({ photos, icon, title, titleAlt="", sortByCount = true, limit=1, callback = undefined, rendering="menu" }) => {

    const getItems = (photos) => {
        const group = title

        let locations = findUnique(photos, group, sortByCount, limit )
        return locations
    }

    const getResetClass = () => {
        return "badge"
    }

    return (
        <>
        { ( rendering === "menu") ? (
        <>
            <h6><Icon icon={ icon } className="mr-2" /> <span style={{'textTransform':'capitalize'}}>{ title }</span> <span onClick={ () => callback(title, "") } className={ getResetClass() } >Reset</span> </h6>
            <div className="row">
                { getItems(photos).map((item, index) => (
                    <div className="col m-1 offset-s1  s11" onClick={ () => callback(title, item.value) } key={ index }>
                        
                        <div className="mouse-pointer text-ellipsis"><Icon icon={ icon } className="mr-2 grey-text text-darken-2" /> { item.value }</div>
                        <span className="badge blue-text ">{ item.count }</span> </div>
                )) }
            </div>
            <br />
        </>
        ) :
        (
            <Card>
            
                
                    <b><Icon icon={ icon } className="ml-2 mr-2" /> <span style={{'textTransform':'capitalize'}}>{ titleAlt.length > 0 ? titleAlt : title }</span> <span onClick={ () => callback(title, "") } className={ getResetClass() } >X</span> </b>
                
                    <ul className="collection">
                { getItems(photos).map((item, index) => (
                    <li className="collection-item mouse-pointer grey darken-4" onClick={ () => callback(title, item.value) } key={ index }>
                        
                        <Icon icon={ icon } className="mr-2 grey-text " /> { item.value }
                        <span className="secondary-content ">{ item.count }</span> 
                    </li>
                )) }
            </ul>
            </Card>
        )}
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