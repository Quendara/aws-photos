import React from 'react';
import { Icon } from "./Icons"
import Button from '@material-ui/core/Button';

export const SelectionView = ({ valueArr, keyArr, iconsOnly, currentValue, callback }) => {


    const getClass = (item) => {
        if (item === currentValue) {
            return "info"
        }
        else {
            return "primary"
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
                    <Button key={ index } color={ getClass(item) } onClick={ () => callbackLocal(item) } ><Icon icon={ item } className="ml-2 mr-2" /> { getItemName(item) }</Button>
                )
            }) }
        </>
    )
}





