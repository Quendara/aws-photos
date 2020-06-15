import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "./Icons"

export const SelectionView = ({ valueArr, currentValue, callback }) => {


    const getClass = ( item ) => {
        if( item == currentValue ){
            return "btn blue ml-1" 
        }
        else{
            return  "btn ml-1"
        }        
    }

    const callbackLocal = ( item ) => {
        if( callback != undefined ){
            callback( item )     
        }
        else{
            console.error( "callback is not defined" )
        }
    }    

    return (
        <>
            { valueArr.map((item, index) => {
                return (
                    <a className={getClass(item) } onClick={ () => callbackLocal(item)} >{ item }</a>
                )
            }) }
        </>
    )
}

