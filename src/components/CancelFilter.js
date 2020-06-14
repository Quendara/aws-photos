import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "./Icons"

export const CancelFilter = ({ value, filter, callback }) => {

    

    return (
        <>
        { value.length > 0 && <button className="btn blue ml-2" onClick={() => callback( filter,"")}  ><b>{value} </b><Icon icon="cancel" className="ml-2" ></Icon></button>     }
        </>
    )
}

