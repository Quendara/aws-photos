import React from 'react';
import { Icon } from "./Icons"

export const SelectionView = ({ valueArr, keyArr, iconsOnly, currentValue, callback }) => {


    const getClass = (item) => {
        if (item === currentValue) {
            return "btn blue m-1"
        }
        else {
            return "btn blue-text text-lighten-2 blue darken-4 m-1"
        }
    } 

    const callbackLocal = (item) => {
        if (callback !== undefined) {
            callback(item)
        }
        else {
            console.error("callback is not defined")
        }
    }

    const getItemName = (item) => {
        if (iconsOnly) return ""
        return item;
    }

    return (
        <>
            { valueArr.map((item, index) => {
                return (
                    <a key={ index } className={ getClass(item) } onClick={ () => callbackLocal(item) } ><Icon icon={ item } className="ml-2 mr-2" /> { getItemName(item) }</a>
                )
            }) }
        </>
    )
}





