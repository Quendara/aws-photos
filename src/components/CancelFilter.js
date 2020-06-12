import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "./Icons"

export const CancelFilter = ({ value, callback }) => {

    

    return (
        <>
        { value.length > 0 && <button className="btn blue ml-2" onClick={() => callback("")}  ><b>{value} </b><Icon icon="cancel" className="ml-2" ></Icon></button>     }
        </>
    )
}

